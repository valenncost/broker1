/* =====================================================================
   Lógica de la landing de Damián Peinado.
   Los datos (teléfono, tasas, textos, etc.) NO se editan acá:
   se editan en config.js, en la raíz del proyecto.
   ===================================================================== */
(function () {
  'use strict';

  window.__revealReady = true;

  /* ───────────────────── Utilidades ───────────────────── */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nf0 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });
  var nf3 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 3 });

  function usd(n) { return 'USD ' + nf0.format(Math.round(n || 0)); }
  function pct(n, decimals) { return (decimals === 1 ? nf1 : nf2).format(n) + '%'; }
  function shortUsd(n) {
    if (n >= 1e6) return 'USD ' + nf2.format(n / 1e6) + 'M';
    if (n >= 1e3) return 'USD ' + nf0.format(n / 1e3) + 'K';
    return usd(n);
  }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
  function num(v, fallback) { var n = Number(v); return isFinite(n) ? n : fallback; }
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function safe(name, fn) {
    try { fn(); } catch (err) { console.error('[landing] Error en "' + name + '":', err); }
  }
  function scrollToEl(el, offset) {
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 84);
    window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  /* Cuota de un préstamo con sistema francés (cuota fija). */
  function cuotaFrancesa(monto, tasaAnual, anios) {
    var n = anios * 12;
    var r = tasaAnual / 100 / 12;
    if (monto <= 0 || n <= 0) return 0;
    if (r === 0) return monto / n;
    return (monto * r) / (1 - Math.pow(1 + r, -n));
  }

  /* Lee montos escritos por el usuario: "400.000", "400,000", "400k", "1,5m". */
  function parseMoney(str) {
    var s = String(str).toLowerCase().replace(/usd|us\$|\$|\s/g, '');
    var mult = 1;
    if (/k$/.test(s)) { mult = 1e3; s = s.slice(0, -1); }
    else if (/(mm|m|millones|millon|millón|mill)$/.test(s)) { mult = 1e6; s = s.replace(/(mm|m|millones|millon|millón|mill)$/, ''); }
    if (mult > 1) {
      var f = parseFloat(s.replace(',', '.'));
      return isNaN(f) ? NaN : Math.round(f * mult);
    }
    var digits = s.replace(/\D/g, '');
    return digits ? Number(digits) : NaN;
  }
  /* Lee porcentajes: "7,25" o "7.25". */
  function parseDecimal(str) {
    var s = String(str).replace(/[%\s]/g, '').replace(',', '.');
    var f = parseFloat(s);
    return isNaN(f) ? NaN : f;
  }

  /* ───────────────────── Configuración ───────────────────── */
  // Valores de respaldo por si config.js tiene un error o le falta algún dato.
  var FALLBACK = {
    nombre: 'Damián Peinado', cargo: 'Asesor hipotecario', nmls: '2713658',
    empresaNombre: '', empresaNmls: '',
    lema: 'All about Mortgage', whatsappNumero: '', whatsappLink: '', whatsappMensaje: 'Hola Damián, quiero consultarte por un crédito para comprar en Miami.',
    calendlyUrl: '', instagramUsuario: 'damian.miami', instagramUrl: 'https://www.instagram.com/damian.miami/',
    seguidores: '+61K', aniosEnBanca: 30,
    fotos: { hero: 'assets/img/damian-placeholder.svg', sobreMi: 'assets/img/damian-placeholder.svg' },
    tasasPorPlazo: { 15: 6.75, 20: 7, 30: 7.25 },
    tasasFechaActualizacion: '', tasasNota: '', tablaTasasExtra: [],
    calculadora: {
      precio: 400000, inicial: 120000, plazo: 30, inicialMinimoPorcentaje: 25, gastosCierrePorcentaje: 3,
      impuestoPorcentaje: 1.9, seguroAnual: 2400, expensasMensuales: 450, precioMinimo: 100000, precioMaximo: 3000000
    },
    hero: { llamadaHorario: 'Hoy · 18:30 hs', ejemploPrecio: 400000, ejemploInicialPorcentaje: 30 },
    sobreMi: { parrafos: [], datos: [] },
    reels: [], testimonios: [], testimonioVideo: null, faq: [],
    formulario: {
      objetivos: ['Invertir', 'Segunda vivienda', 'Renta'],
      presupuestos: [
        { texto: 'Hasta USD 300.000', min: 0, max: 300000 },
        { texto: 'USD 300.000 a 500.000', min: 300000, max: 500000 },
        { texto: 'USD 500.000 a 800.000', min: 500000, max: 800000 },
        { texto: 'Más de USD 800.000', min: 800000, max: null }
      ],
      iniciales: [
        { texto: 'Menos de USD 100.000', min: 0, max: 100000 },
        { texto: 'USD 100.000 a 200.000', min: 100000, max: 200000 },
        { texto: 'Más de USD 200.000', min: 200000, max: null }
      ],
      paises: [{ nombre: 'Argentina', codigo: '54' }],
      cuando: ['Ya, estoy listo', 'En 3 a 6 meses', 'Más adelante']
    }
  };

  var userConfig = null;
  try { userConfig = CONFIG; } catch (e) { userConfig = null; } // eslint-disable-line no-undef
  if (!userConfig || typeof userConfig !== 'object') {
    var banner = $('#config-error');
    if (banner) banner.hidden = false;
    console.error('[landing] No se pudo leer config.js. Revisá comas y comillas en ese archivo.');
    userConfig = {};
  }

  var C = Object.assign({}, FALLBACK, userConfig);
  ['fotos', 'calculadora', 'hero', 'sobreMi', 'formulario'].forEach(function (k) {
    C[k] = Object.assign({}, FALLBACK[k], userConfig[k] || {});
  });
  if (!C.tasasPorPlazo || typeof C.tasasPorPlazo !== 'object') C.tasasPorPlazo = FALLBACK.tasasPorPlazo;

  var CALC = C.calculadora;
  var PLAZOS = Object.keys(C.tasasPorPlazo).map(Number).filter(function (p) { return p > 0; }).sort(function (a, b) { return a - b; });
  function tasaDe(plazo) { return num(C.tasasPorPlazo[plazo], 7); }
  var PLAZO_REF = PLAZOS.indexOf(30) > -1 ? 30 : PLAZOS[PLAZOS.length - 1];
  var MIN_PCT = num(CALC.inicialMinimoPorcentaje, 25);
  var CIERRE_PCT = num(CALC.gastosCierrePorcentaje, 3);
  var PLACEHOLDER_IMG = 'assets/img/damian-placeholder.svg';

  // Con número: el mensaje llega escrito. Sin número pero con link (wa.me/message/...):
  // se abre ese link, que no admite texto (el formulario copia las respuestas).
  var WA_NUMBER = String(C.whatsappNumero || '').replace(/\D/g, '');
  var WA_LINK = String(C.whatsappLink || '').trim();
  var WA_PREFILL = !!WA_NUMBER || !WA_LINK;
  function waUrl(msg) {
    var text = msg ? '?text=' + encodeURIComponent(msg) : '';
    if (WA_NUMBER) return 'https://wa.me/' + WA_NUMBER + text;
    if (WA_LINK) return WA_LINK;
    return 'https://wa.me/' + text;
  }
  function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text); return true; }
    } catch (e) { /* sigue con el método viejo */ }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ───────────────────── Animaciones al scrollear ───────────────────── */
  var revealObserver = null;
  function observeReveals(root) {
    var els = $$('.reveal:not(.is-visible)', root);
    if (!revealObserver) { els.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    els.forEach(function (el) { revealObserver.observe(el); });
  }
  safe('reveal', function () {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    }
    observeReveals(document);
  });

  /* ───────────────────── Datos generales ───────────────────── */
  safe('datos', function () {
    $$('[data-cfg]').forEach(function (el) {
      var v = get(C, el.getAttribute('data-cfg'));
      if (v !== undefined && v !== null && v !== '') el.textContent = v;
    });
    $$('[data-calc-cfg]').forEach(function (el) {
      var v = CALC[el.getAttribute('data-calc-cfg')];
      if (v !== undefined) el.textContent = nf2.format(num(v, 0));
    });
    $$('[data-link="whatsapp"]').forEach(function (a) { a.href = waUrl(C.whatsappMensaje); });
    $$('[data-link="instagram"]').forEach(function (a) { a.href = C.instagramUrl; });
    $$('[data-link="calendly"]').forEach(function (a) {
      a.href = C.calendlyUrl ? C.calendlyUrl : waUrl('Hola Damián, quiero agendar una llamada para hablar de mi caso.');
    });
    $$('[data-img]').forEach(function (img) {
      var src = C.fotos[img.getAttribute('data-img')];
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);
        img.src = PLACEHOLDER_IMG;
      });
      if (src) img.src = src;
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var empresa = $('[data-render="empresa"]');
    if (empresa && C.empresaNombre) {
      empresa.textContent = C.empresaNombre + (C.empresaNmls ? ' · NMLS #' + C.empresaNmls : '');
      empresa.hidden = false;
    }
  });

  /* ───────────────────── Hero ───────────────────── */
  safe('hero', function () {
    var tasa = $('[data-hero="tasa"]');
    if (tasa) tasa.textContent = nf3.format(tasaDe(PLAZO_REF));
    var rateCard = tasa && tasa.closest('.hero-rate');
    if (rateCard) {
      var sub = $('p:last-child', rateCard);
      if (sub) sub.textContent = 'Fija a ' + PLAZO_REF + ' años';
    }

    var fin = $('[data-hero="financia"]');
    if (fin) fin.textContent = nf1.format(100 - MIN_PCT);
    var bar = $('[data-hero="bar"]');
    if (bar) bar.style.width = clamp(MIN_PCT, 0, 100) + '%';
    var minimo = $('[data-hero="minimo"]');
    if (minimo) minimo.textContent = pct(MIN_PCT, 1);

    var precio = num(C.hero.ejemploPrecio, 400000);
    var ini = num(C.hero.ejemploInicialPorcentaje, 30);
    var ejemplo = $('[data-hero="ejemplo"]');
    if (ejemplo) ejemplo.textContent = 'Propiedad de ' + usd(precio) + ' con ' + pct(ini, 1) + ' de inicial';

    var list = $('[data-hero="tabla"]');
    if (list) {
      var prestamo = precio * (1 - ini / 100);
      list.innerHTML = PLAZOS.map(function (p) {
        var highlight = p === PLAZO_REF ? ' bg-cream' : '';
        return '<li class="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5' + highlight + '">' +
          '<span class="whitespace-nowrap font-bold text-navy">' + p + ' años</span>' +
          '<span class="text-[13px]">' + pct(tasaDe(p)) + '</span>' +
          '<span class="font-bold text-navy tabular">' + usd(cuotaFrancesa(prestamo, tasaDe(p), p)) + '<span class="text-[11px] font-medium text-ink">/mes</span></span>' +
          '</li>';
      }).join('');
    }
  });

  /* ───────────────────── Comparación efectivo vs. crédito ───────────────────── */
  safe('comparacion', function () {
    var precio = num(CALC.precio, 400000);
    var inicial = clamp(num(CALC.inicial, precio * 0.3), 0, precio);
    var cierre = precio * CIERRE_PCT / 100;
    var efectivo = precio + cierre;
    var credito = inicial + cierre;
    var set = function (key, val) { var el = $('[data-cmp="' + key + '"]'); if (el) el.textContent = val; };
    set('precio', usd(precio));
    set('pct', pct(precio ? inicial / precio * 100 : 0, 1));
    set('efectivo', usd(efectivo));
    set('credito', usd(credito));
    set('ahorro', usd(efectivo - credito));
    var bar = $('[data-cmp="bar"]');
    if (bar) bar.style.width = clamp(credito / efectivo * 100, 2, 100) + '%';
  });

  /* ───────────────────── Calculadora ───────────────────── */
  var calcUsed = false;
  var calcState = null;
  var calcResult = null;
  var onCalcUsed = [];
  function markCalcUsed() {
    if (calcUsed) return;
    calcUsed = true;
    onCalcUsed.forEach(function (fn) { fn(); });
  }

  safe('calculadora', function () {
    var form = $('#calc');
    if (!form) return;

    var precioMin = num(CALC.precioMinimo, 100000);
    var precioMax = Math.max(num(CALC.precioMaximo, 3000000), precioMin + 10000);
    var plazoInicial = PLAZOS.indexOf(num(CALC.plazo, PLAZO_REF)) > -1 ? num(CALC.plazo, PLAZO_REF) : PLAZO_REF;

    var S = calcState = {
      precio: num(CALC.precio, 400000),
      inicial: num(CALC.inicial, 120000),
      tasa: tasaDe(plazoInicial),
      plazo: plazoInicial,
      impuesto: num(CALC.impuestoPorcentaje, 1.9),
      seguro: num(CALC.seguroAnual, 2400),
      expensas: num(CALC.expensasMensuales, 450)
    };
    S.inicial = clamp(S.inicial, 0, S.precio);

    // Definición de cada campo: texto + barra sincronizados.
    var FIELDS = {
      precio:   { type: 'money', min: 10000, max: 50000000, rangeMin: precioMin, rangeMax: precioMax, step: 5000 },
      inicial:  { type: 'money', min: 0, max: function () { return S.precio; }, rangeMin: 0, rangeMax: function () { return S.precio; }, step: 1000 },
      tasa:     { type: 'decimal', min: 0, max: 25, rangeMin: 3, rangeMax: 12, step: 0.05 },
      impuesto: { type: 'decimal', min: 0, max: 10, rangeMin: 0, rangeMax: 4, step: 0.05 },
      seguro:   { type: 'money', min: 0, max: 500000, rangeMin: 0, rangeMax: 15000, step: 100 },
      expensas: { type: 'money', min: 0, max: 100000, rangeMin: 0, rangeMax: 3000, step: 10 }
    };
    var val = function (v) { return typeof v === 'function' ? v() : v; };

    function formatField(key) {
      var f = FIELDS[key];
      return f.type === 'money' ? nf0.format(Math.round(S[key])) : nf3.format(S[key]);
    }
    function syncRange(key) {
      var f = FIELDS[key];
      var range = $('#rg-' + key);
      if (!range) return;
      var min = val(f.rangeMin), max = Math.max(val(f.rangeMax), min + f.step);
      range.min = min;
      range.max = max;
      range.step = f.step;
      range.value = clamp(S[key], min, max);
      range.style.setProperty('--fill', ((clamp(S[key], min, max) - min) / (max - min) * 100) + '%');
    }
    function syncInput(key) {
      var input = $('#in-' + key);
      if (input && document.activeElement !== input) input.value = formatField(key);
    }

    Object.keys(FIELDS).forEach(function (key) {
      var f = FIELDS[key];
      var input = $('#in-' + key);
      var range = $('#rg-' + key);

      if (range) {
        range.addEventListener('input', function () {
          S[key] = Number(range.value);
          if (key === 'precio' && S.inicial > S.precio) { S.inicial = S.precio; syncInput('inicial'); }
          syncInput(key);
          markCalcUsed();
          update();
        });
      }
      if (input) {
        input.addEventListener('focus', function () {
          setTimeout(function () { try { input.select(); } catch (e) { /* nada */ } }, 0);
        });
        input.addEventListener('input', function () {
          var n = f.type === 'money' ? parseMoney(input.value) : parseDecimal(input.value);
          if (isNaN(n)) return;
          S[key] = Math.min(n, val(f.max));
          markCalcUsed();
          update();
        });
        var commit = function () {
          var n = f.type === 'money' ? parseMoney(input.value) : parseDecimal(input.value);
          if (isNaN(n)) n = S[key];
          S[key] = clamp(n, val(f.min), val(f.max));
          if (key === 'precio' && S.inicial > S.precio) { S.inicial = S.precio; syncInput('inicial'); }
          input.value = formatField(key);
          update();
        };
        input.addEventListener('blur', commit);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); input.blur(); } });
      }
    });

    // Plazo (15 / 20 / 30)
    var plazoGroup = $$('input[name="plazo"]', form);
    // Si en config.js hay otros plazos, se regeneran los botones.
    var existing = plazoGroup.map(function (r) { return Number(r.value); }).join(',');
    if (existing !== PLAZOS.join(',') && plazoGroup.length) {
      var wrap = plazoGroup[0].closest('.grid');
      wrap.className = 'mt-2 grid gap-1.5 rounded-2xl bg-cream p-1.5';
      wrap.style.gridTemplateColumns = 'repeat(' + PLAZOS.length + ', minmax(0, 1fr))';
      wrap.innerHTML = PLAZOS.map(function (p) {
        return '<label class="segment"><input class="sr-only" type="radio" name="plazo" value="' + p + '">' + p + ' años</label>';
      }).join('');
      plazoGroup = $$('input[name="plazo"]', form);
    }
    plazoGroup.forEach(function (radio) {
      radio.checked = Number(radio.value) === S.plazo;
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        S.plazo = Number(radio.value);
        S.tasa = tasaDe(S.plazo);
        var ti = $('#in-tasa');
        if (ti) ti.value = formatField('tasa');
        markCalcUsed();
        update();
      });
    });

    var resetBtn = $('#tasa-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      S.tasa = tasaDe(S.plazo);
      $('#in-tasa').value = formatField('tasa');
      update();
    });

    // Desplegable "Impuestos, seguro y expensas"
    var extrasBtn = $('#extras-btn');
    var extras = $('#extras');
    if (extrasBtn && extras) {
      extrasBtn.addEventListener('click', function () {
        var open = extrasBtn.getAttribute('aria-expanded') !== 'true';
        extrasBtn.setAttribute('aria-expanded', String(open));
        extras.classList.toggle('is-open', open);
        extras.inert = !open;
      });
    }

    // Escala del slider de precio
    var sMin = $('[data-scale="precio-min"]'), sMax = $('[data-scale="precio-max"]');
    if (sMin) sMin.textContent = shortUsd(precioMin);
    if (sMax) sMax.textContent = shortUsd(precioMax);

    // Salidas
    var out = function (key, text) { $$('[data-out="' + key + '"]').forEach(function (el) { el.textContent = text; }); };
    var outEl = function (key) { return $('[data-out="' + key + '"]'); };
    var liveTimer = null;
    var GAP = 0.9;

    function update() {
      var precio = Math.max(S.precio, 0);
      var inicial = clamp(S.inicial, 0, precio);
      var prestamo = Math.max(precio - inicial, 0);
      var pi = Math.round(cuotaFrancesa(prestamo, S.tasa, S.plazo));
      var tax = Math.round(precio * S.impuesto / 100 / 12);
      var ins = Math.round(S.seguro / 12);
      var hoa = Math.round(S.expensas);
      var total = pi + tax + ins + hoa;
      var inicialPct = precio > 0 ? inicial / precio * 100 : 0;
      var inicialPctR = Math.round(inicialPct * 10) / 10;
      var cierre = Math.round(precio * CIERRE_PCT / 100);
      var cash = inicial + cierre;
      var falta = Math.round(precio * MIN_PCT / 100 - inicial);

      calcResult = {
        precio: precio, inicial: inicial, inicialPct: inicialPctR, prestamo: prestamo, tasa: S.tasa, plazo: S.plazo,
        pi: pi, tax: tax, ins: ins, hoa: hoa, total: total, cierre: cierre, cash: cash
      };

      Object.keys(FIELDS).forEach(function (k) { syncRange(k); syncInput(k); });

      out('total', usd(total));
      out('total-mini', usd(total));
      out('pi', usd(pi));
      out('tax', usd(tax));
      out('ins', usd(ins));
      out('hoa', usd(hoa));
      out('extras-mini', usd(tax + ins + hoa) + '/mes');
      out('impuesto-usd', usd(precio * S.impuesto / 100));
      out('inicial-pct', pct(inicialPctR, 1));
      out('prestamo', usd(prestamo));
      out('financiado-pct', pct(Math.round((100 - inicialPctR) * 10) / 10, 1));
      out('inicial', usd(inicial));
      out('cierre', usd(cierre));
      out('cash', usd(cash));
      out('cash-2', usd(cash));
      out('ref-plazo', S.plazo);
      out('ref-tasa', pct(tasaDe(S.plazo)));
      out('resumen', prestamo > 0
        ? 'Crédito de ' + usd(prestamo) + ' a ' + S.plazo + ' años al ' + pct(S.tasa)
        : 'Con este inicial no necesitás crédito.');
      out('form-calc', 'Propiedad ' + usd(precio) + ' · Inicial ' + pct(inicialPctR, 1) + ' · Cuota ' + usd(total) + '/mes');

      var bar = outEl('bar-inicial');
      if (bar) bar.style.width = clamp(inicialPct, 0, 100) + '%';

      if (resetBtn) resetBtn.classList.toggle('hidden', Math.abs(S.tasa - tasaDe(S.plazo)) < 0.001);

      // Aviso de inicial mínimo
      var aviso = outEl('aviso'), ok = outEl('ok');
      if (falta > 0 && precio > 0) {
        out('aviso-texto', 'El inicial mínimo sugerido es del ' + pct(MIN_PCT, 1) + ' (' + usd(precio * MIN_PCT / 100) + '). Te faltan ' + usd(falta) + ' para llegar.');
        if (aviso) aviso.hidden = false;
        if (ok) ok.hidden = true;
      } else {
        out('ok-texto', 'Tu inicial cumple el mínimo sugerido del ' + pct(MIN_PCT, 1) + '.');
        if (aviso) aviso.hidden = true;
        if (ok) ok.hidden = false;
      }

      // Gráfico de torta
      var acc = 0;
      [['pi', pi], ['tax', tax], ['ins', ins], ['hoa', hoa]].forEach(function (seg) {
        var circle = $('[data-seg="' + seg[0] + '"]');
        if (!circle) return;
        var p = total > 0 ? seg[1] / total * 100 : 0;
        var len = p > GAP * 2 ? p - GAP : (p > 0 ? p * 0.6 : 0);
        circle.setAttribute('stroke-dasharray', len.toFixed(3) + ' ' + (100 - len).toFixed(3));
        circle.setAttribute('stroke-dashoffset', (-acc).toFixed(3));
        acc += p;
      });

      // Aviso para lectores de pantalla (con demora para no saturar)
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () {
        var live = $('#calc-live');
        if (live) live.textContent = 'Cuota mensual total estimada: ' + usd(total) + '. Dinero que necesitás hoy: ' + usd(cash) + '.';
      }, 800);
    }

    update();
  });

  /* ───────────────────── Tabla de tasas ───────────────────── */
  safe('tasas', function () {
    var body = $('[data-render="tasas"]');
    if (!body) return;
    var rows = PLAZOS.slice().reverse().map(function (p) {
      return { producto: 'Fija a ' + p + ' años', detalle: '', tasa: tasaDe(p), plazo: p };
    }).concat((C.tablaTasasExtra || []).filter(function (r) { return r && r.producto; }).map(function (r) {
      return { producto: r.producto, detalle: r.detalle || '', tasa: num(r.tasa, 0), plazo: num(r.plazo, 30) };
    }));
    body.innerHTML = rows.map(function (r) {
      return '<tr>' +
        '<td><span class="block font-semibold text-navy">' + esc(r.producto) + '</span>' +
        (r.detalle ? '<span class="block text-[12px]">' + esc(r.detalle) + '</span>' : '') + '</td>' +
        '<td class="text-right font-bold text-navy tabular">' + pct(r.tasa) + '</td>' +
        '<td class="text-right tabular">' + usd(cuotaFrancesa(100000, r.tasa, r.plazo)) + '<span class="text-[12px]">/mes</span></td>' +
        '</tr>';
    }).join('');
  });

  /* ───────────────────── Quién soy ───────────────────── */
  safe('sobre-mi', function () {
    var bio = $('[data-render="bio"]');
    var parrafos = (C.sobreMi.parrafos || []).filter(Boolean);
    if (bio && parrafos.length) {
      bio.innerHTML = parrafos.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    }
    var stats = $('[data-render="stats"]');
    var datos = (C.sobreMi.datos || []).filter(function (d) { return d && d.numero; }).slice(0, 3);
    if (stats && datos.length) {
      stats.innerHTML = datos.map(function (d) {
        return '<div class="flex flex-col-reverse justify-end">' +
          '<dt class="mt-1.5 text-[13px] leading-snug">' + esc(d.texto) + '</dt>' +
          '<dd class="font-display text-[2.1rem] font-medium leading-none text-navy sm:text-5xl">' + esc(d.numero) + '</dd>' +
          '</div>';
      }).join('');
    }
  });

  /* ───────────────────── Reels ───────────────────── */
  function videoCard(item, opts) {
    opts = opts || {};
    var title = esc(item.titulo || '');
    var ratio = opts.ratio || 'aspect-[9/16]';
    var rounded = opts.rounded || 'rounded-2xl';
    if (item.video) {
      return '<div class="relative ' + ratio + ' overflow-hidden ' + rounded + ' bg-navy ' + (opts.extra || '') + '">' +
        '<video class="h-full w-full object-cover" src="' + esc(item.video) + '"' + (item.portada ? ' poster="' + esc(item.portada) + '"' : '') +
        ' controls playsinline preload="none" aria-label="' + title + '"></video></div>';
    }
    var href = item.link || C.instagramUrl;
    var cover = item.portada
      ? '<img src="' + esc(item.portada) + '" alt="" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">'
      : '<span aria-hidden="true" class="absolute left-1/2 top-[42%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"></span>' +
        '<span aria-hidden="true" class="absolute left-1/2 top-[42%] aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"></span>';
    return '<a href="' + esc(href) + '" target="_blank" rel="noopener" class="reel-bg group relative block ' + ratio + ' overflow-hidden ' + rounded + ' ' + (opts.extra || '') + '" aria-label="Ver video: ' + title + ' (se abre en Instagram)">' +
      cover +
      '<span aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/10 to-transparent"></span>' +
      '<span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"><svg class="h-3.5 w-3.5" aria-hidden="true"><use href="#i-ig"/></svg>Reel</span>' +
      '<span aria-hidden="true" class="absolute left-1/2 top-[42%] grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-navy shadow-lg transition-transform duration-300 group-hover:scale-110"><svg class="ml-0.5 h-6 w-6"><use href="#i-play"/></svg></span>' +
      (opts.hideTitle ? '' : '<span class="absolute inset-x-3 bottom-3 text-[14px] font-bold leading-snug text-white sm:inset-x-4 sm:bottom-4 sm:text-[15px]">' + title + '</span>') +
      '</a>';
  }

  safe('reels', function () {
    var grid = $('[data-render="reels"]');
    if (!grid) return;
    var reels = (C.reels || []).filter(Boolean).slice(0, 4);
    if (!reels.length) { grid.closest('section').hidden = true; return; }
    grid.innerHTML = reels.map(function (r, i) {
      return '<div class="reveal" style="--d:' + (i * 0.06) + 's">' + videoCard(r) + '</div>';
    }).join('');
    observeReveals(grid);
  });

  /* ───────────────────── Testimonios ───────────────────── */
  function initials(name) {
    var words = String(name || '').split(/\s+/).filter(function (w) { return w.length > 1 || /[A-ZÁÉÍÓÚÑ]/.test(w); });
    return words.slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  var exampleBadge = function (dark) {
    return '<span class="rounded-full ' + (dark ? 'bg-white/10 text-white/80' : 'bg-cream text-ink') + ' px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]">Testimonio de ejemplo</span>';
  };

  safe('testimonios', function () {
    var grid = $('[data-render="testimonios"]');
    var items = (C.testimonios || []).filter(function (t) { return t && t.texto; });
    if (grid && items.length) {
      grid.innerHTML = items.map(function (t, i) {
        var avatar = t.foto
          ? '<img src="' + esc(t.foto) + '" alt="" loading="lazy" class="h-12 w-12 flex-none rounded-full object-cover">'
          : '<span aria-hidden="true" class="grid h-12 w-12 flex-none place-items-center rounded-full bg-navy font-display text-lg text-gold">' + esc(initials(t.nombre)) + '</span>';
        return '<figure class="reveal card flex flex-col p-6 sm:p-7" style="--d:' + (i * 0.08) + 's">' +
          '<div class="flex items-start justify-between gap-3"><svg class="h-9 w-9 text-gold" aria-hidden="true"><use href="#i-quote"/></svg>' + (t.ejemplo ? exampleBadge(false) : '') + '</div>' +
          '<blockquote class="mt-4 flex-1 text-[1.05rem] leading-relaxed text-navy">“' + esc(t.texto) + '”</blockquote>' +
          (t.compra ? '<p class="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-gold-soft px-3 py-1.5 text-[13px] font-semibold text-navy"><svg class="h-4 w-4 flex-none text-gold-deep" aria-hidden="true"><use href="#i-key"/></svg>' + esc(t.compra) + '</p>' : '') +
          '<figcaption class="mt-5 flex items-center gap-3 border-t border-line pt-5">' + avatar +
          '<span class="min-w-0"><span class="block font-bold text-navy">' + esc(t.nombre) + '</span><span class="block text-[13px]">' + esc(t.ciudad) + '</span></span>' +
          '</figcaption></figure>';
      }).join('');
      observeReveals(grid);
    } else if (grid) {
      grid.hidden = true;
    }

    var v = C.testimonioVideo;
    var slot = $('[data-render="testimonio-video"]');
    if (slot && v && v.titulo) {
      slot.innerHTML = '<div class="on-dark reveal grid overflow-hidden rounded-3xl bg-navy text-white md:grid-cols-2">' +
        '<div class="flex flex-col justify-center p-6 sm:p-10">' +
        '<div class="flex flex-wrap items-center gap-3"><p class="eyebrow">Testimonio en video</p>' + (v.ejemplo ? exampleBadge(true) : '') + '</div>' +
        '<h3 class="mt-4 font-display text-[1.6rem] font-medium leading-tight sm:text-3xl">' + esc(v.titulo) + '</h3>' +
        (v.nombre ? '<p class="mt-2 text-white/70">' + esc(v.nombre) + '</p>' : '') +
        '</div>' +
        '<div class="p-3 pt-0 md:p-3 md:pl-0">' + videoCard(v, { ratio: 'aspect-video md:aspect-auto md:h-full md:min-h-72', rounded: 'rounded-2xl', hideTitle: true }) + '</div>' +
        '</div>';
      observeReveals(slot);
    }
  });

  /* ───────────────────── Preguntas frecuentes ───────────────────── */
  safe('faq', function () {
    var list = $('[data-render="faq"]');
    var items = (C.faq || []).filter(function (f) { return f && f.pregunta; });
    if (!list) return;
    if (!items.length) { list.closest('section').hidden = true; return; }
    list.innerHTML = items.map(function (f, i) {
      return '<div class="reveal card !rounded-2xl" style="--d:' + (i * 0.04) + 's">' +
        '<h3><button type="button" id="faq-b-' + i + '" class="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[1.05rem] font-bold leading-snug text-navy" aria-expanded="false" aria-controls="faq-' + i + '">' +
        '<span>' + esc(f.pregunta) + '</span>' +
        '<span class="faq-icon grid h-9 w-9 flex-none place-items-center rounded-full bg-cream text-navy"><svg class="h-4 w-4" aria-hidden="true"><use href="#i-plus"/></svg></span>' +
        '</button></h3>' +
        '<div id="faq-' + i + '" class="drawer" role="region" aria-labelledby="faq-b-' + i + '" inert><div>' +
        '<p class="px-5 pb-6 leading-relaxed">' + esc(f.respuesta) + '</p>' +
        '</div></div></div>';
    }).join('');
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('button[aria-controls]');
      if (!btn) return;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      panel.inert = !open;
    });
    observeReveals(list);
  });

  /* ───────────────────── Precalificación ───────────────────── */
  var prefillFromCalc = function () {};

  safe('precalificacion', function () {
    var form = $('#precal-form');
    var stepsEl = $('#steps');
    if (!form || !stepsEl) return;

    var F = C.formulario;
    var toOpts = function (arr) {
      return (arr || []).map(function (o) {
        return typeof o === 'string' ? { label: o } : { label: o.texto || o.nombre, min: o.min, max: o.max, code: o.codigo };
      });
    };
    var STEPS = [
      { key: 'objetivo', q: '¿Para qué querés la propiedad?', help: 'Elegí la opción que más se parece a tu objetivo.', opts: toOpts(F.objetivos) },
      { key: 'presupuesto', q: '¿Cuál es tu presupuesto aproximado?', help: 'Precio aproximado de la propiedad que te gustaría comprar.', opts: toOpts(F.presupuestos) },
      { key: 'inicial', q: '¿Cuánto tenés disponible para el inicial?', help: 'El dinero que podrías poner hoy, sin contar el crédito.', opts: toOpts(F.iniciales) },
      { key: 'pais', q: '¿Desde qué país comprarías?', help: 'El país donde vivís y tenés tus ingresos.', opts: toOpts(F.paises).concat([{ label: 'Otro país', other: true }]), cols: 2 },
      { key: 'cuando', q: '¿Cuándo pensás comprar?', help: 'Así te proponemos los próximos pasos adecuados.', opts: toOpts(F.cuando) },
      { key: 'contacto', q: '¿A qué WhatsApp te mandamos tu análisis?', help: 'Al enviar se abre WhatsApp con tus respuestas listas para mandar.', type: 'contact' }
    ];
    var TOTAL = STEPS.length;
    var answers = {};
    var autoFilled = {};
    var cur = 0;
    var advanceTimer = null;

    // Construye los pasos
    stepsEl.innerHTML = STEPS.map(function (st, i) {
      var head = '<legend class="w-full"><h3 id="q-' + st.key + '" tabindex="-1" class="font-display text-[1.65rem] font-medium leading-tight text-navy outline-none sm:text-3xl">' + esc(st.q) + '</h3>' +
        '<p class="mt-2 text-[14px] leading-relaxed">' + esc(st.help) + '</p></legend>';
      var body;
      if (st.type === 'contact') {
        body = '<div class="mt-6 space-y-5">' +
          '<div><label for="lead-nombre" class="field-label">Tu nombre</label>' +
          '<div class="field-box"><input id="lead-nombre" name="nombre" class="field-input !text-[1.1rem]" type="text" autocomplete="name" autocapitalize="words" placeholder="Nombre y apellido" maxlength="60" aria-describedby="err-nombre"></div>' +
          '<p id="err-nombre" class="mt-1.5 hidden text-[13px] font-semibold text-red-700"></p></div>' +
          '<div><span id="lbl-tel" class="field-label">Tu WhatsApp</span>' +
          '<div class="flex gap-2">' +
          '<div class="field-box w-[6.5rem] flex-none !px-3"><span class="field-affix">+</span><input id="lead-cod" name="codigo" class="field-input !text-[1.1rem]" type="text" inputmode="numeric" autocomplete="tel-country-code" maxlength="4" placeholder="54" aria-label="Código de país" aria-describedby="err-tel"></div>' +
          '<div class="field-box min-w-0 flex-1"><input id="lead-tel" name="telefono" class="field-input !text-[1.1rem]" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="11 2345 6789" maxlength="20" aria-labelledby="lbl-tel" aria-describedby="err-tel hint-tel"></div>' +
          '</div>' +
          '<p id="hint-tel" class="mt-1.5 text-[13px]">Con código de área, sin el 0 ni el 15.</p>' +
          '<p id="err-tel" class="mt-1.5 hidden text-[13px] font-semibold text-red-700"></p></div>' +
          '</div>';
      } else {
        body = '<div class="mt-6 grid gap-2.5' + (st.cols === 2 ? ' grid-cols-2' : '') + '">' +
          st.opts.map(function (o, j) {
            return '<label class="choice' + (st.cols === 2 ? ' !min-h-14 !px-3.5 text-[15px]' : '') + '">' +
              '<input class="sr-only" type="radio" name="' + st.key + '" value="' + j + '"' + (o.other ? ' data-other="1"' : '') + '>' +
              '<span class="choice-dot" aria-hidden="true"></span><span class="min-w-0">' + esc(o.label) + '</span></label>';
          }).join('') +
          '</div>' +
          (st.key === 'pais' ? '<div id="pais-otro-wrap" hidden class="mt-3"><label for="pais-otro" class="sr-only">¿Desde qué país?</label><div class="field-box !mt-0"><input id="pais-otro" class="field-input !text-[1.05rem]" type="text" placeholder="Escribí tu país" maxlength="40" autocomplete="country-name"></div></div>' : '');
      }
      return '<fieldset class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '>' + head + body + '</fieldset>';
    }).join('');

    var btnBack = $('#btn-back'), btnNext = $('#btn-next'), btnSubmit = $('#btn-submit');
    var stepNum = $('#step-num'), stepTotal = $('#step-total'), bar = $('#step-bar'), barWrap = $('#step-bar-wrap');
    var errBox = $('#step-error');
    var card = $('#precal-card');
    var inName = $('#lead-nombre'), inCod = $('#lead-cod'), inTel = $('#lead-tel');
    var paisOtroWrap = $('#pais-otro-wrap'), paisOtro = $('#pais-otro');
    if (stepTotal) stepTotal.textContent = TOTAL;

    function isAnswered(i) {
      var st = STEPS[i];
      if (st.type === 'contact') return true;
      var a = answers[st.key];
      if (!a) return false;
      if (a.other) return paisOtro && paisOtro.value.trim().length > 1;
      return true;
    }
    function showError(msg) {
      if (!errBox) return;
      errBox.textContent = msg || '';
      errBox.classList.toggle('hidden', !msg);
    }
    function render(focus) {
      $$('.step', stepsEl).forEach(function (fs, i) { fs.hidden = i !== cur; });
      var last = cur === TOTAL - 1;
      btnBack.hidden = cur === 0;
      btnNext.hidden = last;
      btnSubmit.hidden = !last;
      btnNext.disabled = !isAnswered(cur);
      stepNum.textContent = cur + 1;
      var progress = Math.round((cur + 1) / TOTAL * 100);
      bar.style.width = progress + '%';
      barWrap.setAttribute('aria-valuenow', progress);
      showError('');
      if (focus) {
        var h = $('#q-' + STEPS[cur].key);
        if (h) h.focus({ preventScroll: true });
        var top = card.getBoundingClientRect().top;
        if (top < 70 || top > window.innerHeight * 0.6) scrollToEl(card, 84);
      }
    }
    function next() {
      clearTimeout(advanceTimer);
      if (!isAnswered(cur)) {
        showError(STEPS[cur].key === 'pais' && answers.pais && answers.pais.other ? 'Escribí tu país para seguir.' : 'Elegí una opción para seguir.');
        return;
      }
      if (cur < TOTAL - 1) { cur++; render(true); }
    }
    function back() {
      clearTimeout(advanceTimer);
      if (cur > 0) { cur--; render(true); }
    }
    btnNext.addEventListener('click', next);
    btnBack.addEventListener('click', back);

    function selectOption(key, index, isAuto) {
      var st = STEPS.filter(function (s) { return s.key === key; })[0];
      var o = st.opts[index];
      if (!o) return;
      answers[key] = { label: o.label, code: o.code, other: !!o.other };
      autoFilled[key] = !!isAuto;
      var radio = $('input[name="' + key + '"][value="' + index + '"]', stepsEl);
      if (radio) radio.checked = true;
      if (key === 'pais') {
        paisOtroWrap.hidden = !o.other;
        if (inCod && (!inCod.value || inCod.dataset.auto === '1')) {
          inCod.value = o.code || '';
          inCod.dataset.auto = '1';
        }
      }
    }

    stepsEl.addEventListener('change', function (e) {
      var t = e.target;
      if (t.type !== 'radio') return;
      selectOption(t.name, Number(t.value), false);
      btnNext.disabled = !isAnswered(cur);
      showError('');
      if (t.dataset.other && paisOtro) setTimeout(function () { paisOtro.focus(); }, 50);
    });
    // Con el dedo o el mouse, al elegir una opción pasa solo al siguiente paso.
    stepsEl.addEventListener('click', function (e) {
      var label = e.target.closest('.choice');
      if (!label || e.target.tagName === 'INPUT') return;
      var input = $('input', label);
      if (!input || input.dataset.other) return;
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(next, 300);
    });
    if (paisOtro) {
      paisOtro.addEventListener('input', function () { btnNext.disabled = !isAnswered(cur); });
      paisOtro.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); next(); } });
    }
    if (inCod) inCod.addEventListener('input', function () { inCod.dataset.auto = '0'; inCod.value = inCod.value.replace(/\D/g, ''); });

    // Valores que vienen de la calculadora
    function findRange(opts, value) {
      for (var i = 0; i < opts.length; i++) {
        var min = num(opts[i].min, 0);
        var max = opts[i].max == null ? Infinity : num(opts[i].max, Infinity);
        if (value >= min && value < max) return i;
      }
      return -1;
    }
    prefillFromCalc = function () {
      if (!calcResult) return;
      ['presupuesto', 'inicial'].forEach(function (key) {
        if (answers[key] && !autoFilled[key]) return; // respeta lo que eligió el usuario
        var st = STEPS.filter(function (s) { return s.key === key; })[0];
        var idx = findRange(st.opts, key === 'presupuesto' ? calcResult.precio : calcResult.inicial);
        if (idx > -1) selectOption(key, idx, true);
      });
      var summary = $('#calc-summary');
      if (summary) summary.hidden = false;
      btnNext.disabled = !isAnswered(cur);
    };

    // Validación del último paso
    function fieldError(input, errEl, msg) {
      if (errEl) { errEl.textContent = msg || ''; errEl.classList.toggle('hidden', !msg); }
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (input) input.closest('.field-box').style.borderColor = msg ? '#B91C1C' : '';
    }
    function validateContact() {
      var ok = true;
      var name = inName.value.trim().replace(/\s+/g, ' ');
      if (name.length < 2 || !/[a-záéíóúñü]/i.test(name)) {
        fieldError(inName, $('#err-nombre'), 'Escribí tu nombre.');
        ok = false;
      } else fieldError(inName, $('#err-nombre'), '');

      var cod = inCod.value.replace(/\D/g, '');
      var tel = inTel.value.replace(/\D/g, '');
      var errTel = $('#err-tel');
      if (!cod) { fieldError(inCod, errTel, 'Escribí el código de tu país (por ejemplo 54 para Argentina).'); ok = false; }
      else if (tel.length < 6 || tel.length > 15) { fieldError(inCod, null, ''); fieldError(inTel, errTel, 'Revisá tu número de WhatsApp: tiene que tener entre 6 y 15 números.'); ok = false; }
      else { fieldError(inCod, null, ''); fieldError(inTel, errTel, ''); }

      if (!ok) {
        var firstBad = $('[aria-invalid="true"]', form);
        if (firstBad) firstBad.focus();
      }
      return ok;
    }
    [inName, inTel, inCod].forEach(function (el) {
      if (el) el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') fieldError(el, null, '');
      });
    });

    function buildMessage() {
      var lines = [];
      var cod = inCod.value.replace(/\D/g, '');
      var paisLabel = answers.pais ? (answers.pais.other ? paisOtro.value.trim() : answers.pais.label) : '';
      lines.push('Hola Damián 👋 Completé la precalificación en tu página y quiero mi análisis personalizado.');
      lines.push('');
      lines.push('*Mis datos*');
      lines.push('• Nombre: ' + inName.value.trim().replace(/\s+/g, ' '));
      lines.push('• WhatsApp: +' + cod + ' ' + inTel.value.trim());
      lines.push('');
      lines.push('*Mis respuestas*');
      lines.push('• Objetivo: ' + (answers.objetivo ? answers.objetivo.label : '-'));
      lines.push('• Presupuesto: ' + (answers.presupuesto ? answers.presupuesto.label : '-'));
      lines.push('• Inicial disponible: ' + (answers.inicial ? answers.inicial.label : '-'));
      lines.push('• País: ' + (paisLabel || '-'));
      lines.push('• Cuándo: ' + (answers.cuando ? answers.cuando.label : '-'));
      if (calcUsed && calcResult) {
        var r = calcResult;
        lines.push('');
        lines.push('*Mis números de la calculadora*');
        lines.push('• Precio de la propiedad: ' + usd(r.precio));
        lines.push('• Inicial: ' + usd(r.inicial) + ' (' + pct(r.inicialPct, 1) + ')');
        lines.push('• Plazo y tasa: ' + r.plazo + ' años al ' + pct(r.tasa));
        lines.push('• Monto a financiar: ' + usd(r.prestamo));
        lines.push('• Cuota mensual total estimada: ' + usd(r.total));
        lines.push('• Dinero necesario hoy: ' + usd(r.cash));
      }
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (cur !== TOTAL - 1) { next(); return; }
      if (!validateContact()) return;
      var msg = buildMessage();
      var url = waUrl(msg);
      if (!WA_PREFILL) copyText(msg);
      $$('[data-done="prefill"]').forEach(function (el) { el.hidden = !WA_PREFILL; });
      $$('[data-done="copy"]').forEach(function (el) { el.hidden = WA_PREFILL; });
      lastMessage = msg;
      var win = window.open(url, '_blank');
      if (!win) window.location.href = url;
      else { try { win.opener = null; } catch (err) { /* nada */ } }

      $('#done-wa').href = url;
      $('[data-out="lead-nombre"]').textContent = inName.value.trim().split(/\s+/)[0] || 'gracias';
      $('#precal-flow').hidden = true;
      var done = $('#precal-done');
      done.hidden = false;
      done.focus({ preventScroll: true });
      if (card.getBoundingClientRect().top < 70) scrollToEl(card, 84);
    });

    var lastMessage = '';
    var copyBtn = $('#btn-copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var ok = copyText(lastMessage);
      $('[data-out="copy-label"]').textContent = ok ? '¡Copiado! Pegalo en WhatsApp' : 'No se pudo copiar';
    });

    $('#btn-restart').addEventListener('click', function () {
      answers = {};
      autoFilled = {};
      $$('input[type="radio"]', stepsEl).forEach(function (r) { r.checked = false; });
      if (paisOtro) paisOtro.value = '';
      if (paisOtroWrap) paisOtroWrap.hidden = true;
      cur = 0;
      var copyLabel = $('[data-out="copy-label"]');
      if (copyLabel) copyLabel.textContent = 'Copiar respuestas de nuevo';
      $('#precal-done').hidden = true;
      $('#precal-flow').hidden = false;
      if (calcUsed) prefillFromCalc();
      render(true);
    });

    render(false);
  });

  /* Botón "Quiero mi análisis personalizado" */
  function goToAnalysis() {
    markCalcUsed();
    prefillFromCalc();
    var card = $('#precal-card');
    if (card) scrollToEl(card, 84);
  }
  safe('cta-analisis', function () {
    var btn = $('#btn-analisis');
    if (btn) btn.addEventListener('click', goToAnalysis);
  });

  /* ───────────────────── Navegación, barra fija y WhatsApp ───────────────────── */
  safe('navegacion', function () {
    var header = $('#header');
    var menuBtn = $('#menu-btn');
    var menu = $('#mobile-menu');
    var menuOpen = false;

    function setMenu(open) {
      menuOpen = open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.classList.toggle('is-open', open);
      menu.inert = !open;
      $('[data-menu-open]', menuBtn).classList.toggle('hidden', open);
      $('[data-menu-close]', menuBtn).classList.toggle('hidden', !open);
      onScroll();
    }
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
      $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); } });
      document.addEventListener('click', function (e) { if (menuOpen && !header.contains(e.target)) setMenu(false); });
      window.addEventListener('resize', function () { if (window.innerWidth >= 1024 && menuOpen) setMenu(false); });
    }

    var sticky = $('#sticky-cta');
    var stickyLink = $('#sticky-cta-link');
    var stickyText = $('#sticky-cta-text');
    var hero = $('#inicio');
    var calcSec = $('#calculadora');
    var precalSec = $('#precalificacion');
    var contacto = $('#contacto');

    onCalcUsed.push(function () {
      if (stickyText) stickyText.textContent = 'Pedí tu análisis personalizado';
      if (stickyLink) stickyLink.setAttribute('href', '#precalificacion');
    });
    if (stickyLink) stickyLink.addEventListener('click', function (e) {
      if (calcUsed) { e.preventDefault(); goToAnalysis(); }
    });

    function inView(el) {
      if (!el || el.hidden) return false;
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      return r.top < vh * 0.8 && r.bottom > vh * 0.2;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (header) header.classList.toggle('header-scrolled', window.pageYOffset > 8 || menuOpen);
        if (!sticky) return;
        var pastHero = hero ? hero.getBoundingClientRect().bottom < 80 : true;
        var show = pastHero && !inView(calcSec) && !inView(precalSec) && !inView(contacto);
        sticky.classList.toggle('is-visible', show);
        sticky.inert = !show;
        document.body.classList.toggle('has-sticky', show);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  });
})();
