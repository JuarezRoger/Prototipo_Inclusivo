// RNP Accesible — panel institucional (bandeja de revisión manual)

document.addEventListener('DOMContentLoaded', function () {
  var tbody = document.getElementById('review-tbody');
  var statusRegion = document.getElementById('panel-status');
  var detailPanel = document.getElementById('detail-panel');
  var detailBody = document.getElementById('detail-body');
  var detailClose = document.getElementById('detail-close');
  var lastFocusedRow = null;

  var solicitudes = [
    { folio: 'RNP-2026-04112', depto: 'Lempira', motivo: 'Baja resolución de imagen', estado: 'pendiente', solicitante: 'Ciudadano de San Marcos de Caiquín', notas: 'Foto de DPI borrosa, iluminación insuficiente.' },
    { folio: 'RNP-2026-04198', depto: 'Intibucá', motivo: 'Baja resolución de imagen', estado: 'pendiente', solicitante: 'Cuidadora en representación de dependiente', notas: 'Cámara de gama baja, resolución 2MP.' },
    { folio: 'RNP-2026-04205', depto: 'Gracias a Dios', motivo: 'Baja resolución de imagen', estado: 'aprobado', solicitante: 'Ciudadano de Puerto Lempira', notas: 'Aprobado tras verificación manual del operador.' },
    { folio: 'RNP-2026-04231', depto: 'Copán', motivo: 'Baja resolución de imagen', estado: 'rechazado', solicitante: 'Ciudadano de Santa Rosa de Copán', notas: 'Documento ilegible, se solicitó reenvío.' }
  ];

  function statusLabel(estado) {
    return { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' }[estado];
  }

  function statusIcon(estado) {
    return { pendiente: '⏳', aprobado: '✅', rechazado: '⛔' }[estado];
  }

  function renderTable() {
    tbody.innerHTML = '';
    solicitudes.forEach(function (s, idx) {
      var tr = document.createElement('tr');

      var tdFolio = document.createElement('td');
      var linkBtn = document.createElement('button');
      linkBtn.type = 'button';
      linkBtn.className = 'link-like';
      linkBtn.style.cssText = 'background:none;border:none;color:#075E54;text-decoration:underline;cursor:pointer;padding:0;font-size:1rem;';
      linkBtn.textContent = s.folio;
      linkBtn.addEventListener('click', function () { openDetail(idx, linkBtn); });
      tdFolio.appendChild(linkBtn);

      var tdDepto = document.createElement('td');
      tdDepto.textContent = s.depto;

      var tdMotivo = document.createElement('td');
      tdMotivo.textContent = s.motivo;

      var tdEstado = document.createElement('td');
      var badge = document.createElement('span');
      badge.className = 'status-badge status-' + s.estado;
      var dot = document.createElement('span');
      dot.className = 'status-dot status-' + s.estado;
      dot.setAttribute('aria-hidden', 'true');
      var label = document.createElement('span');
      label.textContent = statusIcon(s.estado) + ' ' + statusLabel(s.estado);
      badge.appendChild(dot);
      badge.appendChild(label);
      tdEstado.appendChild(badge);

      var tdActions = document.createElement('td');
      tdActions.className = 'row-actions';
      var approveBtn = document.createElement('button');
      approveBtn.type = 'button';
      approveBtn.textContent = 'Aprobar';
      approveBtn.addEventListener('click', function () { setEstado(idx, 'aprobado'); });
      var rejectBtn = document.createElement('button');
      rejectBtn.type = 'button';
      rejectBtn.textContent = 'Rechazar';
      rejectBtn.addEventListener('click', function () { setEstado(idx, 'rechazado'); });
      tdActions.appendChild(approveBtn);
      tdActions.appendChild(rejectBtn);

      tr.appendChild(tdFolio);
      tr.appendChild(tdDepto);
      tr.appendChild(tdMotivo);
      tr.appendChild(tdEstado);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
  }

  function setEstado(idx, estado) {
    solicitudes[idx].estado = estado;
    renderTable();
    statusRegion.textContent = 'Solicitud ' + solicitudes[idx].folio + ' marcada como ' + statusLabel(estado) + '.';
  }

  function openDetail(idx, triggerEl) {
    lastFocusedRow = triggerEl;
    var s = solicitudes[idx];
    detailBody.innerHTML =
      '<p><strong>Folio:</strong> ' + s.folio + '</p>' +
      '<p><strong>Departamento:</strong> ' + s.depto + '</p>' +
      '<p><strong>Solicitante:</strong> ' + s.solicitante + '</p>' +
      '<p><strong>Motivo de revisión:</strong> ' + s.motivo + '</p>' +
      '<p><strong>Estado actual:</strong> ' + statusLabel(s.estado) + '</p>' +
      '<p><strong>Notas del operador:</strong> ' + s.notas + '</p>';
    detailPanel.hidden = false;
    document.getElementById('detail-heading').setAttribute('tabindex', '-1');
    document.getElementById('detail-heading').focus();
  }

  detailClose.addEventListener('click', function () {
    detailPanel.hidden = true;
    if (lastFocusedRow) { lastFocusedRow.focus(); }
  });

  renderTable();
});
