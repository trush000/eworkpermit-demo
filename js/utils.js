/* ===== E-Work Permit — Shared Utilities ===== */

// ===== Toast Notifications =====
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== Modal =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ===== Tabs =====
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const btns = container.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      container.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('active', p.id === target);
      });
    });
  });
}

// ===== Date/Time Formatting =====
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function formatDateTime(dtStr) {
  if (!dtStr) return '-';
  try {
    const d = new Date(dtStr);
    return d.toLocaleString('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return dtStr; }
}

function formatDateRange(start, end) {
  if (!start) return '-';
  if (!end || start === end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function daysLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return '';
  if (days < 0) return `หมดอายุแล้ว ${Math.abs(days)} วัน`;
  if (days === 0) return 'หมดอายุวันนี้';
  return `อีก ${days} วัน`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ===== Badge Rendering =====
function renderBadge(status, statusMap) {
  const s = statusMap[status];
  if (!s) return `<span class="badge badge-draft">${status}</span>`;
  return `<span class="badge badge-${s.badge}">${s.icon || ''} ${s.label}</span>`;
}

function permitBadge(status) {
  return renderBadge(status, PERMIT_STATUS);
}

function contractorBadge(status) {
  return renderBadge(status, CONTRACTOR_STATUS);
}

function certBadge(status) {
  return renderBadge(status, CERT_STATUS);
}

// ===== Sidebar Active Link =====
function setActiveNav() {
  const path = window.location.pathname.toLowerCase();
  
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (!href || href.startsWith('javascript')) {
      item.classList.remove('active');
      return;
    }

    // Normalize href to handle ../ and current directory
    const tempAnchor = document.createElement('a');
    tempAnchor.href = href;
    const normalizedHref = tempAnchor.pathname.toLowerCase();

    let isMatched = (path === normalizedHref);

    // Folder-based matching for sub-pages
    if (!isMatched) {
      if (path.includes('/work-permits/') && normalizedHref.includes('/work-permits/index.html')) isMatched = true;
      if (path.includes('/contractors/') && normalizedHref.includes('/contractors/')) isMatched = true;
      if (path.includes('/admin/') && normalizedHref.includes('/admin/')) isMatched = true;
      if (path.includes('/reports/') && normalizedHref.includes('/reports/')) isMatched = true;
    }

    if (isMatched) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ===== Render Sidebar =====
function renderSidebar(basePath = '../') {
  const user = getCurrentUser();
  if (!user) return;

  const pendingWP = dbGetAll('work_permits').filter(p => p.status.startsWith('PENDING')).length;
  const expiringCerts = dbGetAll('contractor_certificates').filter(c => {
    const days = daysUntil(c.expiry_date);
    return days !== null && days <= 30 && days >= 0;
  }).length;

  const navItems = [
    { icon: '📊', label: 'Dashboard', href: `${basePath}dashboard.html`, section: '' },
    { icon: '🔔', label: 'การแจ้งเตือน', href: `${basePath}notifications.html`, badge: dbGetAll('notifications').filter(n => n.status === 'PENDING').length || null, badgeClass: 'badge-red' },
    { icon: '🌓', label: 'เปลี่ยนธีม (Light/Dark)', href: 'javascript:void(0)', onclick: 'toggleTheme()', id: 'theme-toggle' },
    { section: 'Work Permit' },
    { icon: '🪪', label: 'Work Permits', href: `${basePath}work-permits/index.html`, badge: pendingWP > 0 ? pendingWP : null, badgeClass: '' },
    { icon: '➕', label: 'สร้าง Permit ใหม่', href: `${basePath}work-permits/create.html`, show: ['ADMIN','SAFETY','WORK_OWNER'] },
    { section: 'Contractor' },
    { icon: '👷', label: 'ผู้รับเหมา', href: `${basePath}contractors/index.html` },
    { icon: '🏢', label: 'บริษัทผู้รับเหมา', href: `${basePath}contractors/companies.html` },
    { icon: '📝', label: 'ลงทะเบียนใหม่', href: `${basePath}contractors/register.html`, show: ['ADMIN','SAFETY','HR_MGR'] },
    { section: 'Admin' },
    { icon: '📈', label: 'รายงาน', href: `${basePath}reports/index.html`, show: ['ADMIN','SAFETY','HR_MGR'] },
    { icon: '👥', label: 'ผู้ใช้งาน', href: `${basePath}admin/users.html`, show: ['ADMIN'] },
  ];

  let html = `
    <a href="${basePath}dashboard.html" class="sidebar-logo">
      <span class="badge">DOWA</span>
      <div class="brand">E-Work Permit<small>Contractor Control System</small></div>
    </a>
    <nav class="sidebar-nav">`;

  let lastSection = '';
  navItems.forEach(item => {
    if (item.section !== undefined) {
      if (item.section) {
        html += `<div class="nav-section">${item.section}</div>`;
      }
      lastSection = item.section;
      return;
    }
    if (item.show && !item.show.includes(user.role)) return;
    const badgeHtml = item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : '';
    const onclickAttr = item.onclick ? `onclick="${item.onclick}"` : `onclick="console.log('Navigating to:', '${item.href}')"`;
    html += `<a href="${item.href}" class="nav-item" ${onclickAttr} id="${item.id || ''}"><span class="nav-icon">${item.icon}</span>${item.label}${badgeHtml}</a>`;
  });

  html += `</nav>
    <div class="sidebar-user" onclick="doLogout()">
      <div class="user-avatar">${user.full_name.charAt(0)}</div>
      <div class="user-info">
        <div class="user-name">${user.full_name}</div>
        <div class="user-role">${ROLES[user.role]?.label || user.role}</div>
      </div>
      <span style="color:var(--text3);font-size:14px;">↩</span>
    </div>`;

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = html;
    setActiveNav();
  }
}

function doLogout() {
  if (confirm('ยืนยันการออกจากระบบ?')) {
    logoutUser();
    const root = getRootPath();
    window.location.href = root + 'index.html';
  }
}

function getRootPath() {
  // More robust way to find root for file:// or http://
  const path = window.location.pathname;
  if (path.includes('/work-permits/') || path.includes('/contractors/') || path.includes('/admin/') || path.includes('/reports/')) {
    return '../';
  }
  return '';
}

// ===== Notification Badge =====
function updateNotifBadge() {
  const notifs = dbGetAll('notifications').filter(n => n.status === 'PENDING').length;
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.style.display = notifs > 0 ? 'block' : 'none';
  }
}

// ===== Search/Filter helper =====
function filterTable(rows, query, fields) {
  if (!query) return rows;
  const q = query.toLowerCase();
  return rows.filter(row =>
    fields.some(f => String(row[f] || '').toLowerCase().includes(q))
  );
}

// ===== Confirm Dialog =====
function confirmAction(message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="modal" style="max-width:400px;">
      <div class="modal-header">
        <span class="modal-title">⚠️ ยืนยันการดำเนินการ</span>
      </div>
      <div class="modal-body">
        <p style="color:var(--text2);">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost btn-cancel">ยกเลิก</button>
        <button class="btn btn-danger btn-ok">ยืนยัน</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('.btn-cancel').onclick = () => modal.remove();
  modal.querySelector('.btn-ok').onclick = () => { modal.remove(); onConfirm(); };
}

// ===== Signature Pad =====
function initSignaturePad(canvasId, clearBtnId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let hasDrawn = false;

  // Set canvas size
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = canvas.offsetHeight || 120;

  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDraw(e) { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); e.preventDefault(); }
  function draw(e) { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasDrawn = true; e.preventDefault(); }
  function endDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw);

  // Hide hint when drawn
  canvas.addEventListener('mousedown', () => {
    const hint = canvas.parentElement.querySelector('.sig-pad-hint');
    if (hint) hint.style.display = 'none';
  });

  if (clearBtnId) {
    const clearBtn = document.getElementById(clearBtnId);
    if (clearBtn) {
      clearBtn.onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawn = false;
        const hint = canvas.parentElement.querySelector('.sig-pad-hint');
        if (hint) hint.style.display = '';
      };
    }
  }

  return {
    getDataURL: () => hasDrawn ? canvas.toDataURL('image/png') : null,
    isEmpty: () => !hasDrawn,
    clear: () => { ctx.clearRect(0, 0, canvas.width, canvas.height); hasDrawn = false; }
  };
}

// ===== QR Code Generator (Simple grid representation) =====
function generateQRPlaceholder(text) {
  // Creates a simple visual placeholder for QR codes
  const size = 7;
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;width:56px;height:56px;">';
  const pattern = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const filled = pattern[r][c] === 1;
      html += `<div style="background:${filled?'#000':'#fff'};width:100%;height:100%;"></div>`;
    }
  }
  html += '</div>';
  return html;
}

// ===== Export to CSV =====
function exportToCSV(data, filename, columns) {
  const headers = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = typeof c.fn === 'function' ? c.fn(row) : (row[c.key] || '');
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Export CSV สำเร็จ', 'success');
}

// ===== Pagination =====
function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    pages: Math.ceil(items.length / perPage),
    page,
    perPage
  };
}

function renderPagination(containerId, paging, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (paging.pages <= 1) { container.innerHTML = ''; return; }
  let html = `<div class="flex-center gap-8" style="justify-content:center;margin-top:16px;">
    <span class="text-muted text-sm">แสดง ${Math.min((paging.page-1)*paging.perPage+1, paging.total)}-${Math.min(paging.page*paging.perPage, paging.total)} จาก ${paging.total} รายการ</span>
    <div class="flex-center gap-8">`;
  for (let i = 1; i <= paging.pages; i++) {
    html += `<button onclick="${onPageChange}(${i})" class="btn btn-sm ${i === paging.page ? 'btn-primary' : 'btn-ghost'}">${i}</button>`;
  }
  html += `</div></div>`;
  container.innerHTML = html;
}
// ===== Theme Management =====
function initTheme() {
  const theme = localStorage.getItem('ewp_theme') || 'dark';
  document.body.classList.toggle('light-theme', theme === 'light');
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('ewp_theme', isLight ? 'light' : 'dark');
  showToast(`เปลี่ยนเป็นโหมด ${isLight ? 'สว่าง' : 'มืด'}`, 'info');
}

// Initialize theme on load
initTheme();
