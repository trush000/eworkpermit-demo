/* ===== E-Work Permit — LocalStorage Database ===== */
const DB_KEY = 'ewp_db';

const SEED_DATA = {
  users: [
    { id: 'u1', employee_id: 'EMP001', full_name: 'นายนัฐวุฒิ หาแพง (Natthawut Hapang)', email: 'natthawut@dowa-tht.co.th', role: 'ADMIN', department: 'IT', phone: '081-111-1111', is_active: true, last_login_at: null, password: 'admin123' },
    { id: 'u2', employee_id: 'EMP002', full_name: 'นางสาวกานมณี หวานฤดี (Karnmanee Wanruedee)', email: 'karnmanee@dowa-tht.co.th', role: 'HR_MGR', department: 'HR', phone: '081-222-2222', is_active: true, last_login_at: null, password: 'hr123' },
    { id: 'u3', employee_id: 'EMP003', full_name: 'นางสาววาสนา พงษ์ศาวิพาพัตน์ (Wassana Pongsawipawat)', email: 'wassana@dowa-tht.co.th', role: 'SAFETY', department: 'HR', phone: '081-333-3333', is_active: true, last_login_at: null, password: 'safety123' },
    { id: 'u4', employee_id: 'EMP004', full_name: 'นายอภิสิทธิ์ ต้นกันยา (Aphisit Tonkanya)', email: 'aphisit@dowa-tht.co.th', role: 'SAFETY', department: 'HR', phone: '081-444-4444', is_active: true, last_login_at: null, password: 'safety123' },
    { id: 'u5', employee_id: 'EMP005', full_name: 'นายสมชาย รักษาชาติ (Area Owner)', email: 'area@dowa.co.th', role: 'AREA_OWNER', department: 'Maintenance', phone: '081-555-5555', is_active: true, last_login_at: null, password: 'area123' },
    { id: 'u6', employee_id: 'EMP006', full_name: 'นายสมศักดิ์ รักษาความปลอดภัย (Security)', email: 'security@dowa-tht.co.th', role: 'GUARD', department: 'Security', phone: '081-666-6666', is_active: true, last_login_at: null, password: 'guard123' },
    { id: 'u7', employee_id: 'EMP007', full_name: 'นายวิชัย ตันติวัฒน์ (Work Owner)', email: 'owner@dowa.co.th', role: 'WORK_OWNER', department: 'Production', phone: '081-777-7777', is_active: true, last_login_at: null, password: 'owner123' },
  ],
  contractor_companies: [
    { id: 'cc1', company_name: 'บริษัท เอ็มที เซอร์วิส จำกัด', tax_id: '0105555001234', contact_name: 'นายมนตรี ท่าน้ำ', contact_phone: '02-123-4567', contact_email: 'mt@mtservice.co.th', contract_start: '2025-01-01', contract_end: '2026-12-31', status: 'ACTIVE', created_at: '2025-01-01' },
    { id: 'cc2', company_name: 'ห้างหุ้นส่วนจำกัด ช.การช่าง', tax_id: '0105555005678', contact_name: 'นายชลชัย บุญมา', contact_phone: '02-234-5678', contact_email: 'chor@chkarn.co.th', contract_start: '2025-03-01', contract_end: '2026-02-28', status: 'ACTIVE', created_at: '2025-03-01' },
    { id: 'cc3', company_name: 'บริษัท สยามเทคนิค แอนด์ เอ็นจิเนียริ่ง จำกัด', tax_id: '0105555009012', contact_name: 'นางสาวสิริพร ดีใจ', contact_phone: '02-345-6789', contact_email: 'siriporn@siamtech.co.th', contract_start: '2024-06-01', contract_end: '2025-05-31', status: 'INACTIVE', created_at: '2024-06-01' },
  ],
  contractors: [
    { id: 'c1', company_id: 'cc1', first_name: 'นายธนกร', last_name: 'วัฒนา', national_id: '1-1001-12345-67-0', birth_date: '1990-05-15', nationality: 'ไทย', phone: '089-111-1111', email: 'thanakorn@gmail.com', photo_url: '', card_number: 'CTR-2025-001', card_issue_date: '2025-01-15', card_expiry_date: '2026-01-14', status: 'ACTIVE', pdpa_consent_at: '2025-01-15', created_at: '2025-01-15' },
    { id: 'c2', company_id: 'cc1', first_name: 'นายสุรพล', last_name: 'ไทยดี', national_id: '1-1001-23456-78-1', birth_date: '1988-10-20', nationality: 'ไทย', phone: '089-222-2222', email: 'surapon@gmail.com', photo_url: '', card_number: 'CTR-2025-002', card_issue_date: '2025-01-15', card_expiry_date: '2025-06-10', status: 'ACTIVE', pdpa_consent_at: '2025-01-15', created_at: '2025-01-15' },
    { id: 'c3', company_id: 'cc2', first_name: 'นายวิรัตน์', last_name: 'ชมภูนุช', national_id: '1-1001-34567-89-2', birth_date: '1992-03-08', nationality: 'ไทย', phone: '089-333-3333', email: 'wirat@gmail.com', photo_url: '', card_number: 'CTR-2025-003', card_issue_date: '2025-02-01', card_expiry_date: '2026-01-31', status: 'ACTIVE', pdpa_consent_at: '2025-02-01', created_at: '2025-02-01' },
  ],
  work_permits: [],
  notifications: [],
};

// ===== Core Database Functions =====
function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
  }
}

function dbGetAll(table) {
  try {
    const data = JSON.parse(localStorage.getItem(DB_KEY));
    return data && data[table] ? data[table] : [];
  } catch(e) {
    console.error('Database Parse Error', e);
    return [];
  }
}

function dbGetById(table, id) {
  const records = dbGetAll(table);
  return records.find(r => r.id === id) || null;
}

function dbSaveTable(table, records) {
  const data = JSON.parse(localStorage.getItem(DB_KEY)) || SEED_DATA;
  data[table] = records;
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function dbInsert(table, record) {
  const records = dbGetAll(table);
  const newRecord = { ...record, id: record.id || 'id_' + Date.now() + Math.random().toString(36).substr(2, 5) };
  records.push(newRecord);
  dbSaveTable(table, records);
  return newRecord;
}

function dbUpdate(table, id, updates) {
  const records = dbGetAll(table);
  const idx = records.findIndex(r => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updates };
    dbSaveTable(table, records);
    return records[idx];
  }
  return null;
}

function dbDelete(table, id) {
  const records = dbGetAll(table);
  const filtered = records.filter(r => r.id !== id);
  dbSaveTable(table, filtered);
  return true;
}

// ===== Auth Functions =====
function loginUser(email, password) {
  const users = dbGetAll('users');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem('ewp_user', JSON.stringify(safeUser));
    dbUpdate('users', user.id, { last_login_at: new Date().toISOString() });
    return safeUser;
  }
  return null;
}

function getCurrentUser() {
  try {
    const stored = localStorage.getItem('ewp_user');
    return (stored && stored !== 'undefined') ? JSON.parse(stored) : null;
  } catch(e) {
    console.error('Session Parse Error', e);
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem('ewp_user');
}

function requireAuth(redirectTo) {
  const user = getCurrentUser();
  if (!user) {
    console.log('No user found, redirecting to login...');
    window.location.href = redirectTo || 'index.html';
    return null;
  }
  return user;
}

// ===== Constants & Role Helpers =====
const ROLES = {
  ADMIN: { label: 'Admin', color: 'accent', icon: '🔧' },
  SAFETY: { label: 'Safety Officer (จป.)', color: 'green', icon: '🦺' },
  WORK_OWNER: { label: 'Work Owner (เจ้าของงาน)', color: 'gold', icon: '👔' },
  AREA_OWNER: { label: 'Area Owner (เจ้าของพื้นที่)', color: 'purple', icon: '🏭' },
  HR_MGR: { label: 'HR Manager (ผจก.บุคคล)', color: 'red', icon: '👩‍💼' },
};

function canDo(user, action) {
  const role = user?.role;
  const perms = {
    create_permit: ['ADMIN', 'SAFETY', 'WORK_OWNER'],
    view_all_permits: ['ADMIN', 'SAFETY', 'HR_MGR'],
    approve_step1: ['ADMIN', 'WORK_OWNER'],
    approve_step2: ['ADMIN', 'AREA_OWNER'],
    approve_step3: ['ADMIN', 'SAFETY'],
    approve_step4: ['ADMIN', 'HR_MGR'],
    manage_contractors: ['ADMIN', 'SAFETY', 'HR_MGR'],
    manage_users: ['ADMIN'],
    view_reports: ['ADMIN', 'SAFETY', 'HR_MGR'],
  };
  return (perms[action] || []).includes(role);
}

const PERMIT_STATUS = {
  DRAFT: { label: 'Draft', badge: 'draft', icon: '📝' },
  PENDING_OWNER: { label: 'รอเจ้าของงาน', badge: 'pending', icon: '⏳' },
  PENDING_AREA: { label: 'รอเจ้าของพื้นที่', badge: 'pending', icon: '⏳' },
  PENDING_SAFETY: { label: 'รอ จป.Safety', badge: 'pending', icon: '⏳' },
  PENDING_HR: { label: 'รอ ผจก.บุคคล', badge: 'pending', icon: '⏳' },
  APPROVED: { label: 'อนุมัติแล้ว', badge: 'approved', icon: '✅' },
  REJECTED: { label: 'ปฏิเสธ', badge: 'rejected', icon: '❌' },
  CLOSED: { label: 'ปิดงานแล้ว', badge: 'closed', icon: '🔒' },
  CANCELLED: { label: 'ยกเลิก', badge: 'rejected', icon: '🚫' },
};

const CONTRACTOR_STATUS = {
  ACTIVE: { label: 'Active', badge: 'active' },
  INACTIVE: { label: 'Inactive', badge: 'inactive' },
  BLACKLIST: { label: 'Blacklist', badge: 'blacklist' },
};

const CERT_STATUS = {
  VALID: { label: 'Valid', badge: 'valid' },
  EXPIRING: { label: 'ใกล้หมดอายุ', badge: 'expiring' },
  EXPIRED: { label: 'หมดอายุ', badge: 'expired' },
};

const PPE_OPTIONS = [
  { key: 'helmet', label: 'หมวกนิรภัย', icon: '⛑️' },
  { key: 'safety_shoes', label: 'รองเท้านิรภัย', icon: '👟' },
  { key: 'gloves', label: 'ถุงมือ', icon: '🧤' },
  { key: 'goggles', label: 'แว่นนิรภัย', icon: '🥽' },
  { key: 'ear_protection', label: 'ที่อุดหู', icon: '🔇' },
  { key: 'harness', label: 'สายรัดนิรภัย', icon: '🪢' },
  { key: 'welding_mask', label: 'หน้ากากเชื่อม', icon: '🥽' },
  { key: 'apron', label: 'ผ้ากันกระเด็น', icon: '🥼' },
  { key: 'insulated_gloves', label: 'ถุงมือฉนวนไฟฟ้า', icon: '⚡' },
  { key: 'vest', label: 'เสื้อสะท้อนแสง', icon: '🦺' },
  { key: 'respirator', label: 'หน้ากากป้องกันสารเคมี', icon: '😷' },
  { key: 'face_shield', label: 'หน้ากากกันหน้า', icon: '🛡️' },
];

const HOT_WORK_TYPES = [
  { key: 'grinding', label: 'เจียร/ตัด' },
  { key: 'welding', label: 'เชื่อม/ดัด' },
  { key: 'drilling', label: 'ขุด/เจาะ' },
  { key: 'burning', label: 'เผา' },
];

const COLD_WORK_TYPES = [
  { key: 'scaffold', label: 'นั่งร้าน' },
  { key: 'height', label: 'ที่สูง' },
  { key: 'electrical', label: 'ไฟฟ้า' },
  { key: 'chemical', label: 'สารเคมี' },
  { key: 'confined', label: 'ที่อับอากาศ' },
];

initDB();
