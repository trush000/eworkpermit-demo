# E-Work Permit System — System Architecture

เอกสารนี้รวบรวมรายละเอียดทางสถาปัตยกรรม ฟังก์ชันการทำงาน และโครงสร้างข้อมูลของระบบ **Dowa E-Work Permit (Demo)** เพื่อใช้เป็นแนวทางในการพัฒนาและดูแลรักษา

---

## 1. Technical Stack (สถาปัตยกรรมทางเทคนิค)

ระบบถูกออกแบบมาให้ทำงานแบบ **Serverless Frontend** เพื่อความรวดเร็วในการ Demo และความง่ายในการติดตั้ง:

-   **Frontend:** HTML5, Vanilla JavaScript (ES6+), CSS3 (Modern Variables & Themes)
-   **Database:** `LocalStorage` (จำลองฐานข้อมูลฝั่ง Client) พร้อมระบบ Seed Data อัตโนมัติ
-   **Styling:** Custom CSS Framework (Modular Grid, Glassmorphism, Theme Variables)
-   **Security:** ระบบ Session-based Auth (ผ่าน LocalStorage), Role-based Access Control (RBAC)
-   **External Assets:** Google Fonts (IBM Plex Sans Thai), Font Awesome-like Icons (Emoji/Unicode)

---

## 2. Core Modules & Functionalities (โมดูลและฟังก์ชันหลัก)

### 2.1 Authentication & Security (ระบบความปลอดภัย)
-   **Login System:** ตรวจสอบอีเมลและรหัสผ่านจากฐานข้อมูลจำลอง
-   **Session Management:** เก็บสถานะผู้ใช้ปัจจุบันและจัดการระบบ Logout
-   **Role-based Access (RBAC):** กำหนดสิทธิ์การเข้าถึงฟังก์ชันต่างๆ ตามบทบาท (Admin, Safety, Work Owner, Area Owner, HR, Guard)
-   **Redirect Loop Protection:** ระบบป้องกันการวนลูปกรณี Session ผิดพลาด

### 2.2 Dashboard & Statistics (หน้าหลักและสถิติ)
-   **Overview Stats:** แสดงจำนวนใบงานแยกตามสถานะ (Pending, Approved, Expiring)
-   **Quick Access:** เมนูเข้าถึงฟังก์ชันหลักตามสิทธิ์ของผู้ใช้งาน
-   **Real-time Clock:** แสดงวันเวลาปัจจุบันและข้อมูลผู้ใช้ที่ล็อกอิน

### 2.3 Work Permit Management (ระบบใบอนุญาตทำงาน)
-   **Multi-step Wizard:** กระบวนการสร้างใบงาน 4 ขั้นตอน (ข้อมูลหลัก -> มาตรการ/PPE -> ทีมงาน -> สรุปผล)
-   **Smart Work Type:** รองรับการเลือกงานร้อน (Hot Work) และงานเย็น (Cold Work) พร้อมกันในใบเดียว
-   **PPE Selection:** ระบบเลือกอุปกรณ์ป้องกันความปลอดภัยแบบไอคอนโต้ตอบ
-   **Digital Signature:** ระบบลงลายเซ็นดิจิทัลผ่านหน้าจอ (Signature Pad) ในขั้นตอนสุดท้าย
-   **Approval Workflow:** ระบบส่งอนุมัติตามลำดับขั้น (Owner -> Area -> Safety -> HR)

### 2.4 Contractor Management (จัดการผู้รับเหมา)
-   **Registration Wizard:** ระบบลงทะเบียนผู้รับเหมาใหม่พร้อมตรวจสอบ PDPA Consent
-   **National ID Lookup:** ตรวจสอบเลขบัตรประชาชนอัตโนมัติ (Auto-fill ข้อมูลเดิมและล็อคการแก้ไขหากมีในระบบแล้ว)
-   **Certificate Management:** อัปโหลดและจัดการใบเซอร์รายบุคคล (เช่น ใบจป., งานที่สูง, งานไฟฟ้า)
-   **Card View & Table View:** สลับโหมดการดูรายชื่อผู้รับเหมาแบบตารางหรือแบบการ์ด (Modern Grid)
-   **QR Code Placeholder:** จำลองการออกบัตรผู้รับเหมาพร้อมรหัสประจำตัว

### 2.5 Admin & Settings (การจัดการระบบ)
-   **User Management:** เพิ่ม แก้ไข ลบ และเปลี่ยนสถานะผู้ใช้งานระบบ
-   **Permission Matrix:** แสดงตารางสิทธิ์การใช้งานของแต่ละบทบาทอย่างละเอียด
-   **Theme Switcher:** ระบบสลับธีมระหว่าง **Dark Mode** และ **Light Mode**
-   **Hard Reset:** ฟังก์ชันล้างข้อมูลฐานข้อมูลและ Session เพื่อเริ่มต้นใหม่

---

## 3. Database Schema (โครงสร้างข้อมูล)

ระบบใช้โครงสร้าง JSON เก็บใน `ewp_db` key ของ LocalStorage:

### 3.1 Tables (ตารางข้อมูลหลัก)
| ตาราง | คำอธิบาย |
| :--- | :--- |
| `users` | ข้อมูลผู้ใช้งานระบบ, บทบาท, แผนก, รหัสผ่าน |
| `contractor_companies` | ข้อมูลบริษัทผู้รับเหมาที่ขึ้นทะเบียน |
| `contractors` | ข้อมูลบุคคลผู้รับเหมา, เลขบัตรประชาชน, สถานะบัตร, วันหมดอายุ |
| `contractor_certificates` | รายการใบเซอร์ของผู้รับเหมาแต่ละคน, วันหมดอายุ, สถานะตรวจสอบ |
| `work_permits` | ข้อมูลใบขออนุญาต, ประเภทงาน, PPE, ทีมงาน, ลายเซ็น, สถานะอนุมัติ |
| `notifications` | ประวัติการแจ้งเตือนและระบบ Notification ภายใน |

---

## 4. UI/UX Design System

-   **Color Palette:**
    *   **Dark Theme:** Midnight Blue (`#0a0e1a`), Cyan Accent (`#00d4ff`)
    *   **Light Theme:** Soft White (`#f8fafc`), Sky Blue Accent (`#0ea5e9`)
-   **Typography:** IBM Plex Sans Thai (Professional & Readable)
-   **Components:**
    *   **Toasts:** ระบบแจ้งเตือนมุมล่างขวา (Success, Error, Warning)
    *   **Modals:** ระบบ Pop-up สำหรับฟอร์มและข้อความยืนยัน
    *   **Badges:** สัญลักษณ์แสดงสถานะ (Active, Pending, Expired)

---

## 5. File Structure (โครงสร้างไฟล์)

```text
/
├── index.html              # หน้า Login
├── dashboard.html          # หน้าหลัก/Dashboard
├── notifications.html      # ระบบแจ้งเตือน
├── SYSTEM_ARCHITECTURE.md  # (ไฟล์นี้) เอกสารสถาปัตยกรรม
│
├── admin/                  # โมดูลผู้ดูแลระบบ
│   └── users.html          # จัดการผู้ใช้ & สิทธิ์
│
├── contractors/            # โมดูลจัดการผู้รับเหมา
│   ├── index.html          # ทะเบียนผู้รับเหมา
│   ├── register.html       # ลงทะเบียน/แก้ไขข้อมูล
│   └── detail.html         # รายละเอียดผู้รับเหมา
│
├── work-permits/           # โมดูลใบอนุญาตทำงาน
│   ├── index.html          # รายการใบงานทั้งหมด
│   └── create.html         # สร้างใบงานใหม่ (Wizard)
│
├── js/                     # Logic & Database
│   ├── db.js               # จัดการ LocalStorage & Seed Data
│   └── utils.js            # UI Helpers, Auth & Themes
│
└── css/                    # Stylesheets
    └── style.css           # Global Styles & Theme Variables
```

---

## 6. Future Roadmap (แผนการพัฒนาต่อ)
1. **Cloud Integration:** ย้ายฐานข้อมูลจาก LocalStorage ไปยัง Supabase หรือ Firebase
2. **File Storage:** เชื่อมต่อระบบอัปโหลดไฟล์จริง (เช่น AWS S3 หรือ OneDrive)
3. **Email Integration:** เชื่อมต่อระบบ Resend API เพื่อส่งอีเมลอนุมัติจริง
4. **Offline Mode:** เพิ่มความสามารถในการเก็บข้อมูลแบบ Offline และ Sync เมื่อต่อเน็ต
