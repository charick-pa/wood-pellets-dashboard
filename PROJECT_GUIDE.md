# GREEN RIVER PANELS — WOOD PELLETS MASTER SYSTEM GUIDE
**Project:** Green River Panels — Wood Pellets Operations Dashboard & BPM Master System  
**Workspace:** `d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005`  
**File Role:** Single Source of Truth — เอกสารรวมศูนย์คลังพรอมต์ (Prompts), องค์ความรู้ทางเทคนิค (Skills), และประวัติการพัฒนา (Changelog) ไว้ในไฟล์เดียว  
**Last Updated:** 2026-10-09  

---

## 🧭 หมวดที่ 1: Master System Prompts & AI Directives (คลังชุดคำสั่งสำหรับ AI)

### 1.1 System Role & Core Persona Prompt (บทบาทหลักของ AI)
```markdown
คุณคือ Senior Full-Stack Web Developer & Industrial Operations System Architect 
รับผิดชอบพัฒนาระบบ Green River Panels — Wood Pellets Operations Dashboard & BPM Master System
ซึ่งเป็นเว็บแอปพลิเคชันบริหารจัดการกระบวนการผลิตชีวมวลอัดเม็ด (Wood Pellets) ครบวงจร 7 ขั้นตอน (7-Step Lifecycle)
และการตรวจสอบย้อนกลับแหล่งกำเนิดเนื้อไม้ตามข้อกำหนดสหภาพยุโรป (EUDR Geolocation & Traceability)

กฎเหล็กในการทำงาน:
1. ทำงานแบบ Local / Offline 100% ห้ามเชื่อมต่อ External CDN ภายนอกเด็ดขาด ใช้ Library ในเครื่องเท่านั้น
2. ใช้ Tailwind CSS Utility Classes เป็นหลัก หลีกเลี่ยง Custom CSS ใน <style> เว้นแต่ @page และ print-color-adjust
3. ระบบต้องรองรับ 2 ภาษา (Bilingual TH / EN) โดยใช้ Key ใน language.js และแอตทริบิวต์ data-i18n
4. อ่านไฟล์ PROJECT_GUIDE.md ก่อนเริ่มลงมือทำงานทุกครั้ง
5. บันทึก Changelog และอัปเดตสถานะงานลงใน PROJECT_GUIDE.md ทุกครั้งหลังทำงานเสร็จ
6. ในกระบวนการคิด (Thinking Process) ให้แสดงผลเป็นภาษาไทย 100%
```

### 1.2 BPM 7-Step Lifecycle Prompt (กระบวนการผลิต 7 ขั้นตอน)
```markdown
ระบบต้องควบคุมวงจรการผลิตและจัดส่งเม็ดไม้ชีวมวล 7 ขั้นตอน (7-Step Production Lifecycle):
- Step 1: Sale Department — ข้อมูลคำสั่งซื้อ, ลูกค้า, PO No., สเปกสินค้า, ใบรับรองที่ต้องการ (5%)
- Step 2: RA (Regulatory & Compliance) — ตรวจสอบใบอนุญาตส่งออก, EUDR Verification, Due Diligence Approval (15%)
- Step 3: Woods Planning — แหล่งกำเนิดไม้ยางพารา (Hevea Brasiliensis), พิกัดแปลงสวนไม้, แผนรับวัตถุดิบ (30%)
- Step 4: Pelletizing & In-Line QC — กระบวนการอัดเม็ด, เส้นผ่านศูนย์กลาง (6.0/8.0 mm), ความชื้น (< 8%), Yield และ Downtime (50%)
- Step 5: QA Lab Inspection — ตรวจสอบคุณภาพแล็บ, Net Calorific Value (> 16.5 MJ/kg), Ash Content (< 1.5%), Fines (< 1%), COA (70%)
- Step 6: Warehouse & Packing — บรรจุ Big Bag / Bulk, สต็อกคงคลัง (Opening, Issue, Closing Stock), จองตู้และสายเรือ (85%)
- Step 7: Shipment & Logistics — ตรวจตู้, ชั่งน้ำหนัก, ขนส่งไปยังท่าเรือสงขลา, ออกใบ BL & Certificate (100%)
```

### 1.3 EUDR Geolocation & GIS Map Prompt (แผนที่และพิกัดภูมิศาสตร์)
```markdown
ระบบแผนที่พิกัดรวม GIS Map (Leaflet Native Engine แบบ Local/Offline 100%):
1. จำลองข้อมูลพิกัดภูมิศาสตร์จริงของแปลงไม้ยางพารา โรงงานแปรรูป และท่าเรือส่งออก 48+ จุด ครอบคลุม 14 จังหวัดภาคใต้
2. ผูกหมุดด้วย L.marker([lat, lng]) บนระบบพิกัดจริง เพื่อให้เวลาซูมเข้า/ออก หรือเลื่อนแผนที่ หมุดตรึงแน่นตามพิกัดจริง 100%
3. ระบบ Dispersion Animation: เมื่อเปิดหน้าแผนที่ หมุดทุกจุดจะรวมตัวที่โรงงานหาดใหญ่ แล้วคำนวณ Lerp Easing ลอยแตกตัวกระจายออกไปยังแปลงไม้ทั่วภาคใต้อย่างราบรื่น
4. ปุ่มควบคุมแอนิเมชัน (Replay) และรีเซ็ตมุมมอง: ต้องมี Floating Bar (#mapFloatingQuickControls) ลอยอยู่บนผืนแผนที่ใน #gisMapViewport โดยตรง แสดงผลตลอดเวลาทั้งในโหมดปกติและเต็มจอ
5. โหมดขยายเต็มหน้าจอ (Fullscreen): รองรับทั้ง CSS Fixed Overlay (100vw x 100vh) และ Browser Fullscreen API โดยเรียก invalidateSize() ทันที
6. มีปุ่มสลับแผนที่ถนน (OpenStreetMap) และภาพถ่ายดาวเทียม (ESRI World Imagery) พร้อม Sidebar ค้นหาด่วน
```

### 1.4 High-Precision Print & Zero-about:blank PDF Prompt (การพิมพ์ A4 ไร้ about:blank)
```markdown
การจัดรูปแบบพิมพ์เอกสารทางการและแปลงเป็น PDF ต้องปฏิบัติตามมาตรฐานนี้:
1. ห้ามเรียก window.print() บน Modal Popup โดยตรง เพราะจะติดพื้นหลังสีดำ, แถบหัว Modal, ปุ่ม X, และ Scrollbar
2. ห้ามเปิดหน้าต่างใหม่ด้วย window.open('', '_blank') สำหรับฟอร์ม BPM เพราะ Chromium จะประทับตรา URL "about:blank" ติดบนหัว/ท้ายกระดาษพิมพ์
3. ใช้ระบบ Hidden Iframe Printing Pattern (<iframe id="bpmPrintIframe">) เขียน HTML เข้า iframe แล้วสั่ง print() จาก iframe เพื่อให้หัว/ท้ายกระดาษสะอาดบริสุทธิ์ ไร้คำว่า about:blank 100%
4. จัดหน้ากระดาษทางการ A4 Portrait (@page { size: A4 portrait; margin: 8mm 8mm 8mm 8mm; }) ไร้ขอบตัด ขจัดส่วนลงนาม (Signatures) เมื่อมีข้อกำหนดให้ตัดออก
5. ใน @media print ของหน้าเว็บหลัก ต้องปลดเปลื้องกรอบ Modal ออกกลายเป็นพื้นหลังขาว 100% รองรับกรณีผู้ใช้กด Ctrl+P
```

### 1.5 Quick Reusable Prompts for Future AI Sessions (คำสั่งสำหรับก๊อปปี้ไปสั่งต่อ)
```text
ให้อ่านไฟล์ PROJECT_GUIDE.md ก่อนเริ่มงานทุกครั้ง แล้วดำเนินการต่อตามรายการใน Pending & Roadmap
โดยรักษากฎ Local/Offline 100%, ภาษาไทยใน Thinking Process, และเขียนบันทึกอัปเดตลงใน PROJECT_GUIDE.md ทุกครั้งหลังทำงานเสร็จ
```

---

## 🌲 หมวดที่ 2: Domain Knowledge & Technical Skills (องค์ความรู้และกฎระเบียบเทคนิค)

### 2.1 กฎเหล็กการพัฒนาสถาปัตยกรรม (Core Engineering Rules)
1. **ห้ามใช้ External CDN หรืออินเทอร์เน็ตภายนอก:** ระบบทำงาน Local/Offline 100% ผ่านไลบรารีในโฟลเดอร์เครื่อง (`./tailwind/tailwind_v3.js`, `./fontawesome-free-7.3.1-web/`, `./jquery-3.7.1.min.js`, `./xlsx.full.min.js`, `./leaflet/`)
2. **ใช้ Tailwind CSS Utility Classes เป็นหลัก:** ลด Custom CSS ใน `<style>` เว้นแต่ `@page` และ `print-color-adjust`
3. **ระบบต้องรองรับ 2 ภาษา (Bilingual TH / EN):** ทุกข้อความต้องมี Key ใน `language.js` และใช้ `data-i18n`
4. **ความยินยอมของผู้ใช้ก่อนแก้โค้ด:** หากผู้ใช้ถามเชิงแนวคิด ให้อธิบายตัวเลือกก่อนลงมือแก้โค้ดจริง
5. **ระบบ UI Motion & Transitions:**
   - สลับหน้า (`switchView`) มีคลาส `.page-fade-in` (Fade-in Slide-up) เพื่อความนุ่มนวล
   - การเปิด Modal มีคลาส `.modal-pop-in` (Scale-in Zoom)
   - ตาราง Order Query และตารางจัดส่งต้องมีคอลัมน์แรกสุดคือ **"ลำดับ (No.)"** เสมอทั้งบนจอและในไฟล์ Excel/PDF

### 2.2 ความรู้เฉพาะทางอุตสาหกรรม Wood Pellets & EUDR
- **EUDR (European Union Deforestation Regulation):** สินค้าชีวมวลส่งออกไป EU ต้องระบุพิกัดภูมิศาสตร์ (Latitude & Longitude) ของแปลงที่ดิน (Plot ID) หรือโรงงานแปรรูป เพื่อความโปร่งใสในการตรวจสอบย้อนกลับ (Traceability) และการออกเอกสาร Due Diligence Statement (DDS)
- **มาตรฐานการรับรอง:** SBP (Sustainable Biomass Program), GGL (Green Gold Label), FSC-100%
- **เกณฑ์ควบคุมคุณภาพ:** Moisture < 8%, Net Calorific Value > 16.5 MJ/kg, Ash Content < 1.5%, Fines < 1%

---

## 🛠️ หมวดที่ 3: Execution Changelog & Project History (ประวัติการพัฒนาครบถ้วน)

1. **เพิ่มคอลัมน์ "ลำดับ (No.)" ในตาราง Dashboard:** เพิ่มหัวตารางและหมายเลขแถวแบบไดนามิกตาม Pagination
2. **จัดรูปแบบหน้าพิมพ์ฟอร์ม BPM ขั้นสูง:** กำหนดโครงสร้างเอกสารราชการ A4 Portrait ไร้ Scrollbar
3. **ระบบ Export และพิมพ์แยกตามงวด (Monthly / Yearly Periodic Reports):** กรองปี/เดือน ส่งออก Excel หลาย Sheet และพิมพ์ต่อเนื่อง 100+ แถว
4. **ปรับปรุง KPI Card 1 (ยอดสั่งซื้อรวม):** แสดง Sub-panel ยอดรายเดือนและยอดรายปีแบบ Real-time
5. **แปลงสไตล์ CSS เป็น Tailwind Utility Classes:** คลีนโค้ด `<style>` ให้กะทัดรัด
6. **ระบบแสดงพิกัดภูมิศาสตร์ (EUDR Geolocation & Map Modal):** ปักหมุดพิกัดแปลงไม้ยางพาราจริงในภาคใต้ พร้อมปุ่มเปิด Google Maps
7. **หน้าแผนที่พิกัดรวม Leaflet GIS Map พร้อมแอนิเมชันกระจายหมุด:** ติดตั้ง Leaflet Engine แบบ Local/Offline หมุดตรึงแน่นไม่หลุดตำแหน่งเมื่อซูม และมี Dispersion Animation กระจายตัวจากหาดใหญ่ HQ ไปทั่ว 14 จังหวัดภาคใต้
8. **ระบบขยายแผนที่เต็มหน้าจอ (Leaflet GIS Fullscreen Mode):** รองรับ Fixed Overlay และ Browser Fullscreen API พร้อมคำนวณ `invalidateSize()` ทันที
9. **ยกระดับระบบ Export PDF ในหน้า Order Query (`exportQueryToPDF`):** ส่งออก A4 Landscape คมชัดหลายหน้าต่อเนื่อง
10. **จำลองข้อมูลคำสั่งซื้อขนาดใหญ่และ 48 พิกัดจริงทั่วภาคใต้:** ขยายข้อมูลเป็น 48 Orders พร้อมพิกัดแปลงไม้จริง 12,000+ ไร่
11. **ย้ายปุ่มควบคุมแอนิเมชันและรีเซ็ตมุมมองมาประชิดขอบแผนที่:** วางบน Map Toolbar เหนือ Viewport
12. **แก้ปัญหาฟอร์แมตพิมพ์ BPM Form เป็น PDF ไม่สวย:** ปลดเปลื้อง Backdrop สีดำและกรอบ Modal
13. **จัดทำคลัง Master Prompt Repository:** รวบรวม System Prompts และสเปกวิศวกรรมซอฟต์แวร์
14. **ยกระดับการพิมพ์ PDF ไร้ `about:blank`, Floating Controls, และ Page Animations:**
    - ตัดส่วนลงนาม "บันทึกการตรวจสอบและอนุมัติอย่างเป็นทางการ" ออกจากฟอร์มพิมพ์ BPM
    - กำจัดปัญหา `about:blank` 100% ด้วย **Hidden Iframe Printing Pattern (`#bpmPrintIframe`)**
    - เพิ่มคอลัมน์ **"ลำดับ (No.)"** หน้าสุดในหน้า Order Query & Report และไฟล์ Export ทุกชุด
    - วางปุ่มเล่นแอนิเมชันกระจายหมุดและรีเซ็ตเป็น **Floating Controls บนผืนแผนที่โดยตรง** แสดงผลตลอดเวลาทั้งโหมดปกติและเต็มจอ
    - เพิ่มแอนิเมชัน `.page-fade-in` ในการสลับหน้า และ `.modal-pop-in` ในการเปิด Modal
15. **รวมศูนย์เอกสารเป็น Master Guide ไฟล์เดียว (`PROJECT_GUIDE.md`):**
    - รวม `LOG.md`, `SKILL.md`, และ `PROMPT.md` เข้าด้วยกันเป็น `PROJECT_GUIDE.md` ฉบับเดียวจบ เพื่อความคล่องตัวสูงสุดและลดความซ้ำซ้อน

---

## 📂 หมวดที่ 4: File Architecture & Pending Roadmap (โครงสร้างระบบและแผนงานถัดไป)

### 4.1 แผนผังไฟล์ในโปรเจกต์ (File Architecture)
| ไฟล์ | หน้าที่หลัก |
|---|---|
| `index.html` | โครงร่างหน้าเว็บหลัก (Header, Dashboard View, Order Query View, GIS Map View, Modal BPM, Modal Map) |
| `app.js` | Business Logic: การเปลี่ยนหน้า, ตาราง, การกรอง, Export Excel/PDF, Leaflet GIS Engine & Fullscreen Controller |
| `components.js` | UI Components: KPI Cards, 7-Step Pipeline, Quick Bar, BPM Form, Map Overview, Floating Map Bar & Print Doc |
| `data.js` | ข้อมูลจำลอง 48 รายการ, ฟังก์ชันคำนวณสรุปยอดรายเดือน/รายปี, คลังพิกัด 48 จุดภูมิศาสตร์ภาคใต้ |
| `language.js` | คลังพจนานุกรมรองรับ 2 ภาษา (ไทย และ อังกฤษ) |
| **`PROJECT_GUIDE.md`** | **Master Single Source of Truth — เอกสารรวมศูนย์คลังพรอมต์, สเปกเทคนิค, และประวัติการพัฒนาทั้งหมด** |

### 4.2 แผนงานถัดไป (Pending Roadmap)
1. **การบันทึกหรือนำเข้าพิกัดจริงผ่านฟอร์มภายนอก (Real External GPS Import Integration):** รองรับการรับค่า Lat/Long จากระบบ ERP หรือ API ภายนอกเมื่อเชื่อมต่อระบบจริง
