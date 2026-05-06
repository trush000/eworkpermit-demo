# E-Work Permit — Logic & Pseudocode Flow

เอกสารนี้อธิบายตรรกะการทำงาน (Logic Flow) และเงื่อนไขต่างๆ (Decision Making) ของระบบในรูปแบบ Pseudocode เพื่อให้เห็นภาพรวมการทำงานของฟังก์ชันหลัก

---

## 1. Authentication Flow (ระบบเข้าสู่ระบบ)

```text
FUNCTION Login(email, password):
  IF email OR password is empty THEN:
    SHOW error "กรุณากรอกข้อมูลให้ครบ"
    RETURN

  users = FETCH all users from DB
  matchUser = FIND user WHERE user.email == email AND user.password == password

  IF matchUser FOUND THEN:
    IF matchUser.status is INACTIVE THEN:
      SHOW error "บัญชีนี้ถูกระงับการใช้งาน"
      RETURN
    
    SET session = matchUser (exclude password)
    UPDATE user.last_login_at = NOW()
    REDIRECT to "dashboard.html"
  ELSE:
    SHOW error "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
END FUNCTION

FUNCTION RequireAuth():
  user = GET session
  IF user NOT FOUND THEN:
    REDIRECT to "index.html"
  ELSE:
    RETURN user
END FUNCTION
```

---

## 2. Work Permit Wizard Flow (กระบวนการสร้างใบงาน)

```text
FUNCTION NextStep(currentStep):
  // STEP 1 Validation
  IF currentStep == 1 THEN:
    IF company NOT selected OR area is empty THEN:
      SHOW toast "กรุณากรอกข้อมูลหลัก"
      RETURN
    GOTO STEP 2

  // STEP 2 Validation (มาตรการ)
  ELSE IF currentStep == 2 THEN:
    IF no work_type selected AND no subtypes selected THEN:
      SHOW toast "กรุณาระบุประเภทงานและลักษณะงาน"
      RETURN
    GOTO STEP 3

  // STEP 3 Validation (ทีมงาน)
  ELSE IF currentStep == 3 THEN:
    IF selectedWorkers count == 0 THEN:
      SHOW toast "กรุณาระบุรายชื่อคนงานอย่างน้อย 1 คน"
      RETURN
    GOTO STEP 4

  // STEP 4 Finalize
  ELSE IF currentStep == 4 THEN:
    IF signature is empty THEN:
      SHOW toast "กรุณาลงลายเซ็นผู้ขออนุญาต"
      RETURN
    CALL SubmitPermit()
END FUNCTION

FUNCTION SubmitPermit():
  data = COLLECT all form data (Steps 1-4)
  SET permit.status = "PENDING_OWNER" // เริ่มต้นที่รอเจ้าของงานอนุมัติ
  SET permit.created_at = NOW()
  
  INSERT permit INTO DB
  CREATE notification FOR work_owner
  SHOW success "สร้างใบงานสำเร็จและส่งขออนุมัติแล้ว"
  REDIRECT to "index.html"
END FUNCTION
```

---

## 3. Contractor Smart Lookup (ระบบค้นหาคนงานอัตโนมัติ)

```text
FUNCTION LookupWorker(nationalId):
  IF nationalId length < 13 THEN RETURN
  
  normalizedId = REMOVE dashes from nationalId
  allContractors = FETCH all contractors from DB
  match = FIND contractor WHERE contractor.national_id == normalizedId
  
  IF match FOUND THEN:
    SET form.fname = match.first_name
    SET form.lname = match.last_name
    LOCK form.fname, form.lname (ReadOnly)
    SHOW message "✅ พบข้อมูลในระบบ"
    SET foundState = TRUE
  ELSE:
    UNLOCK form.fname, form.lname
    SHOW message "ℹ️ ไม่พบข้อมูล (กรุณากรอกใหม่)"
    SET foundState = FALSE
END FUNCTION

FUNCTION AddWorkerToPermit():
  IF foundState == TRUE THEN:
    // ใช้ข้อมูลที่มีอยู่แล้ว
    worker = match
    IF newCerts uploaded THEN:
      APPEND newCerts TO worker.certs
  ELSE:
    // สร้างข้อมูลคนงานใหม่ (Temporary for this permit)
    worker = CREATE new object {fname, lname, nationalId, certs}
    
  ADD worker TO selectedWorkers list
  REFRESH UI list
  CLOSE modal
END FUNCTION
```

---

## 4. Approval Logic (ตรรกะการอนุมัติ)

```text
FUNCTION ApprovePermit(permitId, userRole):
  permit = GET permit BY permitId
  
  SWITCH userRole:
    CASE "WORK_OWNER":
      IF permit.status == "PENDING_OWNER" THEN:
        SET permit.status = "PENDING_AREA"
        LOG action "Approved by Owner"
      
    CASE "AREA_OWNER":
      IF permit.status == "PENDING_AREA" THEN:
        SET permit.status = "PENDING_SAFETY"
        LOG action "Approved by Area"
        
    CASE "SAFETY":
      IF permit.status == "PENDING_SAFETY" THEN:
        SET permit.status = "PENDING_HR"
        LOG action "Approved by Safety"
        
    CASE "HR_MGR":
      IF permit.status == "PENDING_HR" THEN:
        SET permit.status = "APPROVED"
        LOG action "Fully Approved"
        GENERATE permit_qr_code()
  
  UPDATE permit IN DB
  CREATE notification FOR next_approver OR requester
END FUNCTION

FUNCTION RejectPermit(permitId, reason):
  SET permit.status = "REJECTED"
  SET permit.reject_reason = reason
  UPDATE permit IN DB
  CREATE notification FOR requester
END FUNCTION
```

---

## 5. Theme & UI Logic (ระบบเปลี่ยนธีม)

```text
FUNCTION InitTheme():
  savedTheme = GET from localStorage("ewp_theme")
  IF savedTheme == "light" THEN:
    ADD class "light-theme" TO body
  ELSE:
    REMOVE class "light-theme" FROM body (Default Dark)
END FUNCTION

FUNCTION ToggleTheme():
  IF body HAS class "light-theme" THEN:
    REMOVE class "light-theme"
    SAVE "dark" TO localStorage
  ELSE:
    ADD class "light-theme"
    SAVE "light" TO localStorage
END FUNCTION
```
