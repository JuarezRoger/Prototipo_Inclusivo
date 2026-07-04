// RNP Accesible — prototipo navegable (E2). Vanilla JS, sin dependencias externas.

document.addEventListener('DOMContentLoaded', function () {
  var views = document.querySelectorAll('.view');
  var langStatus = document.getElementById('lang-status');

  function showView(id) {
    views.forEach(function (v) { v.hidden = (v.id !== id); });
    var heading = document.getElementById(id).querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  // Selector de idioma (simulado)
  var langNames = { es: 'Español', len: 'Lenca', mis: 'Miskito' };
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.lang-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      langStatus.textContent = 'Idioma cambiado a ' + langNames[btn.dataset.lang] + '.';
    });
  });

  // Navegación desde tarjetas de inicio
  document.querySelectorAll('.flow-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var flow = card.dataset.flow;
      showView('view-' + flow);
      if (flow === 'flow1') startFlow1();
      if (flow === 'flow2') startFlow2();
      if (flow === 'flow3') startFlow3();
    });
  });

  // Botones "volver al inicio"
  document.querySelectorAll('.back-home').forEach(function (btn) {
    btn.addEventListener('click', function () { showView('view-home'); });
  });

  function timestamp() {
    var d = new Date();
    return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  /* ---------------- FLUJO 1: ciudadano rural (chat) ---------------- */

  var chat1Window = document.getElementById('chat1-window');
  var chat1Options = document.getElementById('chat1-options');

  var flow1Steps = {
    start: {
      bot: ['¡Hola! Soy Sofía, tu asistente del RNP. ¿En qué trámite te ayudo hoy?'],
      options: [
        { label: '1) Certificado de nacimiento', next: 'mode' },
        { label: '2) Otro trámite', next: 'other' }
      ]
    },
    other: {
      bot: ['Por ahora este prototipo solo cubre el trámite de certificado de nacimiento. Selecciona la opción 1 para continuar.'],
      options: [{ label: 'Volver', next: 'start' }]
    },
    mode: {
      bot: ['Perfecto. ¿Cómo prefieres continuar?'],
      options: [
        { label: '🎙️', next: 'voice', iconOnly: true, ariaLabel: 'Enviar nota de voz' },
        { label: '⌨️ Continuar por texto', next: 'upload' }
      ]
    },
    voice: {
      bot: ['Nota de voz recibida (simulada). Continuemos con tu solicitud.'],
      options: [{ label: 'Continuar', next: 'upload' }]
    },
    upload: {
      bot: ['Ahora necesito una foto de tu documento de identidad (DPI).'],
      options: [
        { label: '📎 Adjuntar foto (buena calidad)', next: 'success' },
        { label: '📎 Simular cámara de baja resolución', next: 'fallback' }
      ]
    },
    success: {
      bot: [
        '¡Listo! Tu documento fue validado automáticamente.',
        'Tu folio es RNP-2026-04831. Podrás recoger tu certificado en tu municipalidad en 5 días hábiles.'
      ],
      options: [{ label: 'Volver al inicio', action: 'home' }]
    },
    fallback: {
      bot: [
        'Hemos detectado baja calidad de imagen.',
        'Tu solicitud pasará a revisión manual por un operador de RNP en 24-48 horas. Te avisaremos por este mismo chat.'
      ],
      options: [{ label: 'Volver al inicio', action: 'home' }]
    }
  };

  function renderChat(windowEl, optionsEl, steps, stepKey, prefixText) {
    windowEl.innerHTML = '';
    optionsEl.innerHTML = '';
    var step = steps[stepKey];

    if (prefixText) {
      var banner = document.createElement('div');
      banner.className = 'chat-bubble';
      banner.innerHTML = '<p><strong>' + prefixText + '</strong></p>';
      windowEl.appendChild(banner);
    }

    step.bot.forEach(function (line) {
      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.innerHTML = '<p>' + line + '</p><span class="chat-meta">Sofía · ' + timestamp() + '</span>';
      windowEl.appendChild(bubble);
    });

    step.options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      if (opt.iconOnly) { btn.className = 'icon-btn'; }
      btn.textContent = opt.label;
      if (opt.ariaLabel) { btn.setAttribute('aria-label', opt.ariaLabel); }
      btn.addEventListener('click', function () {
        if (opt.next) {
          if (opt.userEcho !== false) {
            var userBubble = document.createElement('div');
            userBubble.className = 'chat-bubble from-user';
            userBubble.innerHTML = '<p>' + opt.label + '</p><span class="chat-meta">Tú · ' + timestamp() + '</span>';
            windowEl.appendChild(userBubble);
          }
          renderChat(windowEl, optionsEl, steps, opt.next, prefixText);
        } else if (opt.action === 'home') {
          showView('view-home');
        }
      });
      optionsEl.appendChild(btn);
    });
  }

  function startFlow1() {
    renderChat(chat1Window, chat1Options, flow1Steps, 'start', null);
  }

  /* ---------------- FLUJO 2: cuidadora / usuario proxy ---------------- */

  var flow2Content = document.getElementById('flow2-content');
  var flow2Banner = document.getElementById('flow2-banner');
  var dependents = [];

  function startFlow2() {
    flow2Banner.hidden = true;
    flow2Content.innerHTML = '';

    var intro = document.createElement('p');
    intro.textContent = '¿Vas a gestionar tu propio trámite o el de alguien más?';
    flow2Content.appendChild(intro);

    var ownBtn = document.createElement('button');
    ownBtn.type = 'button';
    ownBtn.className = 'btn-primary';
    ownBtn.textContent = 'Mi propio trámite';
    ownBtn.style.marginRight = '10px';
    ownBtn.addEventListener('click', function () {
      showView('view-flow1');
      startFlow1();
    });

    var otherBtn = document.createElement('button');
    otherBtn.type = 'button';
    otherBtn.className = 'btn-primary';
    otherBtn.textContent = 'El trámite de alguien más';
    otherBtn.addEventListener('click', renderAddDependentForm);

    flow2Content.appendChild(ownBtn);
    flow2Content.appendChild(otherBtn);
  }

  function renderAddDependentForm() {
    flow2Content.innerHTML = '';

    var form = document.createElement('form');
    form.setAttribute('aria-label', 'Agregar dependiente');

    var nameRow = document.createElement('div');
    nameRow.className = 'form-row';
    var nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'dep-name');
    nameLabel.textContent = 'Nombre completo del dependiente';
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'dep-name';
    nameInput.placeholder = 'Ej. María López';
    nameRow.appendChild(nameLabel);
    nameRow.appendChild(nameInput);

    var relRow = document.createElement('div');
    relRow.className = 'form-row';
    var relLabel = document.createElement('label');
    relLabel.setAttribute('for', 'dep-relation');
    relLabel.textContent = 'Relación con el dependiente';
    var relSelect = document.createElement('select');
    relSelect.id = 'dep-relation';
    ['Hijo/a', 'Madre/Padre', 'Hermano/a', 'Otro familiar'].forEach(function (r) {
      var o = document.createElement('option');
      o.value = r; o.textContent = r;
      relSelect.appendChild(o);
    });
    relRow.appendChild(relLabel);
    relRow.appendChild(relSelect);

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn-primary';
    submitBtn.textContent = 'Agregar y continuar';

    form.appendChild(nameRow);
    form.appendChild(relRow);
    form.appendChild(submitBtn);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameInput.value.trim() || 'Dependiente sin nombre';
      dependents.push({ name: name, relation: relSelect.value });
      renderDependentList();
    });

    flow2Content.appendChild(form);
  }

  function renderDependentList() {
    flow2Content.innerHTML = '';
    var heading = document.createElement('p');
    heading.textContent = 'Selecciona un dependiente para continuar el trámite:';
    flow2Content.appendChild(heading);

    var list = document.createElement('ul');
    list.className = 'dependent-list';
    dependents.forEach(function (dep) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.textContent = dep.name + ' (' + dep.relation + ')';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary';
      btn.textContent = 'Continuar trámite';
      btn.addEventListener('click', function () {
        flow2Banner.hidden = false;
        flow2Banner.textContent = 'Gestionando en representación de: ' + dep.name;
        showView('view-flow1');
        renderChat(chat1Window, chat1Options, flow1Steps, 'start', 'Gestionando en representación de: ' + dep.name);
      });
      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);
    });

    var addAnother = document.createElement('button');
    addAnother.type = 'button';
    addAnother.className = 'btn-secondary';
    addAnother.textContent = '+ Agregar otro dependiente';
    addAnother.addEventListener('click', renderAddDependentForm);

    flow2Content.appendChild(list);
    flow2Content.appendChild(addAnother);
  }

  /* ---------------- FLUJO 3: persona sorda / LESHO ---------------- */

  var flow3Content = document.getElementById('flow3-content');

  function startFlow3() {
    flow3Content.innerHTML = '';

    var menu = document.createElement('div');
    menu.className = 'icon-menu';

    var videoBtn = document.createElement('button');
    videoBtn.type = 'button';
    videoBtn.innerHTML = '<span class="icon-big" aria-hidden="true">▶️</span><span>Ver instrucciones en LESHO</span>';
    videoBtn.addEventListener('click', showLeshoVideo);

    var startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.innerHTML = '<span class="icon-big" aria-hidden="true">📄</span><span>Solicitar certificado</span>';
    startBtn.addEventListener('click', showSimplifiedRequest);

    menu.appendChild(videoBtn);
    menu.appendChild(startBtn);
    flow3Content.appendChild(menu);
  }

  function showLeshoVideo() {
    var existing = document.getElementById('lesho-placeholder');
    if (existing) { existing.remove(); return; }

    var placeholder = document.createElement('div');
    placeholder.id = 'lesho-placeholder';
    placeholder.className = 'lesho-video-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', 'Video en Lengua de Señas Hondureña: cómo solicitar tu certificado de nacimiento. Marcador de posición del prototipo; el video real se produciría con la Asociación de Sordos de Honduras.');
    placeholder.innerHTML =
      '[Video LESHO: Cómo solicitar tu certificado]' +
      '<div class="lesho-captions">Subtítulo: Presiona el botón verde para comenzar tu solicitud.</div>';
    flow3Content.appendChild(placeholder);
  }

  function showSimplifiedRequest() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="chat-bubble"><p>📷 Adjunta la foto de tu documento de identidad.</p></div>';

    var goodBtn = document.createElement('button');
    goodBtn.type = 'button';
    goodBtn.className = 'btn-primary';
    goodBtn.textContent = '✅ Foto enviada (buena calidad)';
    goodBtn.style.marginRight = '10px';

    var badBtn = document.createElement('button');
    badBtn.type = 'button';
    badBtn.className = 'btn-primary';
    badBtn.textContent = '⚠️ Simular baja resolución';

    var resultDiv = document.createElement('div');
    resultDiv.setAttribute('role', 'status');
    resultDiv.setAttribute('aria-live', 'polite');

    goodBtn.addEventListener('click', function () {
      resultDiv.innerHTML = '<div class="chat-bubble"><p>✅ ¡Listo! Folio RNP-2026-07712. Certificado disponible en 5 días hábiles.</p></div>';
    });
    badBtn.addEventListener('click', function () {
      resultDiv.innerHTML = '<div class="chat-bubble"><p>⚠️ Baja calidad detectada. Un operador de RNP revisará tu solicitud en 24-48 horas.</p></div>';
    });

    wrap.appendChild(goodBtn);
    wrap.appendChild(badBtn);
    wrap.appendChild(resultDiv);
    flow3Content.appendChild(wrap);
  }
});
