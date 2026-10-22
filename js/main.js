/* Lorenzo D'Oliveira · landing page: animações (GSAP 3.13 + Lenis) */
(function () {
  'use strict';

  const raiz = document.documentElement;
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toque = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (seletor, base = document) => base.querySelector(seletor);
  const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));
  const tem = (nome) => Boolean(window[nome]);
  const limitar = (valor, min = 0, max = 1) => Math.min(max, Math.max(min, valor));
  const SIMBOLOS = '01<>/{}#_=+';
  // Cenas presas na rolagem só quando a tela tem altura para isso. Em tela baixa (celular
  // deitado), a mesma animação acompanha a rolagem sem prender.
  const ALTA = '(min-height: 561px)';
  const BAIXA = '(max-height: 560px)';

  // Cada bloco roda isolado: se um quebrar, o resto da página continua.
  function rodar(nome, fn) {
    try {
      fn();
    } catch (erro) {
      console.error(`[${nome}]`, erro);
    }
  }

  /* =========================================================================
     Partes que não dependem do GSAP: a página fica completa e legível mesmo
     sem animação (movimento reduzido ou CDN fora do ar).
     ========================================================================= */

  function engrenagem(cx, cy, fora, dentro, dentes) {
    const passo = (Math.PI * 2) / dentes;
    const ponto = (angulo, r) => `${(cx + Math.cos(angulo) * r).toFixed(1)} ${(cy + Math.sin(angulo) * r).toFixed(1)}`;
    const pontos = [];
    for (let i = 0; i < dentes; i++) {
      const a = i * passo - Math.PI / 2;
      pontos.push(ponto(a - passo * 0.3, dentro), ponto(a - passo * 0.17, fora), ponto(a + passo * 0.17, fora), ponto(a + passo * 0.3, dentro));
    }
    return `M${pontos.join(' L')} Z`;
  }

  // Números em rolo: uma coluna de 0 a 9 (duas voltas) por dígito; o resto fica parado
  function montarOdometro(el) {
    const valor = el.dataset.valor || el.textContent.trim();
    el.textContent = '';
    const leitura = document.createElement('span');
    leitura.className = 'sr';
    leitura.textContent = valor;
    el.appendChild(leitura);
    el.colunas = [];
    [...valor].forEach((caractere) => {
      if (/\d/.test(caractere)) {
        const coluna = document.createElement('span');
        coluna.className = 'odometro__coluna';
        coluna.setAttribute('aria-hidden', 'true');
        for (let n = 0; n < 20; n++) {
          const casa = document.createElement('span');
          casa.textContent = n % 10;
          coluna.appendChild(casa);
        }
        const alvo = 10 + Number(caractere);
        coluna.style.transform = `translateY(${-alvo * 5}%)`;
        el.appendChild(coluna);
        el.colunas.push({ coluna, alvo });
      } else {
        const fixo = document.createElement('span');
        fixo.className = 'odometro__fixo';
        fixo.setAttribute('aria-hidden', 'true');
        fixo.textContent = caractere;
        el.appendChild(fixo);
      }
    });
  }

  // Relógio da madrugada: cada dígito tem a sequência 23:59 → 00:00 → 01:00 → 02:00
  function montarRelogio() {
    $$('.relogio__dig').forEach((digito) => {
      const sequencia = digito.dataset.seq.split('');
      digito.textContent = '';
      const coluna = document.createElement('span');
      coluna.className = 'relogio__coluna';
      sequencia.forEach((n) => {
        const casa = document.createElement('span');
        casa.textContent = n;
        coluna.appendChild(casa);
      });
      coluna.style.transform = `translateY(${(-100 * (sequencia.length - 1)) / sequencia.length}%)`;
      digito.appendChild(coluna);
    });
  }

  // Gráfico ilustrativo dos robôs de trade: duas curvas sorteadas com semente fixa
  // (sempre iguais), sem valores no eixo. Não é resultado real.
  function montarGrafico() {
    const svg = $('.grafico__svg');
    if (!svg) return;
    const L = 800;
    const A = 340;
    svg.setAttribute('viewBox', `0 0 ${L} ${A}`);
    let grade = '';
    for (let k = 1; k <= 4; k++) grade += `<line x1="0" x2="${L}" y1="${(k * A) / 4}" y2="${(k * A) / 4}"/>`;
    for (let s = 1; s < 8; s++) grade += `<line class="semana" x1="${s * 100}" x2="${s * 100}" y1="0" y2="${A}"/>`;
    $('.grafico__grade', svg).innerHTML = grade;

    const sorteio = (semente) => () => {
      semente = (semente + 0x6d2b79f5) | 0;
      let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const serie = (semente, tendencia, oscilacao) => {
      const r = sorteio(semente);
      let v = 0;
      const pontos = [0];
      for (let i = 1; i <= 56; i++) {
        v += tendencia + (r() - 0.5) * oscilacao;
        pontos.push(v);
      }
      return pontos;
    };
    const a = serie(11, 0.2, 3.4);
    const b = serie(23, 0.12, 2.6);
    const todos = a.concat(b);
    const min = Math.min(...todos);
    const max = Math.max(...todos);
    const x = (i) => (i / 56) * L;
    const y = (v) => A - 26 - ((v - min) / (max - min)) * (A - 56);
    const f = (n) => n.toFixed(1);
    const caminho = (serieY) => {
      const p = serieY.map((v, i) => [x(i), y(v)]);
      let d = `M${f(p[0][0])} ${f(p[0][1])}`;
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] || p2;
        d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      }
      return d;
    };
    const linhaA = $('.grafico__linha--a', svg);
    const linhaB = $('.grafico__linha--b', svg);
    linhaA.setAttribute('d', caminho(a));
    linhaB.setAttribute('d', caminho(b));

    // As linhas aparecem por um recorte que anda junto com a semana
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `<clipPath id="grafico-corte"><rect class="grafico__corte" x="-10" y="-20" width="${L + 20}" height="${A + 40}"/></clipPath>`;
    svg.insertBefore(defs, svg.firstChild);
    const grupo = document.createElementNS(NS, 'g');
    grupo.setAttribute('clip-path', 'url(#grafico-corte)');
    svg.insertBefore(grupo, linhaB);
    grupo.append(linhaB, linhaA);
    [[b, 'var(--texto)'], [a, 'var(--azul)']].forEach(([serieY, cor]) => {
      const ponta = document.createElementNS(NS, 'circle');
      ponta.setAttribute('class', 'grafico__ponta');
      ponta.setAttribute('cx', L);
      ponta.setAttribute('cy', f(y(serieY[serieY.length - 1])));
      ponta.setAttribute('r', 6);
      ponta.style.fill = cor;
      grupo.appendChild(ponta);
    });
    $('.grafico__cursor', svg).setAttribute('y2', A);
  }

  rodar('estatico', () => {
    const forma = $('.engrenagem__forma');
    if (forma) forma.setAttribute('d', engrenagem(300, 300, 232, 194, 12));
    $$('.odometro').forEach(montarOdometro);
    montarRelogio();
    montarGrafico();
  });

  // Sem GSAP, a página fica parada e legível.
  if (!tem('gsap') || !tem('ScrollTrigger')) {
    raiz.classList.remove('anima');
    return;
  }

  gsap.registerPlugin(...['ScrollTrigger', 'SplitText', 'ScrambleTextPlugin', 'DrawSVGPlugin', 'MorphSVGPlugin', 'Flip', 'CustomEase', 'MotionPathPlugin']
    .filter(tem)
    .map((nome) => window[nome]));
  if (tem('CustomEase')) CustomEase.create('suave', '0.16, 1, 0.3, 1');
  const EASE = tem('CustomEase') ? 'suave' : 'expo.out';
  // No celular, a barra de endereço some e volta ao rolar: isso não deve recalcular a página
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Rolagem suave ---------- */
  let lenis = null;
  function rolagemSuave() {
    if (reduzir || !tem('Lenis')) return;
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function ancoras() {
    $$('a[href^="#"]').forEach((link) => link.addEventListener('click', (evento) => {
      const alvo = $(link.getAttribute('href'));
      if (!alvo) return;
      evento.preventDefault();
      if (lenis) lenis.scrollTo(alvo, { duration: 1.6 });
      else alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' });
    }));
  }

  // Gatilho de uma cena: presa em tela alta, solta (acompanhando a rolagem) em tela baixa
  function cena(trigger, alta, telas, extra = {}) {
    if (alta) {
      return {
        trigger,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * telas)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        ...extra,
      };
    }
    return { trigger, start: 'top 72%', end: 'bottom 30%', scrub: 0.8, invalidateOnRefresh: true, ...extra };
  }

  /* =========================================================================
     CAPA: um pedido se digita na barra de prompt e, ao enviar, a página monta
     o resto da capa (moldes em linha que viram o conteúdo de verdade).
     ========================================================================= */
  function capa() {
    const palco = $('.capa__palco');
    const prompt = $('.prompt');
    const digitado = $('.prompt__digitado');
    const estado = $('.prompt__estado-texto');
    const giro = $('.prompt__giro');
    const enviar = $('.prompt__enviar');
    const molde = $('.capa__molde');
    const pedido = digitado.textContent;
    // Placeholder que gira depois de pronta (base: "AI Prompt Input" do 21st.dev)
    const SUGESTOES = [
      'automatize o contas a pagar',
      'monte um time de agentes de marketing',
      'atualize o relatório às 02:00',
      'lance os boletos no ERP com 8 travas',
      'crie um software sob medida',
    ];
    if (reduzir) return;

    // Rolagem: a capa vira um cartão que recua enquanto a história sobe por cima
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.capa', start: 'top top', end: '+=100%', pin: true, pinSpacing: false, scrub: true },
    })
      .fromTo(palco, { scale: 1, yPercent: 0, borderRadius: 0 }, { scale: 0.86, yPercent: -5, borderRadius: 40 }, 0)
      .fromTo('.capa__sombra', { opacity: 0 }, { opacity: 0.6 }, 0);

    raiz.classList.add('capa-js');
    const linhas = $$('.capa__linha');
    const nome = linhas.map((linha) => SplitText.create(linha, { type: 'chars', charsClass: 'letra' }));
    const frase = SplitText.create('.capa__frase', { type: 'words', mask: 'words' });
    gsap.set(frase.masks, { paddingRight: '0.12em', marginRight: '-0.12em', paddingBottom: '0.12em', marginBottom: '-0.12em' });
    // cada linha do nome vira a "máscara" das próprias letras durante a entrada
    gsap.set(linhas, { overflow: 'hidden', paddingTop: '0.1em', marginTop: '-0.1em', paddingBottom: '0.08em', marginBottom: '-0.08em' });

    // Moldes: retângulos em linha onde cada parte da capa vai aparecer
    const rp = palco.getBoundingClientRect();
    molde.setAttribute('viewBox', `0 0 ${rp.width} ${rp.height}`);
    let rotuloAnterior = '';
    const faixa = document.createRange();
    $$('[data-molde]', palco).forEach((el) => {
      faixa.selectNodeContents(el);
      const r = faixa.getBoundingClientRect();
      const x = r.left - rp.left - 10;
      const y = r.top - rp.top - 6;
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', x.toFixed(1));
      rect.setAttribute('y', y.toFixed(1));
      rect.setAttribute('width', (r.width + 20).toFixed(1));
      rect.setAttribute('height', (r.height + 12).toFixed(1));
      rect.setAttribute('rx', 8);
      molde.appendChild(rect);
      const rotulo = el.dataset.molde;
      if (rotulo && rotulo !== rotuloAnterior) {
        const texto = document.createElementNS(NS, 'text');
        texto.setAttribute('x', (x + 2).toFixed(1));
        texto.setAttribute('y', (y - 9).toFixed(1));
        texto.textContent = `<${rotulo}>`;
        molde.appendChild(texto);
      }
      rotuloAnterior = rotulo;
    });
    const retangulos = $$('rect', molde);
    const rotulos = $$('text', molde);

    // Indicador de "pensando" do Claude Code
    const GIROS = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];
    let giroAtivo = null;
    const girar = (ligar) => {
      clearInterval(giroAtivo);
      if (!ligar) return;
      let i = 0;
      giroAtivo = setInterval(() => { giro.textContent = GIROS[i++ % GIROS.length]; }, 110);
    };

    // Estado inicial: só a barra de prompt, no meio da tela
    const caixa = prompt.getBoundingClientRect();
    const escala = window.innerWidth >= 900 ? 1.12 : 1;
    const dx = window.innerWidth / 2 - (caixa.left + caixa.width / 2);
    const dy = window.innerHeight / 2 - (caixa.top + caixa.height / 2);
    const letras = nome.map((s) => s.chars);
    gsap.set(letras.flat(), { yPercent: 118 });
    gsap.set(frase.words, { yPercent: 110 });
    gsap.set(['.capa__sobre', '.capa__meta li', '.capa__rolar', '.topo > *'], { autoAlpha: 0, y: 16 });
    gsap.set(prompt, { x: dx, y: dy, scale: escala });
    gsap.set(retangulos, { drawSVG: '0%' });
    gsap.set(rotulos, { autoAlpha: 0 });
    prompt.classList.add('prompt--vazio');
    digitado.textContent = '';
    estado.textContent = 'Claude Code';

    const contador = { n: 0 };
    const tDigitar = pedido.length * 0.026;
    const tEnviar = 0.55 + tDigitar + 0.25;
    const tMontar = tEnviar + 0.55;
    const entrada = gsap.timeline({ delay: 0.25, defaults: { ease: EASE } });
    entrada
      .fromTo(prompt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0)
      .fromTo(prompt, { y: dy + 26 }, { y: dy, duration: 0.9 }, 0)
      .to(contador, {
        n: pedido.length,
        duration: tDigitar,
        ease: 'none',
        onUpdate: () => {
          digitado.textContent = pedido.slice(0, Math.round(contador.n));
          prompt.classList.toggle('prompt--vazio', contador.n < 1);
        },
      }, 0.55)
      .to(enviar, { scale: 0.78, duration: 0.12, ease: 'power2.in' }, tEnviar - 0.1)
      .to(enviar, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, tEnviar + 0.02)
      .add(() => {
        prompt.classList.add('prompt--enviado');
        estado.textContent = 'Montando a capa…';
        girar(true);
      }, tEnviar)
      .to(retangulos, { drawSVG: '100%', duration: 0.75, stagger: 0.07, ease: 'power2.inOut' }, tEnviar + 0.1)
      .to(rotulos, { autoAlpha: 1, duration: 0.25, stagger: 0.07 }, tEnviar + 0.15)
      .to(prompt, { x: 0, y: 0, scale: 1, duration: 1.4 }, tMontar)
      .to('.capa__sobre', { autoAlpha: 1, y: 0, duration: 0.9 }, tMontar + 0.1)
      .to(letras[0], { yPercent: 0, duration: 1.2, stagger: 0.035 }, tMontar + 0.15)
      .to(letras[1], { yPercent: 0, duration: 1.2, stagger: 0.035 }, tMontar + 0.3)
      .to(frase.words, { yPercent: 0, duration: 1, stagger: 0.04 }, tMontar + 0.55)
      .to(['.capa__meta li', '.capa__rolar'], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, tMontar + 0.75)
      .to('.topo > *', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, tMontar + 0.6)
      .to(retangulos, { autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'power1.out' }, tMontar + 1.0)
      .to(rotulos, { autoAlpha: 0, duration: 0.4 }, tMontar + 1.0)
      .add(() => {
        girar(false);
        giro.textContent = '✓';
        estado.textContent = 'Capa pronta';
        prompt.classList.remove('prompt--enviado');
      }, tMontar + 1.3)
      .add(() => {
        // Desfaz as divisões: o texto volta a ter o espaçamento original das letras
        nome.forEach((s) => s.revert());
        frase.revert();
        gsap.set(linhas, { clearProps: 'overflow,paddingTop,marginTop,paddingBottom,marginBottom' });
        molde.remove();
      }, tMontar + 2.2)
      .add(sugestoes, tMontar + 3.4);

    // Se a página abriu no meio (voltou de outra página), a capa já aparece pronta
    if (window.scrollY > 40) entrada.progress(1);

    function sugestoes() {
      giro.textContent = '✻';
      estado.textContent = 'Feito com Claude Code';
      const lista = [...SUGESTOES, pedido];
      const ciclo = gsap.timeline({ repeat: -1 });
      lista.forEach((texto, i) => {
        const antes = i === 0 ? pedido : lista[i - 1];
        const apagar = { n: antes.length };
        const escrever = { n: 0 };
        ciclo
          .to(apagar, {
            n: 0,
            duration: Math.min(0.7, antes.length * 0.014),
            ease: 'none',
            delay: 2.4,
            onUpdate: () => { digitado.textContent = antes.slice(0, Math.round(apagar.n)); },
          })
          .to(escrever, {
            n: texto.length,
            duration: texto.length * 0.034,
            ease: 'none',
            onUpdate: () => { digitado.textContent = texto.slice(0, Math.round(escrever.n)); },
          }, '+=0.3');
      });
      // Só gira com a capa na tela
      ScrollTrigger.create({
        start: 0,
        end: () => window.innerHeight,
        onToggle: (self) => (self.isActive ? ciclo.resume() : ciclo.pause()),
      });
    }
  }

  /* =========================================================================
     A HISTÓRIA: frases enormes presas na rolagem, palavra por palavra (base:
     "Scroll word reveal" do 21st.dev), e a engrenagem que gira e vira </>.
     ========================================================================= */
  function historia() {
    const secao = $('.historia');
    const frases = $$('.frase', secao);
    const arte = $('.engrenagem', secao);
    const forma = $('.engrenagem__forma', secao);
    const eixo = $('.engrenagem__eixo', secao);
    if (reduzir) return;

    const palavras = frases.map((frase) => SplitText.create(frase, { type: 'words', wordsClass: 'palavra' }).words);
    gsap.set(frases.slice(1), { autoAlpha: 0 });
    gsap.set(palavras.flat(), { opacity: 0.13 });

    // A engrenagem se desenha enquanto a seção sobe por cima da capa
    const chegada = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: secao, start: 'top 92%', end: 'top top', scrub: 1 },
    });
    if (tem('DrawSVGPlugin')) {
      chegada.fromTo(forma, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 0)
        .fromTo(eixo, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7 }, 0.3);
    }
    chegada.fromTo(arte, { rotation: -120 }, { rotation: 0, duration: 1 }, 0);

    const CODIGO = 'M180 170 L50 300 L180 430 M420 170 L550 300 L420 430 M355 135 L245 465';
    const PASSO = 1.2;
    const n = frases.length;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: secao,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    frases.forEach((frase, i) => {
      const inicio = i * PASSO;
      if (i > 0) tl.fromTo(frase, { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 0.22, ease: 'power2.out' }, inicio - 0.08);
      tl.to(palavras[i], { opacity: 1, duration: 0.18, stagger: 0.66 / palavras[i].length }, inicio);
      if (i < n - 1) tl.to(frase, { autoAlpha: 0, yPercent: -16, duration: 0.22, ease: 'power2.in' }, inicio + 0.98);
    });
    const fim = (n - 1) * PASSO + 1.1;
    tl.fromTo('.historia__barra i', { scaleX: 0 }, { scaleX: 1, duration: fim }, 0)
      .fromTo(arte, { rotation: 0 }, { rotation: 540, duration: 2.6, immediateRender: false }, 0)
      // violeta enquanto fala de IA, azul quando vira automação
      .to([forma, eixo], { stroke: '#6cc4ff', duration: 0.3 }, PASSO - 0.1)
      .set(forma, { strokeDasharray: 'none' }, 2.1)
      .to(eixo, { scale: 0, opacity: 0, svgOrigin: '300 300', duration: 0.4, ease: 'power2.in' }, 2.2)
      .fromTo(arte, { rotation: 540 }, { rotation: 720, duration: 0.8, ease: 'power2.inOut', immediateRender: false }, 2.6)
      .to({}, { duration: 0.3 }, fim);
    if (tem('MorphSVGPlugin')) tl.to(forma, { morphSVG: { shape: CODIGO, shapeIndex: 'auto' }, duration: 0.8, ease: 'power2.inOut' }, 2.2);
  }

  /* =========================================================================
     GRUPO ASTE: os setores automatizados entram em sequência e cada ícone se
     desenha quando o cartão chega.
     ========================================================================= */
  function aste() {
    if (reduzir) return;
    const setores = $$('.setor');
    if (!setores.length) return;
    gsap.set(setores, { y: 60, opacity: 0 });
    ScrollTrigger.batch(setores, {
      start: 'top 88%',
      once: true,
      onEnter: (lote) => {
        gsap.to(lote, { y: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: 0.09, overwrite: 'auto' });
        lote.forEach((setor, i) => {
          const tracos = $$('.setor__icone path, .setor__icone rect, .setor__icone circle', setor);
          if (tem('DrawSVGPlugin')) gsap.fromTo(tracos, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut', delay: 0.2 + i * 0.09 });
          gsap.from($('.setor__icone', setor), { scale: 0.6, rotation: -20, duration: 0.9, ease: 'back.out(2)', delay: 0.1 + i * 0.09 });
        });
      },
    });
  }

  /* =========================================================================
     FERRAMENTAS: três anéis de logos girando em volta da marca, cada um num
     sentido; a rolagem dá um empurrão no giro e os logos ficam sempre de pé
     (base: "Orbiting Circles" do 21st.dev).
     ========================================================================= */
  function ferramentas() {
    if (reduzir) return;
    const palco = $('.orbita__palco');
    if (!palco) return;
    const aneis = $$('.orbita__anel', palco).map((anel) => ({
      anel,
      pecas: $$('.orbita__peca', anel),
      // graus por segundo; o de dentro gira mais rápido e cada anel vai num sentido
      velocidade: { 1: 9, 2: -6, 3: 4 }[anel.dataset.anel] || 5,
      angulo: 0,
    }));

    // Entrada: os anéis abrem do centro e os logos chegam um a um
    gsap.set(aneis.map((a) => a.anel), { scale: 0.4, opacity: 0 });
    gsap.set($$('.orbita__logo, .orbita__nome', palco), { scale: 0, opacity: 0 });
    gsap.set('.orbita__centro', { scale: 0.6, opacity: 0 });
    ScrollTrigger.create({
      trigger: palco,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.timeline({ defaults: { ease: EASE } })
          .to('.orbita__centro', { scale: 1, opacity: 1, duration: 1 }, 0)
          .to(aneis.slice().reverse().map((a) => a.anel), { scale: 1, opacity: 1, duration: 1.4, stagger: 0.12 }, 0.1)
          .to($$('.orbita__logo', palco), { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)', stagger: { each: 0.035, from: 'random' } }, 0.5)
          .to($$('.orbita__nome', palco), { scale: 1, opacity: 1, duration: 0.6, stagger: 0.02 }, 0.9);
      },
    });

    let visivel = false;
    let empurrao = 0;
    let parado = false;
    ScrollTrigger.create({
      trigger: palco,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { visivel = self.isActive; },
      onUpdate: (self) => { empurrao = Math.max(-240, Math.min(240, self.getVelocity() * 0.05)); },
    });
    // Com o mouse em cima de um logo, a órbita para para a pessoa ler
    if (!toque) {
      palco.addEventListener('pointerover', (e) => { if (e.target.closest('.orbita__peca')) parado = true; });
      palco.addEventListener('pointerout', (e) => { if (e.target.closest('.orbita__peca')) parado = false; });
    }
    gsap.ticker.add((tempo, delta) => {
      if (!visivel) return;
      empurrao *= 0.92;
      const passo = parado ? 0 : delta / 1000;
      aneis.forEach((a) => {
        a.angulo += a.velocidade * passo + Math.sign(a.velocidade) * empurrao * passo * 0.6;
        gsap.set(a.anel, { rotation: a.angulo });
        gsap.set(a.pecas, { rotation: -a.angulo });
      });
    });
  }

  /* =========================================================================
     CENTRAL DE CONTAS A PAGAR: o fluxo se desenha e um boleto (fictício) passa
     por cada etapa; depois ele anda pelas colunas do painel.
     ========================================================================= */
  function central() {
    const secao = $('#central');
    const palco = $('.central__palco', secao);
    const area = $('.fluxo__area', secao);
    const svg = $('.fluxo__svg', area);
    const base = $('.fluxo__base', area);
    const feito = $('.fluxo__feito', area);
    const nos = $$('.no', area);
    const boleto = $('.boleto', area);
    const etapas = $$('.etapas__lista li', secao);
    const atual = $('.etapas__atual', secao);
    const geo = { comprimento: 1, fracoes: [] };

    function medir() {
      const ra = area.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${ra.width.toFixed(1)} ${ra.height.toFixed(1)}`);
      const centros = nos.map((no) => {
        const r = $('.no__icone', no).getBoundingClientRect();
        return { x: r.left - ra.left + r.width / 2, y: r.top - ra.top + r.height / 2 };
      });
      const f = (n) => n.toFixed(1);
      let d = `M${f(centros[0].x)} ${f(centros[0].y)}`;
      const parciais = [0];
      for (let k = 1; k < centros.length; k++) {
        const a = centros[k - 1];
        const b = centros[k];
        const meio = (a.x + b.x) / 2;
        d += Math.abs(b.x - a.x) < 2 ? ` L${f(b.x)} ${f(b.y)}` : ` C${f(meio)} ${f(a.y)} ${f(meio)} ${f(b.y)} ${f(b.x)} ${f(b.y)}`;
        feito.setAttribute('d', d);
        parciais.push(feito.getTotalLength());
      }
      base.setAttribute('d', d);
      geo.comprimento = Math.max(1, feito.getTotalLength());
      geo.fracoes = parciais.map((p) => p / geo.comprimento);
      feito.style.strokeDasharray = `${geo.comprimento} ${geo.comprimento}`;
    }

    function pintar(t) {
      const p = limitar((t - 0.04) / 0.62);
      feito.style.strokeDashoffset = geo.comprimento * (1 - p);
      const ponto = feito.getPointAtLength(p * geo.comprimento);
      gsap.set(boleto, { x: ponto.x, y: ponto.y, autoAlpha: p > 0.003 && p < 0.996 ? 1 : 0 });
      nos.forEach((no, i) => no.classList.toggle('is-ativo', t > 0.02 && p >= geo.fracoes[i] - 0.004));
      const q = limitar((t - 0.69) / 0.27);
      const indice = q <= 0 ? -1 : Math.min(etapas.length - 1, Math.floor(q * etapas.length));
      etapas.forEach((li, i) => {
        li.classList.toggle('is-feita', i < indice);
        li.classList.toggle('is-atual', i === indice);
      });
      atual.textContent = etapas[Math.max(0, indice)].textContent;
    }

    medir();
    if (reduzir) {
      pintar(1);
      window.addEventListener('resize', () => { medir(); pintar(1); });
      return;
    }
    pintar(0);
    const mm = gsap.matchMedia();
    mm.add({ alta: ALTA, baixa: BAIXA }, (contexto) => {
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        ease: 'none',
        onUpdate: () => pintar(proxy.t),
        scrollTrigger: cena(palco, contexto.conditions.alta, 2.6, {
          onRefresh: () => { medir(); pintar(proxy.t); },
        }),
      });
    });

    // As conferências se marcam uma a uma
    const lista = $('.conferencias__lista', secao);
    const itens = $$('li', lista);
    const marcas = $$('path', lista);
    const tl = gsap.timeline({ scrollTrigger: { trigger: lista, start: 'top 82%' } });
    tl.fromTo(itens, { '--traco': 0 }, { '--traco': 1, duration: 1, stagger: 0.1, ease: 'expo.inOut' }, 0)
      .from(itens, { x: -14, opacity: 0, duration: 0.8, stagger: 0.1, ease: EASE }, 0.1);
    if (tem('DrawSVGPlugin')) tl.fromTo(marcas, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.35);
  }

  /* =========================================================================
     LANÇADOR NO ERP: 1 clique liga o mostrador; as 8 travas fecham uma a uma e
     o cronômetro chega a 1:30 (~1,5 min) enquanto as etapas acendem.
     ========================================================================= */
  function lancador() {
    const secao = $('#lancador');
    const palco = $('.lancador__palco', secao);
    const aro = $('.mostrador__feito', secao);
    const travas = $$('.trava', secao);
    const alcas = travas.map((trava) => $('.trava__alca', trava));
    const passos = $$('.passos li', secao);
    const clique = $('.clique', secao);
    const cronometro = $('.cronometro', secao);
    const tempo = $('.cronometro__tempo', secao);
    const legenda = $('.cronometro__sub', secao);
    if (reduzir) return;

    const VOLTA = 2 * Math.PI * 150;
    const T0 = 0.9;
    const T1 = 10;
    const janela = (k) => T0 + (k * (T1 - T0)) / passos.length;
    const fechaEm = (k) => janela(1) + ((k + 0.6) * (janela(2) - janela(1))) / 8.6;
    const formatar = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    function atualizar(t) {
      tempo.textContent = formatar(limitar((t - T0) / (T1 - T0)) * 90);
      legenda.textContent = t >= T1 - 0.02 ? 'pronto' : 'lançando';
      // A legenda mostra a etapa da vez (antes de começar, a primeira; no fim, a última)
      let vez = passos.findIndex((li, k) => t >= janela(k) && t < janela(k + 1));
      if (vez < 0) vez = t < T0 ? 0 : passos.length - 1;
      passos.forEach((li, k) => {
        li.classList.toggle('is-feito', t >= janela(k + 1));
        li.classList.toggle('is-atual', t >= janela(k) && t < janela(k + 1));
        li.classList.toggle('is-visivel', k === vez);
      });
      travas.forEach((trava, k) => trava.classList.toggle('is-fechada', t >= fechaEm(k) + 0.05));
    }

    const mm = gsap.matchMedia();
    mm.add({ alta: ALTA, baixa: BAIXA }, (contexto) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => atualizar(tl.time()),
        scrollTrigger: cena(palco, contexto.conditions.alta, 2.3),
      });
      tl.fromTo(aro, { strokeDasharray: VOLTA, strokeDashoffset: VOLTA }, { strokeDashoffset: 0, duration: T1 - T0 }, T0)
        .fromTo(clique, { scale: 1, autoAlpha: 1 }, { scale: 0.9, duration: 0.3, ease: 'power2.in' }, 0.1)
        .to(clique, { scale: 0.55, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.42)
        .fromTo(cronometro, { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.6);
      alcas.forEach((alca, k) => tl.fromTo(alca, { y: -3.5 }, { y: 0, duration: 0.16, ease: 'back.out(3)' }, fechaEm(k)));
      tl.to({}, { duration: 0.7 }, T1);
      atualizar(0);
    });
  }

  /* =========================================================================
     ATUALIZAÇÃO DIÁRIA: o relógio rola até 02:00 e o fluxo roda em três cenários.
     ========================================================================= */
  function madrugada() {
    const secao = $('#madrugada');
    const colunas = $$('.relogio__coluna', secao);
    const trilha = $('.trilha', secao);
    const paradas = $$('.parada', trilha);
    const aviso = $('.aviso', trilha);
    const avisoTexto = $('.aviso__texto', aviso);
    const avisoSinal = $('.aviso__sinal', aviso);
    const botoes = $$('.cenario', secao);
    const CENARIOS = {
      novo: { ate: 4, falha: -1, sinal: '✓', texto: 'Arquivo novo: a planilha é atualizada, conferida, e o gestor recebe o resumo.' },
      sem: { ate: 0, falha: 0, sinal: '!', texto: 'Sem arquivo novo: avisa e não mexe na planilha.' },
      erro: { ate: 2, falha: 2, sinal: '!', texto: 'Erro na gravação: a conferência pega e o fluxo avisa.' },
    };

    function posicionar(cenario, animar) {
      const largo = window.innerWidth >= 900;
      const alvo = paradas[cenario.falha >= 0 ? cenario.falha : paradas.length - 1];
      let x = 0;
      let ponta = 28;
      if (largo) {
        x = Math.min(alvo.offsetLeft, Math.max(0, trilha.clientWidth - aviso.offsetWidth));
        ponta = alvo.offsetLeft + 42 - x;
      }
      aviso.style.setProperty('--ponta', `${ponta}px`);
      if (animar && !reduzir) gsap.to(aviso, { x, duration: 0.7, ease: EASE });
      else gsap.set(aviso, { x });
    }

    function aplicar(nome, animar) {
      const c = CENARIOS[nome];
      trilha.dataset.cenario = nome;
      botoes.forEach((b) => {
        b.classList.toggle('is-ativo', b.dataset.cenario === nome);
        b.setAttribute('aria-pressed', String(b.dataset.cenario === nome));
      });
      avisoTexto.textContent = c.texto;
      avisoSinal.textContent = c.sinal;
      const marcar = (parada, i) => {
        parada.classList.toggle('is-ok', i <= c.ate && i !== c.falha);
        parada.classList.toggle('is-falha', i === c.falha);
        parada.classList.toggle('is-pulada', i > c.ate);
      };
      posicionar(c, animar);
      if (!animar || reduzir) {
        paradas.forEach(marcar);
        return;
      }
      // O fluxo "roda" de novo: cada etapa acende na sua vez
      paradas.forEach((p) => p.classList.remove('is-ok', 'is-falha', 'is-pulada'));
      const tl = gsap.timeline();
      paradas.forEach((parada, i) => {
        tl.call(() => marcar(parada, i), null, i * 0.17);
        if (i <= c.ate) tl.fromTo(parada, { y: 0 }, { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }, i * 0.17);
      });
      tl.fromTo(aviso, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE }, (c.ate + 1) * 0.17);
    }

    botoes.forEach((botao) => botao.addEventListener('click', () => aplicar(botao.dataset.cenario, true)));
    aplicar('novo', false);
    window.addEventListener('resize', () => posicionar(CENARIOS[trilha.dataset.cenario], false));
    if (reduzir) return;

    // 23:59 → 00:00 → 01:00 → 02:00, cada virada com o seu "tique"
    const passos = colunas[0].children.length - 1;
    const relogio = { p: 0 };
    const virar = gsap.parseEase('power3.inOut');
    colunas.forEach((coluna) => { coluna.style.transform = ''; });
    gsap.to(relogio, {
      p: 1,
      ease: 'none',
      onUpdate: () => {
        const s = relogio.p * passos;
        const inteiro = Math.min(passos - 1, Math.floor(s));
        const posicao = inteiro + virar(limitar(s - inteiro));
        gsap.set(colunas, { yPercent: (-100 * posicao) / (passos + 1) });
      },
      scrollTrigger: { trigger: '.relogio', start: 'top 82%', end: 'top 20%', scrub: 0.6 },
    });
    gsap.set(colunas, { yPercent: 0 });

    // Na primeira vez que a trilha aparece, o fluxo roda sozinho
    ScrollTrigger.create({ trigger: trilha, start: 'top 78%', once: true, onEnter: () => aplicar(trilha.dataset.cenario, true) });
  }

  /* =========================================================================
     TIME DE AGENTES: os 6 cartões saem de uma pilha, se espalham e o trabalho
     passa de um para o outro.
     ========================================================================= */
  function time() {
    const secao = $('#time');
    const palco = $('.time__palco', secao);
    const mesa = $('.mesa', secao);
    const cartoes = $$('.agente', secao);
    const bastao = $('.bastao', secao);
    const bastaoTexto = $('.bastao__texto', secao);
    const ENTREGAS = ['lista de contatos', 'diagnóstico', 'solução desenhada', 'proposta', 'orçamento'];
    if (reduzir) return;

    const GIROS = [-11, -6, -2, 3, 7, 12];
    gsap.set(bastao, { xPercent: -50, yPercent: -50 });
    const centro = (el) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });
    const INICIO = 4.4;
    const DURACAO = 6;
    let textoAtual = ENTREGAS[0];
    const andar = gsap.parseEase('power2.inOut');

    function passar(t) {
      const h = limitar((t - INICIO) / DURACAO) * 5;
      const ativo = t < INICIO - 0.15 ? -1 : Math.min(5, Math.round(h));
      cartoes.forEach((cartao, i) => cartao.classList.toggle('is-ativo', i === ativo));
      if (ativo < 0) {
        gsap.set(bastao, { autoAlpha: 0 });
        return;
      }
      const k = Math.min(4, Math.floor(h));
      const f = h - k;
      const a = cartoes[k];
      const b = cartoes[k + 1];
      const ca = centro(a);
      const cb = centro(b);
      const e = andar(f);
      const x = ca.x + (cb.x - ca.x) * e;
      const y = a.offsetTop + (b.offsetTop - a.offsetTop) * e - 24 - Math.sin(Math.PI * f) * 44;
      gsap.set(bastao, { x, y, autoAlpha: limitar((t - (INICIO - 0.15)) / 0.15) });
      const texto = ENTREGAS[k];
      if (texto !== textoAtual) {
        textoAtual = texto;
        if (tem('ScrambleTextPlugin')) gsap.to(bastaoTexto, { duration: 0.5, scrambleText: { text: texto, chars: 'abcdefghijklmnopqrstuvwxyz', speed: 0.7 }, overwrite: true });
        else bastaoTexto.textContent = texto;
      }
    }

    const mm = gsap.matchMedia();
    mm.add({ alta: ALTA, baixa: BAIXA }, (contexto) => {
      gsap.set(cartoes, { zIndex: (i) => cartoes.length - i });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => passar(tl.time()),
        scrollTrigger: cena(palco, contexto.conditions.alta, 2.6),
      });
      tl.fromTo(cartoes, {
        x: (i, el) => mesa.clientWidth / 2 - centro(el).x + (i - 2.5) * 5,
        y: (i, el) => mesa.clientHeight / 2 - centro(el).y + i * 3,
        rotation: (i) => GIROS[i],
        scale: 0.94,
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 3,
        stagger: 0.18,
        ease: 'power3.inOut',
      }, 0.2)
        .to({}, { duration: DURACAO + 0.6 }, INICIO);
      passar(0);
    });
  }

  /* =========================================================================
     ESCRITÓRIO DOS AGENTES (destaque): a foto abre do centro até a tela cheia,
     e a câmera dá zoom em cada um dos 4 momentos.
     ========================================================================= */
  function escritorio() {
    const secao = $('#escritorio');
    const palco = $('.escritorio__palco', secao);
    const moldura = $('.escritorio__moldura', secao);
    const camera = $('.escritorio__camera', secao);
    const luz = $('.escritorio__luz', secao);
    const cabeca = $('.escritorio__cabeca', secao);
    const painel = $('.escritorio__painel', secao);
    const legenda = $('.escritorio__legenda-foto', secao);
    const momentos = $$('.momento', secao);
    if (reduzir) return;

    const largo = () => window.innerWidth >= 900;
    // O cartão de onde a foto abre
    function cartao() {
      const W = palco.clientWidth;
      const H = palco.clientHeight;
      const w = largo() ? Math.min(W * 0.46, 720) : W * 0.86;
      const h = w * 0.6;
      const meio = H * (largo() ? 0.65 : 0.66);
      const topo = Math.max(0, meio - h / 2);
      const lado = (W - w) / 2;
      return `inset(${topo.toFixed(1)}px ${lado.toFixed(1)}px ${Math.max(0, H - topo - h).toFixed(1)}px ${lado.toFixed(1)}px round 24px)`;
    }
    // Para onde a câmera vai em cada momento: o ponto escolhido fica no meio da tela
    function foco(momento) {
      const W = palco.clientWidth;
      const H = palco.clientHeight;
      const cw = camera.offsetWidth;
      const ch = camera.offsetHeight;
      const zoom = parseFloat(momento.dataset.zoom);
      const escala = zoom === 1 ? 1 : zoom * (largo() ? 1 : 1.45);
      const fx = zoom === 1 ? 0.5 : parseFloat(momento.dataset.x) / 100;
      const fy = zoom === 1 ? 0.5 : parseFloat(momento.dataset.y) / 100;
      const alvoY = H * (largo() ? 0.42 : 0.45);
      const folga = Math.max(0, (cw * escala - W) / 2);
      return {
        x: limitar(-(fx - 0.5) * cw * escala, -folga, folga),
        y: alvoY - H / 2 - (fy - 0.5) * ch * escala,
        scale: escala,
      };
    }
    const INICIO = 1.9;
    const PASSO = 1.5;
    function marcar(t) {
      momentos.forEach((m, k) => {
        const ini = INICIO + k * PASSO;
        m.classList.toggle('is-atual', t >= ini - 0.1 && (k === momentos.length - 1 || t < ini + PASSO - 0.1));
        m.classList.toggle('is-feito', t >= ini + PASSO - 0.1 && k < momentos.length - 1);
      });
    }

    gsap.set(luz, { '--x': '50%', '--y': '50%', '--r': '9%' });
    const mm = gsap.matchMedia();
    mm.add({ alta: ALTA, baixa: BAIXA }, (contexto) => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => marcar(tl.time()),
        scrollTrigger: cena(palco, contexto.conditions.alta, 4.4),
      });
      // 1. A foto abre em tela cheia com zoom; o título sobe mais rápido (paralaxe)
      tl.fromTo(moldura, { clipPath: () => cartao() }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1.4, ease: 'power2.inOut' }, 0)
        .fromTo(camera, { scale: 1.45, x: 0, y: () => palco.clientHeight * 0.1 }, { scale: 1, x: 0, y: () => foco(momentos[3]).y, duration: 1.4, ease: 'power2.inOut' }, 0)
        .fromTo(cabeca, { y: 0, autoAlpha: 1 }, { y: () => -window.innerHeight * 0.24, autoAlpha: 0, duration: 1, ease: 'power1.in' }, 0.15)
        .fromTo([painel, legenda], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.2);
      // 2. Os quatro momentos: zoom e foco em cada parte do escritório
      momentos.forEach((m, k) => {
        const t = INICIO + k * PASSO;
        tl.to(camera, { x: () => foco(m).x, y: () => foco(m).y, scale: () => foco(m).scale, duration: 0.95, ease: 'power2.inOut' }, t);
        if (k < momentos.length - 1) tl.to(luz, { '--x': `${m.dataset.x}%`, '--y': `${m.dataset.y}%`, '--r': `${m.dataset.r || 9}%`, opacity: 1, duration: 0.95, ease: 'power2.inOut' }, t);
        else tl.to(luz, { opacity: 0, duration: 0.8 }, t);
        tl.fromTo($('.momento__barra i', m), { scaleX: 0 }, { scaleX: 1, duration: PASSO }, t);
      });
      tl.to({}, { duration: 0.4 });
      marcar(0);
    });
    trabalhando();

    // Os agentes trabalhando: cada um mostra o que está fazendo, termina (✓) e o trabalho
    // passa de mesa em mesa por uma rota pontilhada. Roda em laço enquanto a seção está na tela.
    function trabalhando() {
      const baloes = $$('.balao', secao);
      const rotas = $$('.trabalho__rota', secao);
      const svg = $('.trabalho__rotas', secao);
      if (!baloes.length || !svg) return;
      const fazendo = baloes.map((b) => $('.balao__texto', b).textContent);
      // Coordenador, Buscador, Analista, Conferente e Mensageiro
      const FEITO = ['tarefas enviadas', 'anexos encontrados', 'dados lidos', 'tudo confere', 'e-mail enviado'];
      const pacote = document.createElementNS(NS, 'circle');
      pacote.setAttribute('r', '6');
      pacote.setAttribute('class', 'trabalho__pacote');
      svg.appendChild(pacote);
      gsap.set(pacote, { opacity: 0 });
      // o balão fica com a ponta embaixo, apontando para o agente (xPercent/yPercent, para o y do GSAP não desfazer)
      gsap.set(baloes, { xPercent: -50, yPercent: -50, x: 0, y: 6, opacity: 0 });
      const PASSO = 1.6;
      const ciclo = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
      baloes.forEach((b, i) => {
        const t = i * PASSO;
        const texto = $('.balao__texto', b);
        ciclo.call(() => { texto.textContent = `${fazendo[i]}…`; b.classList.remove('is-feito'); }, null, t)
          .to(b, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, t)
          .call(() => { texto.textContent = `${FEITO[i]} ✓`; b.classList.add('is-feito'); }, null, t + 1.05);
        const rota = rotas[i];
        if (!rota) return;
        ciclo.to(rota, { opacity: 1, duration: 0.3 }, t + 1)
          .set(pacote, { opacity: 1 }, t + 1);
        if (tem('MotionPathPlugin')) {
          ciclo.to(pacote, { motionPath: { path: rota, align: rota, alignOrigin: [0.5, 0.5] }, duration: 0.6, ease: 'power1.inOut' }, t + 1);
        }
        ciclo.set(pacote, { opacity: 0 }, t + 1.6)
          .to(rota, { opacity: 0.3, duration: 0.5 }, t + 1.6);
      });
      const fim = baloes.length * PASSO + 1.4;
      ciclo.to(baloes, { opacity: 0, y: -4, duration: 0.5, stagger: 0.05 }, fim)
        .to(rotas, { opacity: 0, duration: 0.5 }, fim);
      ScrollTrigger.create({
        trigger: secao,
        start: 'top 70%',
        end: 'bottom top',
        onToggle: (self) => { if (self.isActive) ciclo.play(); else ciclo.pause(); },
      });
    }
  }

  /* ---------- Robôs de trade: o gráfico ilustrativo se desenha semana a semana ---------- */
  function trade() {
    const svg = $('.grafico__svg');
    const corte = $('.grafico__corte');
    const cursor = $('.grafico__cursor');
    const semana = $('.grafico__semana b');
    const pontas = $$('.grafico__ponta');
    if (reduzir || !svg) return;
    const estado = { w: 0 };
    const pintar = () => {
      corte.setAttribute('width', estado.w + 20);
      cursor.setAttribute('x1', estado.w);
      cursor.setAttribute('x2', estado.w);
      gsap.set(cursor, { opacity: estado.w > 2 && estado.w < 798 ? 1 : 0 });
      gsap.set(pontas, { opacity: estado.w >= 798 ? 1 : 0, scale: estado.w >= 798 ? 1 : 0, transformOrigin: '50% 50%' });
      semana.textContent = Math.max(1, Math.ceil(estado.w / 100));
    };
    pintar();
    gsap.to(estado, {
      w: 800,
      ease: 'none',
      onUpdate: pintar,
      scrollTrigger: { trigger: '.grafico', start: 'top 78%', end: 'bottom 60%', scrub: 0.8 },
    });
    gsap.from('.garfo > *', { y: 18, opacity: 0, duration: 0.8, stagger: 0.12, ease: EASE, scrollTrigger: { trigger: '.garfo', start: 'top 82%' } });
  }

  /* =========================================================================
     AGENTES E SKILLS: o baralho (base: "Stack Spread" e "Tilt" do 21st.dev).
     Os 13 cartões começam numa pilha torta no meio da grade. Com a rolagem, a
     pilha fica parada na tela e cada cartão sai dela para o seu lugar quando a
     linha dele passa (scrub). Pousados, inclinam de leve com o mouse. Os
     filtros reorganizam com Flip. Depois de distribuído (ou do primeiro
     filtro), o baralho não volta mais para a pilha.
     ========================================================================= */
  function kit() {
    const secao = $('#kit');
    if (!secao) return;
    const grade = $('.kit__grade', secao);
    const cartas = $$('.kit__carta', grade);
    const filtros = $$('.kit__filtro', secao);
    const totais = $$('.kit__totais li', secao);
    const aviso = $('[data-kit-aviso]', secao);
    const AVISOS = {
      tudo: 'Mostrando os 13 cartões: 8 agentes e 5 skills.',
      agente: 'Mostrando os 8 agentes.',
      skill: 'Mostrando as 5 skills.',
    };
    let filtro = 'tudo';
    let baralho = false; // true enquanto os cartões ainda saem da pilha com a rolagem

    // Quantas colunas a grade tem nesta tela (4, 3, 2 ou 1)
    const colunas = () => getComputedStyle(grade).gridTemplateColumns.split(' ').filter(Boolean).length || 1;

    /* ---------- O baralho ---------- */
    const GIROS = [-4, 7, -9, 3, 8, -6, 10, -2, 6, -8, 4, -5, 9];
    const DESVIOS = [[0, 0], [10, -6], [-12, 8], [6, 10], [-8, -10], [12, 4], [-6, 12], [9, -12], [-11, -3], [4, 9], [-5, -8], [11, 7], [-9, 5]];
    const ATRASO = 0.06; // na mesma linha, cada coluna sai um pouco depois da anterior
    const voo = gsap.parseEase('power3.inOut');
    const APAGADO = 0.34; // quanto o cartão escurece enquanto espera na pilha
    const pecas = cartas.map((carta, i) => ({
      el: carta,
      face: $('.kit__face', carta),
      luz: -1,
      giro: GIROS[i % GIROS.length],
      desvio: DESVIOS[i % DESVIOS.length],
      t: 0,
      cx: 0,
      cy: 0,
      col: 0,
      pousada: false,
      soltar: null,
      x: gsap.quickSetter(carta, 'x', 'px'),
      y: gsap.quickSetter(carta, 'y', 'px'),
      rot: gsap.quickSetter(carta, 'rotation', 'deg'),
      escX: gsap.quickSetter(carta, 'scaleX'),
      escY: gsap.quickSetter(carta, 'scaleY'),
    }));
    // P: altura da tela onde a pilha espera. Um cartão sai quando a linha dele já subiu S além
    // de P e termina de pousar W depois.
    const geo = { topo: 0, meio: 0, P: 1, S: 0, W: 1, K: 1, primeira: 0, ultima: 0, cols: 1, giro: 1, escala: 0.94 };
    const suaveMax = (a, b, k) => (a + b + Math.sqrt((a - b) * (a - b) + k * k)) / 2;
    const suaveMin = (a, b, k) => (a + b - Math.sqrt((a - b) * (a - b) + k * k)) / 2;
    let visivel = false;

    function medir() {
      const vh = window.innerHeight;
      geo.cols = colunas();
      geo.meio = grade.clientWidth / 2;
      geo.topo = grade.getBoundingClientRect().top + window.scrollY;
      const passo = grade.clientWidth / geo.cols;
      const coluna = (el) => Math.min(geo.cols - 1, Math.floor((el.offsetLeft + 2) / passo));
      let alta = 0;
      geo.primeira = Infinity;
      geo.ultima = -Infinity;
      pecas.forEach((p) => {
        if (p.el.hidden) return;
        p.cx = p.el.offsetLeft + p.el.offsetWidth / 2;
        p.cy = p.el.offsetTop + p.el.offsetHeight / 2;
        p.col = coluna(p.el);
        alta = Math.max(alta, p.el.offsetHeight);
        geo.primeira = Math.min(geo.primeira, p.cy);
        geo.ultima = Math.max(geo.ultima, p.cy);
      });
      if (!Number.isFinite(geo.primeira)) geo.primeira = geo.ultima = 0;
      geo.giro = geo.cols >= 3 ? 1 : geo.cols === 2 ? 0.7 : 0.4;
      geo.escala = geo.cols === 1 ? 0.9 : 0.94;
      // A pilha espera inteira na parte de baixo da tela. O cartão só parece pousado (73% do
      // voo, pela curva) quando a linha dele já passou toda por cima da pilha: nada pousado
      // fica encostado nela.
      const meia = (alta * geo.escala) / 2 + 12;
      geo.P = Math.min(vh * 0.82, vh - meia - 16);
      geo.S = alta * 0.4;
      geo.K = alta * 0.35;
      geo.W = Math.max(alta * 0.6, (meia + alta / 2 + 16 - geo.S) / (0.73 * (1 - (geo.cols - 1) * ATRASO)));
    }

    // dt em segundos suaviza (como o scrub); sem dt, vai direto para o lugar certo
    function pintar(dt) {
      if (!baralho) return;
      const topoVp = geo.topo - window.scrollY;
      // a pilha fica parada na altura P da tela; antes da grade chegar, vem junto com a
      // primeira linha, e não desce além do ponto de saída da última (limites suaves: ela
      // desacelera ao parar, em vez de travar de uma vez)
      const pilha = suaveMin(suaveMax(geo.P - topoVp, geo.primeira, geo.K), geo.ultima + geo.S, geo.K);
      const folga = 1 - (geo.cols - 1) * ATRASO;
      const k = dt == null ? 1 : 1 - Math.exp(-dt / 0.12);
      let pronto = true;
      pecas.forEach((p) => {
        const alvo = limitar(((geo.P - geo.S - topoVp - p.cy) / geo.W - p.col * ATRASO) / folga);
        p.t += (alvo - p.t) * k;
        if (Math.abs(alvo - p.t) < 0.001) p.t = alvo;
        if (p.t < 1) pronto = false;
        const e = voo(p.t);
        const q = 1 - e;
        p.x((geo.meio - p.cx + p.desvio[0]) * q);
        p.y((pilha - p.cy + p.desvio[1]) * q);
        p.rot(p.giro * geo.giro * q);
        const s = geo.escala + (1 - geo.escala) * e + 0.035 * Math.sin(Math.PI * e);
        p.escX(s);
        p.escY(s);
        const luz = Math.round(APAGADO * q * 100) / 100;
        if (luz !== p.luz) {
          p.luz = luz;
          p.face.style.setProperty('--apagado', luz);
        }
        const pousou = p.t >= 0.995;
        if (pousou !== p.pousada) {
          p.pousada = pousou;
          p.el.classList.toggle('is-pousada', pousou);
          if (!pousou && p.soltar) p.soltar();
        }
      });
      if (pronto) terminar();
    }

    function tique(tempo, delta) {
      if (visivel) pintar(Math.min(0.1, delta / 1000));
    }

    // Fim do baralho: todos no lugar, para sempre
    function terminar() {
      if (!baralho) return;
      baralho = false;
      gsap.ticker.remove(tique);
      secao.classList.remove('kit--baralho');
      pecas.forEach((p) => {
        p.t = 1;
        p.pousada = true;
        p.el.classList.add('is-pousada');
        p.face.style.removeProperty('--apagado');
      });
      gsap.set(cartas, { clearProps: 'transform' });
    }

    // Filtro (ou teclado): acaba o baralho e leva cada cartão de onde está até o lugar novo
    function reorganizar(mudar) {
      const animar = !reduzir && tem('Flip');
      const antes = animar ? Flip.getState(cartas) : null;
      const alturaAntes = grade.offsetHeight;
      terminar();
      if (mudar) mudar();
      if (!antes) {
        ScrollTrigger.refresh();
        return;
      }
      const alturaDepois = grade.offsetHeight;
      Flip.from(antes, {
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.018,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: EASE }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh(),
      });
      // Só depois do Flip.from (ele mede o lugar novo e, no fim, devolve o estilo que cada
      // cartão tinha ao começar): a grade muda de altura sem pular
      gsap.fromTo(grade, { height: alturaAntes }, { height: alturaDepois, duration: 0.9, ease: 'power3.inOut', clearProps: 'height', overwrite: true });
    }

    filtros.forEach((botao) => botao.addEventListener('click', () => {
      const grupo = botao.dataset.filtro;
      if (grupo === filtro) {
        if (baralho) reorganizar(null); // "Tudo" com a pilha ainda na mesa: distribui de uma vez
        return;
      }
      filtro = grupo;
      filtros.forEach((b) => {
        const sim = b === botao;
        b.classList.toggle('is-ativo', sim);
        b.setAttribute('aria-pressed', String(sim));
      });
      totais.forEach((li) => li.classList.toggle('is-apagado', grupo !== 'tudo' && li.dataset.tipo !== grupo));
      if (aviso) aviso.textContent = AVISOS[grupo];
      reorganizar(() => cartas.forEach((carta) => {
        carta.hidden = grupo !== 'tudo' && carta.dataset.tipo !== grupo;
      }));
    }));

    if (reduzir) return;

    // Quem chega pelo teclado vê tudo no lugar (nada fica escondido na pilha)
    secao.addEventListener('focusin', (evento) => {
      if (!baralho) return;
      let teclado = true;
      try { teclado = evento.target.matches(':focus-visible'); } catch (erro) { /* navegador antigo */ }
      if (teclado) reorganizar(null);
    });

    // Pousado, o cartão inclina de leve na direção do mouse
    if (!toque) {
      pecas.forEach((p) => {
        const { face } = p;
        gsap.set(face, { transformPerspective: 900 });
        const girarX = gsap.quickTo(face, 'rotationX', { duration: 0.7, ease: 'power3' });
        const girarY = gsap.quickTo(face, 'rotationY', { duration: 0.7, ease: 'power3' });
        p.soltar = () => {
          girarX(0);
          girarY(0);
        };
        p.el.addEventListener('pointermove', (evento) => {
          if (!p.pousada) return;
          const r = p.el.getBoundingClientRect();
          girarX(((evento.clientY - r.top) / r.height - 0.5) * -8);
          girarY(((evento.clientX - r.left) / r.width - 0.5) * 10);
        });
        p.el.addEventListener('pointerleave', p.soltar);
      });
    }

    gsap.from($('.kit__barra', secao), {
      y: 26,
      opacity: 0,
      duration: 1,
      ease: EASE,
      scrollTrigger: { trigger: $('.kit__barra', secao), start: 'top 90%', once: true },
    });

    baralho = true;
    secao.classList.add('kit--baralho');
    gsap.set(cartas, { zIndex: (i) => cartas.length + 2 - i });
    medir();
    pintar(null);
    gsap.ticker.add(tique);
    ScrollTrigger.create({
      trigger: grade,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { visivel = self.isActive; },
      onLeave: () => pintar(null),
      onLeaveBack: () => pintar(null),
      onRefresh: () => {
        if (!baralho) return;
        medir();
        pintar(null);
      },
    });
  }

  /* =========================================================================
     SAAS: pilha de cartões (base: "Stacking Cards" do 21st.dev).
     ========================================================================= */
  function produtos() {
    if (reduzir) return;
    const itens = $$('.pilha__item');
    const n = itens.length;
    itens.forEach((item, i) => {
      const cartao = $('.produto', item);
      const sombra = document.createElement('span');
      sombra.className = 'pilha__sombra';
      sombra.setAttribute('aria-hidden', 'true');
      cartao.appendChild(sombra);
      const quandoAtras = { trigger: item, start: 'top top', endTrigger: '.pilha', end: 'bottom bottom', scrub: true };
      gsap.to(cartao, { scale: 1 - (n - 1 - i) * 0.05, ease: 'none', scrollTrigger: quandoAtras });
      gsap.to(sombra, { opacity: (n - 1 - i) * 0.25, ease: 'none', scrollTrigger: { ...quandoAtras } });
      gsap.fromTo(cartao, { y: 140, rotation: i % 2 ? 3 : -3 }, {
        y: 0,
        rotation: 0,
        ease: 'none',
        scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 15%', scrub: true },
      });
      // A arte de cada produto se desenha quando o cartão chega
      const arte = $('.produto__arte svg', cartao);
      const tracos = $$('path, rect', arte);
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 55%' } });
      if (tem('DrawSVGPlugin')) tl.fromTo(tracos, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, stagger: 0.04, ease: 'power2.inOut' }, 0);
      tl.from($$('.arte__bloco, .arte__barra, text', arte), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.05, ease: 'back.out(2)' }, 0.5)
        .from($$('.produto__nome, .produto__desc', cartao), { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: EASE }, 0);
    });
  }

  /* =========================================================================
     SITES: galeria lateral presa na rolagem; as molduras giram de leve e a
     imagem tem paralaxe dentro de cada uma (base: "Scroll Horizontal Gallery").
     ========================================================================= */
  function sites() {
    const palco = $('.sites__palco');
    if (!palco) return; // a seção de sites saiu da página a pedido do Lorenzo
    const faixa = $('.sites__faixa');
    const itens = $$('.site', faixa);
    const imagens = itens.map((item) => $('img', item));
    const atual = $('.sites__atual');
    const barra = $('.sites__progresso i');
    if (reduzir) return;
    const passo = () => itens[1].offsetLeft - itens[0].offsetLeft;
    const distancia = () => passo() * (itens.length - 1);
    function atualizar() {
      const x = gsap.getProperty(faixa, 'x');
      const p = passo();
      itens.forEach((item, i) => {
        const d = limitar((i * p + x) / p, -1.6, 1.6);
        const a = Math.min(1, Math.abs(d));
        gsap.set(item, { rotationY: d * -18, scale: 1 - a * 0.1, opacity: 1 - a * 0.45, transformPerspective: 1400 });
        gsap.set(imagens[i], { xPercent: d * 4.5 });
      });
      const progresso = limitar(-x / Math.max(1, distancia()));
      atual.textContent = Math.round(progresso * (itens.length - 1)) + 1;
      gsap.set(barra, { scaleX: 0.2 + progresso * 0.8 });
    }
    gsap.to(faixa, {
      x: () => -distancia(),
      ease: 'none',
      onUpdate: atualizar,
      scrollTrigger: {
        trigger: palco,
        start: 'top top',
        end: () => `+=${Math.round(distancia() * 1.2)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: atualizar,
      },
    });
    atualizar();
  }

  /* =========================================================================
     FORMAÇÃO: a trajetória (base "Product Timeline" e "Lifeline" do
     21st.dev). Rolagem lateral presa:
     o cometa passa pelos anos, o trilho em onda acende atrás dele, o ano
     gigante gira em rolo com a legenda embaixo e cada cartão acende quando o
     cometa chega (contorno que se desenha, brilho que passa, esqueleto
     "carregando" antes). Cada parada tem a forma do que é: diploma com o GPA
     no selo, certificado com selo, crachá que balança ("Lanyard Badge") e
     cartão de visita que vira. Sem animação, a seção fica numa grade simples.
     ========================================================================= */
  function formacao() {
    const secao = $('#formacao');
    if (!secao || reduzir) return;
    const trilho = $('.trajeto', secao);
    const faixa = $('.trajeto__faixa', secao);
    const svg = $('.trajeto__svg', secao);
    const base = $('.trajeto__base', secao);
    const aura = $('.trajeto__aura', secao);
    const feito = $('.trajeto__feito', secao);
    const corte = $('.trajeto__corte', secao);
    const cometa = $('.trajeto__cometa', secao);
    const digitos = $('.formacao__digitos', secao);
    const legenda = $('.formacao__legenda-texto', secao);
    const reguaCheio = $('.formacao__regua-cheio', secao);
    const reguaAnos = $$('.formacao__regua-anos li', secao);
    const itens = $$('.trajeto__ano, .marco', faixa);
    const marcas = itens.filter((el) => el.classList.contains('trajeto__ano'));
    const paradas = itens.filter((el) => el.classList.contains('marco'));
    if (!marcas.length || !paradas.length) return;

    // Liga o trilho (sem esta classe, o CSS mostra a grade simples). Se a montagem
    // falhar, a seção volta para a grade.
    secao.classList.add('is-trilho');
    let gatilho = null;
    try {
      // Lados fixos: a primeira parada fica embaixo e as outras alternam; o crachá
      // sempre fica pendurado embaixo (a alternância continua a partir dele)
      let proximaEmCima = false;
      paradas.forEach((parada) => {
        const cima = parada.classList.contains('marco--cracha') ? false : proximaEmCima;
        parada.classList.toggle('marco--cima', cima);
        parada.classList.toggle('marco--baixo', !cima);
        proximaEmCima = !cima;
      });

      // Peças de cada parada: anel que abre do ponto, contorno, brilho e esqueleto
      paradas.forEach((parada) => {
        const ponto = $('.marco__ponto', parada);
        const onda = document.createElement('span');
        onda.className = 'marco__onda';
        onda.setAttribute('aria-hidden', 'true');
        parada.insertBefore(onda, ponto);
        const cartao = $('.marco__cartao', parada);
        const contorno = document.createElementNS(NS, 'svg');
        contorno.setAttribute('class', 'marco__contorno');
        contorno.setAttribute('aria-hidden', 'true');
        // comprimento normalizado (pathLength 1): o traço se desenha igual em qualquer tamanho de cartão
        const voltas = parada.classList.contains('marco--diploma') ? 2 : 1;
        for (let k = 0; k < voltas; k++) {
          const rect = document.createElementNS(NS, 'rect');
          rect.setAttribute('pathLength', '1');
          contorno.appendChild(rect);
        }
        cartao.appendChild(contorno);
        const brilho = document.createElement('span');
        brilho.className = 'marco__brilho';
        brilho.setAttribute('aria-hidden', 'true');
        cartao.appendChild(brilho);
        gsap.set(brilho, { xPercent: -160, skewX: -18 });
        if (!parada.classList.contains('marco--visita')) {
          const esqueleto = document.createElement('span');
          esqueleto.className = 'marco__esqueleto';
          esqueleto.setAttribute('aria-hidden', 'true');
          esqueleto.innerHTML = '<i></i><i></i><i></i>';
          cartao.appendChild(esqueleto);
        }
      });

      // Ano gigante: uma coluna de 0 a 9 por dígito
      let anoMostrado = digitos.textContent.trim();
      digitos.textContent = '';
      const colunas = [...anoMostrado].map((digito) => {
        const coluna = document.createElement('span');
        coluna.className = 'formacao__coluna';
        for (let n = 0; n < 10; n++) {
          const casa = document.createElement('span');
          casa.textContent = n;
          coluna.appendChild(casa);
        }
        digitos.appendChild(coluna);
        gsap.set(coluna, { yPercent: -Number(digito) * 10 });
        return coluna;
      });
      const mostrarAno = (ano) => {
        if (ano === anoMostrado) return;
        [...ano].forEach((digito, i) => {
          if (digito !== anoMostrado[i]) gsap.to(colunas[i], { yPercent: -Number(digito) * 10, duration: 0.9, ease: 'expo.out', overwrite: true });
        });
        anoMostrado = ano;
      };
      const legendaInicial = legenda.textContent;
      let legendaMostrada = legendaInicial;
      let troca = null;
      const mostrarLegenda = (texto) => {
        if (texto === legendaMostrada) return;
        legendaMostrada = texto;
        if (troca) troca.kill();
        troca = gsap.timeline()
          .to(legenda, { yPercent: -100, opacity: 0, duration: 0.18, ease: 'power2.in' })
          .call(() => { legenda.textContent = texto; })
          .set(legenda, { yPercent: 100 })
          .to(legenda, { yPercent: 0, opacity: 1, duration: 0.4, ease: EASE });
      };

      // GPA no selo do diploma: número em rolo (uma coluna de 0 a 9, duas voltas, por dígito)
      const montarNota = (valor) => {
        if (!valor) return [];
        const texto = valor.textContent.trim();
        valor.textContent = '';
        const rolos = [];
        [...texto].forEach((caractere) => {
          if (/\d/.test(caractere)) {
            const coluna = document.createElement('span');
            coluna.className = 'marco__nota-coluna';
            for (let n = 0; n < 20; n++) {
              const casa = document.createElement('span');
              casa.textContent = n % 10;
              coluna.appendChild(casa);
            }
            valor.appendChild(coluna);
            rolos.push({ coluna, alvo: 10 + Number(caractere) });
          } else {
            const fixo = document.createElement('span');
            fixo.className = 'marco__nota-fixo';
            fixo.textContent = caractere;
            valor.appendChild(fixo);
          }
        });
        return rolos;
      };

      // Antes do cometa: cartão apagado, inclinado e "carregando". Quando ele chega: acende.
      const acender = new Map();
      paradas.forEach((parada) => {
        const ia = parada.classList.contains('marco--ia');
        const cima = parada.classList.contains('marco--cima');
        const visita = parada.classList.contains('marco--visita');
        // o cartão de visita mostra o conteúdo só depois de virar
        const depois = visita ? 0.4 : 0;
        const cartao = $('.marco__cartao', parada);
        const titulo = $('.marco__titulo', parada);
        let palavras = [];
        if (titulo && tem('SplitText')) {
          const divisao = SplitText.create(titulo, { type: 'words', mask: 'words' });
          if (divisao.masks) gsap.set(divisao.masks, { paddingBottom: '0.14em', marginBottom: '-0.14em', paddingRight: '0.08em', marginRight: '-0.08em' });
          palavras = divisao.words;
        }
        const icone = $('.marco__icone', parada);
        const tipo = $('.marco__tipo', parada);
        const data = $('.marco__data', parada);
        const textoData = data ? data.textContent : '';
        const texto = $('.marco__texto', parada);
        const chips = $$('.marco__chips li', parada);
        const contornos = $$('.marco__contorno rect', parada);
        const cor = ia ? '#b48cff' : '#6cc4ff';
        const halo = ia ? 'rgba(180, 140, 255, 0.16)' : 'rgba(108, 196, 255, 0.16)';

        gsap.set(cartao, {
          opacity: 0.42,
          scale: 0.94,
          y: cima ? -12 : 12,
          rotationX: cima ? 14 : -14,
          transformPerspective: 900,
          transformOrigin: cima ? '50% 100%' : '50% 0%',
          filter: 'grayscale(1)',
        });

        const tl = gsap.timeline({ paused: true });
        tl.fromTo($('.marco__onda', parada), { scale: 0.5, opacity: 0.8 }, { scale: 3.4, opacity: 0, duration: 1, ease: 'power2.out' }, 0)
          .to($('.marco__ponto', parada), { scale: 1, backgroundColor: cor, borderColor: cor, boxShadow: `0 0 0 6px ${halo}`, duration: 0.5, ease: 'back.out(3)' }, 0)
          .to($('.marco__haste', parada), { scaleY: 1, duration: 0.6, ease: 'power3.out' }, 0.05)
          .to(cartao, { opacity: 1, scale: 1, y: 0, rotationX: 0, filter: 'grayscale(0)', duration: 1.1, ease: 'expo.out' }, 0.2);
        const esqueleto = $('.marco__esqueleto', parada);
        if (esqueleto) tl.to(esqueleto, { opacity: 0, duration: 0.3 }, 0.25);
        if (contornos.length) {
          tl.fromTo(contornos, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.2 }, 0.25 + depois)
            .to(contornos, { opacity: 0.35, duration: 0.8 }, 1.7 + depois);
        }
        if (icone) tl.from(icone, { scale: 0, rotation: -120, duration: 0.9, ease: 'back.out(2.2)' }, 0.4 + depois);
        if (tipo) tl.from(tipo, { x: 24, opacity: 0, duration: 0.7, ease: EASE }, 0.45 + depois);
        if (data && textoData && tem('ScrambleTextPlugin')) {
          const letras = /\d/.test(textoData) ? '0123456789/' : 'abcdefghijklmnopqrstuvwxyz';
          tl.to(data, { duration: 0.8, ease: 'none', scrambleText: { text: textoData, chars: letras, speed: 0.6 } }, 0.45 + depois);
        }
        if (palavras.length) tl.from(palavras, { yPercent: 115, duration: 0.8, stagger: 0.06, ease: EASE }, 0.5 + depois);
        if (texto) tl.from(texto, { y: 14, opacity: 0, duration: 0.7, ease: EASE }, 0.7 + depois);
        if (chips.length) tl.from(chips, { scale: 0.5, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2.4)' }, 0.85 + depois);
        tl.fromTo($('.marco__brilho', parada), { xPercent: -160 }, { xPercent: 400, duration: 1.2, ease: 'power2.inOut' }, 0.8 + depois);

        // O toque de cada tipo
        if (parada.classList.contains('marco--certificado')) {
          tl.fromTo($('.marco__selo', parada), { scale: 0, rotation: -160, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)' }, 0.9);
          if (tem('DrawSVGPlugin')) {
            tl.fromTo($('.marco__selo-borda', parada), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9 }, 0.95)
              .fromTo($('.marco__selo-check', parada), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' }, 1.5);
          }
        }
        if (parada.classList.contains('marco--diploma')) {
          const rolos = montarNota($('.marco__nota-valor', parada));
          tl.fromTo($('.marco__nota', parada), { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 1.1, ease: 'back.out(1.7)' }, 0.85);
          if (tem('DrawSVGPlugin')) {
            tl.fromTo($('.marco__nota-borda', parada), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut' }, 0.9)
              .fromTo($('.marco__nota-aro', parada), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 1.1);
          }
          rolos.forEach(({ coluna, alvo }, i) => tl.fromTo(coluna, { yPercent: 0 }, { yPercent: -alvo * 5, duration: 1.6 + i * 0.35, ease: 'expo.out' }, 1.0));
          tl.from($$('.marco__nota-rotulo, .marco__nota-de', parada), { opacity: 0, y: 3, duration: 0.5, stagger: 0.1, ease: EASE }, 1.25);
        }
        if ((parada.classList.contains('marco--diploma') || parada.classList.contains('marco--faculdade')) && icone) {
          tl.to($('svg', icone), { y: -9, rotation: -14, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.05);
        }
        if (parada.classList.contains('marco--cracha')) {
          // a fita já está lá, cinza; ganha cor e o crachá balança até parar
          tl.to($('.marco__haste', parada), { opacity: 1, filter: 'grayscale(0)', duration: 0.6 }, 0.05)
            .fromTo($('.marco__pendulo', parada), { rotation: -22 }, { rotation: 0, duration: 2.6, ease: 'elastic.out(1, 0.22)' }, 0.15);
        }
        if (visita) {
          // Vira no meio do caminho: o verso some quando o cartão está de lado
          const frente = $('.visita__frente', parada);
          const verso = $('.visita__verso', parada);
          gsap.set(frente, { autoAlpha: 0 });
          tl.fromTo(cartao, { rotationY: 0 }, { rotationY: 90, duration: 0.3, ease: 'power2.in' }, 0.3)
            .set(verso, { autoAlpha: 0 }, 0.6)
            .set(frente, { autoAlpha: 1 }, 0.6)
            .fromTo(cartao, { rotationY: -90 }, { rotationY: 0, duration: 0.9, ease: 'back.out(1.4)', immediateRender: false }, 0.6);
        }
        acender.set(parada, tl);
      });

      // Geometria: trilho em onda, posições, escala dos cartões e o caminho do cometa
      let geo = null;
      const onda = (x) => geo.centro + geo.amp * Math.sin((x / geo.lambda) * Math.PI * 2);
      const ajustarContornos = () => {
        paradas.forEach((parada) => {
          const cartao = $('.marco__cartao', parada);
          const contorno = $('.marco__contorno', cartao);
          const w = cartao.offsetWidth;
          const h = cartao.offsetHeight;
          const raio = parseFloat(getComputedStyle(cartao).borderTopLeftRadius) || 18;
          contorno.setAttribute('viewBox', `0 0 ${w} ${h}`);
          $$('rect', contorno).forEach((rect, k) => {
            const m = 0.75 + k * 6;
            rect.setAttribute('x', m);
            rect.setAttribute('y', m);
            rect.setAttribute('width', Math.max(0, w - m * 2));
            rect.setAttribute('height', Math.max(0, h - m * 2));
            rect.setAttribute('rx', Math.max(2, raio - m));
          });
        });
      };
      const montar = () => {
        const largTela = trilho.clientWidth;
        const altura = trilho.clientHeight;
        const estreito = largTela < 700;
        ajustarContornos();
        // os cartões mudam de tamanho juntos para caber na metade do trilho, descontando a onda
        // (em tela alta, como tablet em pé ou monitor grande, crescem um pouco)
        const amp = Math.min(24, altura * 0.04);
        const maiorCartao = Math.max(...paradas.map((parada) => {
          const haste = parseFloat(getComputedStyle(parada).getPropertyValue('--haste')) || 46;
          return $('.marco__cartao', parada).offsetHeight + haste + 12;
        }));
        const escala = gsap.utils.clamp(0.56, 1.2, (altura / 2 - amp - 14) / maiorCartao);
        faixa.style.setProperty('--escala', escala.toFixed(3));
        geo = {
          centro: altura / 2,
          amp,
          lambda: estreito ? 700 : 1100,
          // O cometa entra pela esquerda com a câmera parada; no meio da tela a câmera passa a
          // acompanhar (o cartão é centrado na haste: acende inteiro, no centro); no fim a câmera
          // para com o "Hoje" à vista e o cometa segue sozinho para a direita.
          cometaInicio: Math.round(largTela * (estreito ? 0.12 : 0.16)),
          cometaX: Math.round(largTela * (estreito ? 0.5 : 0.52)),
          cometaFim: Math.round(largTela * (estreito ? 0.86 : 0.8)),
          passo: (estreito ? 250 : 340) * Math.max(0.8, escala),
        };
        const posicoes = [];
        let x = geo.cometaInicio + (estreito ? 100 : 160);
        itens.forEach((el, i) => {
          posicoes.push(x);
          const proximo = itens[i + 1];
          if (!proximo) return;
          const ehMarca = el.classList.contains('trajeto__ano');
          const proximoEhMarca = proximo.classList.contains('trajeto__ano');
          if (ehMarca && proximoEhMarca) x += estreito ? 100 : 150;
          else if (ehMarca) x += estreito ? 60 : 80;
          else if (proximoEhMarca) x += geo.passo * 0.6;
          else x += geo.passo;
        });
        geo.posicoes = posicoes;
        geo.ultimo = posicoes[posicoes.length - 1];
        // a câmera para quando o último cartão chega a 60% da tela (no celular, ao meio)
        geo.desloMax = Math.max(0, geo.ultimo - Math.round(largTela * (estreito ? 0.5 : 0.6)));
        geo.distancia = Math.max(1, geo.desloMax + geo.cometaFim - geo.cometaInicio);
        geo.pontosMarca = marcas.map((m) => posicoes[itens.indexOf(m)]);

        const largura = Math.ceil(geo.desloMax + largTela + 60);
        faixa.style.width = `${largura}px`;
        svg.setAttribute('width', largura);
        svg.setAttribute('height', altura);
        svg.setAttribute('viewBox', `0 0 ${largura} ${altura}`);
        let d = `M0 ${onda(0).toFixed(1)}`;
        for (let px = 20; px <= largura; px += 20) d += ` L${px} ${onda(px).toFixed(1)}`;
        base.setAttribute('d', d);
        aura.setAttribute('d', d);
        feito.setAttribute('d', d);
        corte.setAttribute('height', altura);
        itens.forEach((el, i) => gsap.set(el, { left: posicoes[i], top: onda(posicoes[i]) }));
      };

      const estado = { p: 0 };
      const atualizar = () => {
        if (!geo) return;
        // cx: onde o cometa está no trilho; a câmera só anda entre a entrada e a parada final
        const cx = geo.cometaInicio + estado.p * geo.distancia;
        const deslocamento = limitar(cx - geo.cometaX, 0, geo.desloMax);
        gsap.set(faixa, { x: -deslocamento });
        corte.setAttribute('width', Math.max(0, cx));
        const y = onda(cx);
        gsap.set(cometa, { x: cx - deslocamento, y, rotation: (Math.atan2(onda(cx + 4) - y, 4) * 180) / Math.PI });

        let ano = marcas[0].dataset.ano;
        let ultimoPassado = -1;
        itens.forEach((el, i) => {
          const passou = geo.posicoes[i] <= cx + 30;
          if (passou) {
            if (el.dataset.ano) ano = el.dataset.ano;
            ultimoPassado = i;
          }
          if (passou === (el.dataset.passou === '1')) return;
          el.dataset.passou = passou ? '1' : '0';
          if (el.classList.contains('marco')) {
            const tl = acender.get(el);
            if (passou) {
              tl.timeScale(1).play();
              gsap.fromTo(cometa, { scale: 1.7 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });
            } else {
              tl.timeScale(2.2).reverse();
            }
          } else {
            el.classList.toggle('is-passado', passou);
          }
        });
        mostrarAno(ano);
        mostrarLegenda(ultimoPassado < 0 ? legendaInicial : itens[ultimoPassado].dataset.legenda || legendaInicial);

        // Régua: a posição do cometa entre as marcas dos anos
        const pontos = geo.pontosMarca;
        const n = pontos.length;
        let k = 0;
        if (cx >= pontos[n - 1]) {
          k = n - 1 + Math.min(0.999, (cx - pontos[n - 1]) / Math.max(1, geo.ultimo - pontos[n - 1]));
        } else if (cx >= pontos[0]) {
          for (let j = 0; j < n - 1; j++) {
            if (cx < pontos[j + 1]) {
              k = j + (cx - pontos[j]) / Math.max(1, pontos[j + 1] - pontos[j]);
              break;
            }
          }
        }
        gsap.set(reguaCheio, { scaleX: limitar(k / n) });
        reguaAnos.forEach((li, i) => li.classList.toggle('is-passado', k >= i));
      };

      montar();
      // A viagem do cometa e, no fim, uma pausa curta para o último cartão acender preso
      gatilho = gsap.timeline({
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: () => {
            montar();
            return `+=${Math.round(geo.distancia * 1.35 * 1.1)}`;
          },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onRefresh: atualizar,
        },
      });
      gatilho.fromTo(estado, { p: 0 }, { p: 1, duration: 1, ease: 'none', onUpdate: atualizar })
        .to({}, { duration: 0.1 });
      atualizar();
    } catch (erro) {
      if (gatilho) {
        if (gatilho.scrollTrigger) gatilho.scrollTrigger.kill(true);
        gatilho.kill();
      }
      secao.classList.remove('is-trilho');
      throw erro;
    }
  }

  /* ---------- Final: as letras se montam com a rolagem ---------- */
  function final() {
    if (reduzir) return;
    const letras = SplitText.create('.final__titulo', { type: 'words,chars', charsClass: 'letra' }).chars;
    gsap.fromTo(letras, {
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-220, 220),
      rotation: () => gsap.utils.random(-110, 110),
      scale: () => gsap.utils.random(0.4, 1.8),
      opacity: 0,
    }, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      ease: 'power3.out',
      stagger: { each: 0.015, from: 'random' },
      scrollTrigger: { trigger: '.final', start: 'top 85%', end: 'center 62%', scrub: 1 },
    });
    gsap.fromTo('.final__botao', { scale: 0, rotation: -90 }, {
      scale: 1,
      rotation: 0,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.final__botao', start: 'top 98%', end: 'top 70%', scrub: 1 },
    });
  }

  /* ---------- Títulos que sobem por linha, rótulos que embaralham, textos que sobem ---------- */
  function revelacoes() {
    if (reduzir) return;
    $$('[data-linhas], .proj__titulo, .escritorio__titulo').forEach((el) => {
      SplitText.create(el, {
        type: 'words,lines',
        linesClass: 'linha',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          if (self.masks) gsap.set(self.masks, { paddingBottom: '0.14em', marginBottom: '-0.14em', paddingRight: '0.1em', marginRight: '-0.1em' });
          return gsap.from(self.lines, {
            yPercent: 112,
            rotation: 2.5,
            transformOrigin: '0% 0%',
            duration: 1.25,
            ease: EASE,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        },
      });
    });

    if (tem('ScrambleTextPlugin')) {
      $$('.rotulo').forEach((el) => {
        const texto = el.textContent.trim();
        el.textContent = ' ';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => gsap.to(el, { duration: 1.1, ease: 'none', scrambleText: { text: texto, chars: SIMBOLOS, speed: 0.45 } }),
        });
      });
    }

    const subir = '.texto, .proj__desc, .selos, .proj__rodape, .ritmo__item, .conferencias__titulo, .cifras li, .kit__totais li, .grafico, .cenarios, .final__texto, .final__endereco, .sites__contador';
    ScrollTrigger.batch($$(subir).filter((el) => !el.closest('.capa, .escritorio__palco')), {
      start: 'top 90%',
      once: true,
      onEnter: (lote) => gsap.fromTo(lote, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: EASE, overwrite: 'auto' }),
    });
    gsap.set($$(subir).filter((el) => !el.closest('.capa, .escritorio__palco')), { opacity: 0 });
  }

  /* ---------- Números em rolo ---------- */
  function rolarOdometros() {
    if (reduzir) return;
    $$('.odometro').forEach((el) => {
      const colunas = el.colunas || [];
      if (!colunas.length) return;
      colunas.forEach(({ coluna }) => {
        coluna.style.transform = '';
        gsap.set(coluna, { yPercent: 0 });
      });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => colunas.forEach(({ coluna, alvo }, i) => {
          gsap.to(coluna, { yPercent: -alvo * 5, duration: 1.7 + i * 0.3, ease: 'expo.out', delay: 0.15 });
        }),
      });
    });
  }

  /* ---------- Topo: some ao descer, volta ao subir ---------- */
  function topo() {
    const barra = $('.topo');
    gsap.to('.progresso', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    let escondido = false;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        barra.classList.toggle('topo--fundo', y > 30);
        const esconder = self.direction === 1 && y > window.innerHeight * 0.6;
        if (esconder === escondido) return;
        escondido = esconder;
        gsap.to(barra, { yPercent: esconder ? -120 : 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
      },
    });
  }

  /* ---------- Cursor em anel e botões magnéticos ---------- */
  function cursor() {
    if (toque || reduzir) return;
    const caixa = $('.cursor');
    const ponto = $('.cursor__ponto');
    const anel = $('.cursor__anel');
    const texto = $('.cursor__texto');
    gsap.set([ponto, anel], { xPercent: -50, yPercent: -50 });
    const pontoX = gsap.quickTo(ponto, 'x', { duration: 0.12, ease: 'power3' });
    const pontoY = gsap.quickTo(ponto, 'y', { duration: 0.12, ease: 'power3' });
    const anelX = gsap.quickTo(anel, 'x', { duration: 0.5, ease: 'power3' });
    const anelY = gsap.quickTo(anel, 'y', { duration: 0.5, ease: 'power3' });
    let visivel = false;
    window.addEventListener('pointermove', (evento) => {
      if (!visivel) {
        visivel = true;
        gsap.to([ponto, anel], { opacity: 1, duration: 0.3 });
      }
      pontoX(evento.clientX);
      pontoY(evento.clientY);
      anelX(evento.clientX);
      anelY(evento.clientY);
    });
    document.addEventListener('pointerleave', () => {
      visivel = false;
      gsap.to([ponto, anel], { opacity: 0, duration: 0.3 });
    });
    $$('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => {
        const rotulo = el.dataset.cursor || '';
        texto.textContent = rotulo;
        caixa.classList.add(rotulo ? 'cursor--ativo' : 'cursor--link');
      });
      el.addEventListener('pointerleave', () => caixa.classList.remove('cursor--ativo', 'cursor--link'));
    });
  }

  function magneticos() {
    if (toque || reduzir) return;
    $$('[data-magnetico]').forEach((el) => {
      const forca = el.classList.contains('final__botao') ? 0.45 : 0.3;
      const paraX = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });
      const paraY = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.35)' });
      el.addEventListener('pointermove', (evento) => {
        const r = el.getBoundingClientRect();
        paraX((evento.clientX - r.left - r.width / 2) * forca);
        paraY((evento.clientY - r.top - r.height / 2) * forca);
      });
      el.addEventListener('pointerleave', () => {
        paraX(0);
        paraY(0);
      });
    });
  }

  /* ---------- Começo ---------- */
  function iniciar() {
    rodar('rolagem', rolagemSuave);
    rodar('ancoras', ancoras);
    // As cenas presas são criadas na ordem da página
    rodar('capa', capa);
    rodar('historia', historia);
    rodar('aste', aste);
    rodar('ferramentas', ferramentas);
    rodar('central', central);
    rodar('lancador', lancador);
    rodar('madrugada', madrugada);
    rodar('time', time);
    rodar('escritorio', escritorio);
    rodar('trade', trade);
    rodar('kit', kit);
    rodar('produtos', produtos);
    rodar('sites', sites);
    rodar('formacao', formacao);
    rodar('final', final);
    rodar('revelacoes', revelacoes);
    rodar('odometros', rolarOdometros);
    rodar('topo', topo);
    // sem o cursor que segue o mouse (o Lorenzo pediu para tirar)
    rodar('magneticos', magneticos);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  const fontes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontes.then(iniciar, iniciar);
})();
