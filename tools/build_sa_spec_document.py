# -*- coding: utf-8 -*-
r"""
Generate Complete Wood Pellets SA Specification Document (.docx)
Adding ALL Missing Parts:
- Section 3.3 D-Table-Schema (All 8 Detailed Sub-Tables)
- Section 4.3 Customer Complaints on Dashboard Specification (per Remark 4.2)
- Section 4.4 Dashboard Field Display Mapping Matrix (per Remark 4.2)
- Complete UI BPM (Steps 1 to 8)
- Complete M-Table & S-Table Schemas
- Complete Approval Process Diagram & Explanations

Target outputs:
1. D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\WoodPellets_SA_Document_Spec_20261026.docx
2. d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005\docs\WoodPellets_SA_Document_Spec_20261026.docx
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_sa_document():
    doc = docx.Document()

    # Set page margins to standard A4 (0.55 in)
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(0.55)
        s.bottom_margin = Inches(0.55)
        s.left_margin = Inches(0.55)
        s.right_margin = Inches(0.55)

    COLOR_YELLOW = "FFFECC"  # Header and label background
    COLOR_GREEN  = "CFFFCE"  # Status / input highlight
    COLOR_WHITE  = "FFFFFF"  # Cell background
    COLOR_BORDER = "000000"  # Single black border
    COLOR_SEC_BG = "FEF08A"  # Section divider
    COLOR_D_BG   = "E0E7FF"  # Indigo tinted header for D-Table
    COLOR_COMP_BG= "FFE4E6"  # Rose tinted header for Complaint table

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=50, bottom=50, left=70, right=70):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def set_table_borders(table, color="000000", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            </w:tblBorders>
        ''')
        tblPr.append(borders)

    def add_cell_content(cell, text, bold=False, color_rgb=(0,0,0), font_size=8.5, align=WD_ALIGN_PARAGRAPH.LEFT, is_star_red=True):
        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.12

        if is_star_red and "*" in text:
            parts = text.split("*")
            for i, part in enumerate(parts):
                if part:
                    r = p.add_run(part)
                    r.bold = bold
                    r.font.name = "Times New Roman"
                    r.font.size = Pt(font_size)
                    r.font.color.rgb = RGBColor(*color_rgb)
                if i < len(parts) - 1:
                    r_star = p.add_run("*")
                    r_star.bold = bold
                    r_star.font.name = "Times New Roman"
                    r_star.font.size = Pt(font_size)
                    r_star.font.color.rgb = RGBColor(220, 38, 38)
        else:
            r = p.add_run(text)
            r.bold = bold
            r.font.name = "Times New Roman"
            r.font.size = Pt(font_size)
            r.font.color.rgb = RGBColor(*color_rgb)

        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # 4-column standard widths for BPM forms
    w4 = [Inches(1.65), Inches(1.95), Inches(1.65), Inches(1.92)]

    # -----------------------------------------------------------------
    # DOCUMENT COVER & REVISION HISTORY
    # -----------------------------------------------------------------
    p_comp = doc.add_paragraph()
    r_c = p_comp.add_run("Greenriverholding.com\nWood Pellets Form\nSpec Document (System Architecture Specification)")
    r_c.bold = True
    r_c.font.name = "Times New Roman"
    r_c.font.size = Pt(12)
    p_comp.paragraph_format.space_after = Pt(2)

    p_docmod = doc.add_paragraph()
    r_dm = p_docmod.add_run("Document version and modification remarks.")
    r_dm.font.name = "Times New Roman"
    r_dm.font.size = Pt(9.5)
    p_docmod.paragraph_format.space_after = Pt(2)

    tbl_ver = doc.add_table(rows=5, cols=4)
    set_table_borders(tbl_ver, COLOR_BORDER)
    tbl_ver.alignment = WD_TABLE_ALIGNMENT.CENTER
    ver_w = [Inches(0.8), Inches(1.2), Inches(1.6), Inches(3.57)]
    for r in tbl_ver.rows:
        for idx, w in enumerate(ver_w): r.cells[idx].width = w

    v_data = [
        ["Ver.", "Date", "Author", "Modified remark"],
        ["0.1", "2026/09/28", "Pa", "Initial Draft"],
        ["0.2", "2026/10/22", "Pa & System Architect", "Full Lifecycle & Data Ownership Matrix"],
        ["0.3", "2026/10/22", "Pa & System Architect", "M-Table Schema (Steps 1-8 following Justification) & Brand New Flowchart"],
        ["1.0", "2026/10/26", "Pa & Antigravity (AI)", "Complete 8-Step Lifecycle, Added Section 3.3 D-Table-Schema (8 Detailed Sub-Tables), Customer Complaints Dashboard Schema & Dashboard Display Mapping"]
    ]
    for r_idx, row in enumerate(tbl_ver.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 45, 45, 65, 65)
            set_cell_background(cell, COLOR_YELLOW if r_idx == 0 else COLOR_WHITE)
            add_cell_content(cell, v_data[r_idx][c_idx], bold=(r_idx==0), align=WD_ALIGN_PARAGRAPH.LEFT if c_idx==3 else WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -----------------------------------------------------------------
    # TABLE OF CONTENTS
    # -----------------------------------------------------------------
    p_toc_title = doc.add_paragraph()
    r = p_toc_title.add_run("Wood Pellets Content\nContents")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_toc_title.paragraph_format.space_after = Pt(2)

    toc_items = [
        "1. UI BPM",
        "  1.1 Sale Department - Step",
        "  1.2 RA — Regulatory / Requirement - Step",
        "  1.3 Production — Woods material planning - Step",
        "  1.4 QC - Inspection results (Responsible party: In-line Quality Control) - Step",
        "  1.5 QA — Inspection Results (Responsible Department: Quality Assurance and Laboratory / QA Lab)",
        "  1.6 Storage — Warehouse (Responsible department: Warehouse and Packing Department)",
        "  1.7 RA — Gather information (Responsible department: Regulatory and Certification Dept. / RA Dept.) and send to Sales",
        "  1.8 Shipment — Shipping (Responsible department: Logistics & Shipping)",
        "2. Content/Approve page",
        "  2.1 Document No",
        "3. Fill form fields",
        "  3.1 M-Table-Schema (Master Form Fields)",
        "  3.2 S-Table-Schema (Step Level Fields)",
        "  3.3 D-Table-Schema (Detail & Transaction Tables: 8 Sub-Tables) [NEW - ADDED]",
        "4. Approval Process",
        "  4.1 Process Diagram (8-Step Full Lifecycle Workflow)",
        "  4.2 Explanation of approval steps",
        "  4.3 Customer Complaints Management on Dashboard (Post-Delivery Claims) [NEW - ADDED]",
        "  4.4 Dashboard Information Display Matrix (Dashboard Integration Specification) [NEW - ADDED]"
    ]
    p_toc = doc.add_paragraph()
    for item in toc_items:
        r = p_toc.add_run(item + "\n")
        r.font.name = "Times New Roman"; r.font.size = Pt(9.0)
    p_toc.paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # SECTION 1: UI BPM
    # -----------------------------------------------------------------
    p_s1_hdr = doc.add_paragraph()
    r = p_s1_hdr.add_run("1. UI BPM\nHeader Form (Application & Company Info)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s1_hdr.paragraph_format.space_after = Pt(2)

    tbl_head = doc.add_table(rows=5, cols=4)
    set_table_borders(tbl_head, COLOR_BORDER)
    tbl_head.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_head.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_b = tbl_head.cell(0, 0)
    for i in range(1, 4): c_b.merge(tbl_head.cell(0, i))
    set_cell_background(c_b, COLOR_YELLOW)
    set_cell_margins(c_b, 65, 65, 85, 85)
    add_cell_content(c_b, "Green River Panels (Thailand) Co., Ltd   Wood pellets Form", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    h_rows = [
        [("Application No.", COLOR_YELLOW, True), ("Identify after submit", COLOR_WHITE, False), ("Application Date.", COLOR_YELLOW, True), ("Default today", COLOR_GREEN, False)],
        [("Applicant", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False), ("Applicant Department", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False)],
        [("Requestor", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False), ("Requestor Department", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False)],
        [("Company", COLOR_YELLOW, True), ("XXX▼", COLOR_WHITE, False), ("", COLOR_WHITE, False), ("", COLOR_WHITE, False)]
    ]
    c_comp = tbl_head.cell(4, 1)
    c_comp.merge(tbl_head.cell(4, 2)); c_comp.merge(tbl_head.cell(4, 3))

    for r_idx, r_data in enumerate(h_rows, start=1):
        for c_idx in range(4):
            if r_idx == 4 and c_idx > 1: continue
            cell = tbl_head.cell(r_idx, c_idx)
            set_cell_margins(cell, 45, 45, 65, 65)
            txt, bg, is_b = r_data[c_idx]
            set_cell_background(cell, bg)
            add_cell_content(cell, txt, bold=is_b)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.1 Sale Department - Step
    p_s1 = doc.add_paragraph()
    r = p_s1.add_run("1.1 Sale Department - Step")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s1.paragraph_format.space_after = Pt(2)

    tbl_s1 = doc.add_table(rows=20, cols=4)
    set_table_borders(tbl_s1, COLOR_BORDER)
    tbl_s1.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s1.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s0 = tbl_s1.cell(0, 0)
    for i in range(1, 4): c_s0.merge(tbl_s1.cell(0, i))
    set_cell_background(c_s0, COLOR_YELLOW)
    add_cell_content(c_s0, "Sale Department", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s1_rows = [
        [("Customer Code *", COLOR_YELLOW), ("02545", COLOR_WHITE), ("Customer Name *", COLOR_YELLOW), ("Acme Global Trading Co., Ltd.", COLOR_WHITE)],
        [("Requested Delivery Date", COLOR_YELLOW), ("2026/12/15", COLOR_WHITE), ("Order No. *", COLOR_YELLOW), ("ORD-2026-04159", COLOR_WHITE)],
        [("From country*", COLOR_YELLOW), ("US", COLOR_WHITE), ("Address", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE)],
        [("Contact Person:", COLOR_YELLOW), ("Thomason", COLOR_WHITE), ("Email /Telephone:", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE)],
        [("PO No", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE), ("PI NO. *", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE)],
        [("Product Code *", COLOR_YELLOW), ("WP-001", COLOR_WHITE), ("Product Name*", COLOR_YELLOW), ("Wood Pellets", COLOR_WHITE)],
        [("Product Type", COLOR_YELLOW), ("1.  0.6mm± 1 mm, 2.  0.8mm ± 1 mm", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Ship-to Location*", COLOR_YELLOW), ("Port of Japan", COLOR_WHITE), ("Quantity*", COLOR_YELLOW), ("5000 MT", COLOR_WHITE)],
        [("Certificate Requirement", COLOR_YELLOW), ("[ ■ ] SBP    [ ■ ] GGL", COLOR_WHITE), ("Other Certificate", COLOR_YELLOW), ("FSC-100%, ENplus", COLOR_WHITE)],
        [("Customer Requirement:", COLOR_YELLOW), ("ตัวอย่าง (Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Special Requirement:", COLOR_YELLOW), ("ตัวอย่าง (ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection, etc.)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Planning", COLOR_YELLOW), ("", COLOR_YELLOW), ("", COLOR_YELLOW), ("", COLOR_YELLOW)],
        [("PI NO.*", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE), ("MO No.*", COLOR_YELLOW), ("MP202600XX", COLOR_WHITE)],
        [("Plan Date Star-Finished*", COLOR_YELLOW), ("2026/09/28 - 2026/09/30", COLOR_WHITE), ("Production Batch*", COLOR_YELLOW), ("SBP-xx-YY-02-3003", COLOR_WHITE)],
        [("Production Description*", COLOR_YELLOW), ("Rubber wood pellets", COLOR_WHITE), ("Certificate Scheme:*", COLOR_YELLOW), ("[ ■ ] SBP    [ ■ ] GGL", COLOR_WHITE)],
        [("Product Code*", COLOR_YELLOW), ("Bwp.12-08", COLOR_WHITE), ("Volume*", COLOR_YELLOW), ("5,000 MT", COLOR_WHITE)],
        [("Customer Complaint Logging (Post-Delivery via Dashboard)*", COLOR_COMP_BG), ("Sale บันทึกข้อร้องเรียนหลังรับสินค้าผ่าน Dashboard: หมวดปัญหา, ความรุนแรง, รายละเอียด, ผู้บันทึก (Updated By) และวันเวลา (Timestamp) บันทึกอัตโนมัติ", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s1_rows, start=1):
        # Spanning merges
        if r_idx in [7, 10, 11, 12, 17]: # Spans 3 columns
            cell = tbl_s1.cell(r_idx, 1)
            cell.merge(tbl_s1.cell(r_idx, 2)); cell.merge(tbl_s1.cell(r_idx, 3))
            if r_idx == 12: # Planning Header
                c_pl = tbl_s1.cell(r_idx, 0); c_pl.merge(tbl_s1.cell(r_idx, 1))
                set_cell_background(c_pl, COLOR_YELLOW)
                add_cell_content(c_pl, "Planning", bold=True, font_size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
                continue

            lbl_cell = tbl_s1.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s1.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s1.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.2 RA — Regulatory / Requirement - Step
    p_s2 = doc.add_paragraph()
    r = p_s2.add_run("1.2 RA — Regulatory / Requirement - Step")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s2.paragraph_format.space_after = Pt(2)

    tbl_s2 = doc.add_table(rows=10, cols=4)
    set_table_borders(tbl_s2, COLOR_BORDER)
    tbl_s2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s2.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s2_0 = tbl_s2.cell(0, 0)
    for i in range(1, 4): c_s2_0.merge(tbl_s2.cell(0, i))
    set_cell_background(c_s2_0, COLOR_YELLOW)
    add_cell_content(c_s2_0, "RA — Regulatory / Requirement", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s2_rows = [
        [("Regulatory Certificate Status *", COLOR_YELLOW), ("APPROVED & VALID (Valid through 2028-12-31)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Certificate Status*", COLOR_YELLOW), ("APPROVED & VALID (Valid through 2028-12-31)", COLOR_WHITE), ("License / Permit  expired *", COLOR_YELLOW), ("2027-09-30 (Active until late next year)", COLOR_WHITE)],
        [("Specification Requirement*", COLOR_YELLOW), ("EN 10204 3.1 Material Certification, ASME B16.34 Pressure Class 2500, and 100% Non-Destructive Hydrostatic Testing at 525 bar for 15 minutes.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Label Requirement *", COLOR_YELLOW), ("QR-Code Barcode Label (100x150 mm) containing PO No., Serial Range, Batch No., ISO Compliance Mark, and Direct CoA URL Download link.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Packaging Requirement *", COLOR_YELLOW), ("VCI Anti-Corrosion Vacuum Sealed Polybags, individual shock-proof foam casing, packed in heavy-duty ISPM-15 heat-treated Wooden Crates (max 50 units/crate) with ShockWatch & TiltWatch indicator stickers.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Customer Regulatory Requirement *", COLOR_YELLOW), ("RoHS 3 (EU 2015/863) & REACH Compliance, Pressure Equipment Directive (PED 2014/68/EU) Category III Module H, and Thai Industrial Standards (TISI / มอก.) Certification for high-pressure fluid power equipment.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Transportation Expiry Date*", COLOR_YELLOW), ("2027-03-31 (Active transport permit; renewal required 30 days prior to expiration)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Information Supplier *", COLOR_YELLOW), ("As Attachment (Attachment is required)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("EUDR Due Diligence & Multi-Plot Geolocation *", COLOR_GREEN), ("EUDR Verified: Centroid Geolocation [7.0089, 100.4767] พร้อมผูกพิกัดรูปแปลงที่ดิน KML/GeoJSON (Polygon Coordinates) สำหรับออกเอกสาร TracesNT", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s2_rows, start=1):
        if r_idx in [1, 3, 4, 5, 6, 7, 8, 9]:
            cell = tbl_s2.cell(r_idx, 1)
            cell.merge(tbl_s2.cell(r_idx, 2)); cell.merge(tbl_s2.cell(r_idx, 3))
            lbl_cell = tbl_s2.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s2.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s2.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.3 Production — Woods material planning - Step
    p_s3 = doc.add_paragraph()
    r = p_s3.add_run("1.3 Production — Woods material planning - Step")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s3.paragraph_format.space_after = Pt(2)

    tbl_s3 = doc.add_table(rows=11, cols=4)
    set_table_borders(tbl_s3, COLOR_BORDER)
    tbl_s3.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s3.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s3_0 = tbl_s3.cell(0, 0)
    for i in range(1, 4): c_s3_0.merge(tbl_s3.cell(0, i))
    set_cell_background(c_s3_0, COLOR_YELLOW)
    add_cell_content(c_s3_0, "Production — Woods material planning & Factory Execution", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s3_rows = [
        [("Planned Quantity *", COLOR_YELLOW), ("20,000 Ton", COLOR_WHITE), ("Actual Quantity *", COLOR_YELLOW), ("15,000 Ton", COLOR_WHITE)],
        [("Yield *", COLOR_YELLOW), ("90000 Ton", COLOR_WHITE), ("Total Uptime *", COLOR_YELLOW), ("5760 mins.", COLOR_WHITE)],
        [("Total Downtime *", COLOR_YELLOW), ("40 mins.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Production Start Date Time *", COLOR_YELLOW), ("2026/09/28 Time:  02:00", COLOR_WHITE), ("Production Finish Date time *", COLOR_YELLOW), ("2026/09/30 Time: 07:00", COLOR_WHITE)],
        [("Material Code *", COLOR_YELLOW), ("BWP-11-08 / BWP-12-08", COLOR_WHITE), ("Plant Supervisor*", COLOR_YELLOW), ("Operations Lead", COLOR_WHITE)],
        [("Raw Material Requirement *", COLOR_YELLOW), ("Log amount: XX Ton.   |   Slab amount: XX Ton.   |   Sawdust amount: XX Ton.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Production Issue *", COLOR_YELLOW), ("It couldn’t be pressed into solid bar because raw materials were too dry.", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Factory 1 Status & Utilities*", COLOR_YELLOW), ("Downtime: 40 mins | Cause of Downtime: Raw material dry\nFuels: xxx litters | Electricity: xxx units xxxx", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Factory 2 Status & Utilities*", COLOR_YELLOW), ("Downtime: 0 mins | Cause of downtime: None\nFuels: xxx litters | Electricity: xxx units", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Machine Feed Lines*", COLOR_YELLOW), ("[ ■ ] Hammer mill      [ ■ ] Flaker 3      [ ■ ] Flaker 4", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s3_rows, start=1):
        if r_idx in [3, 6, 7, 8, 9, 10]:
            cell = tbl_s3.cell(r_idx, 1)
            cell.merge(tbl_s3.cell(r_idx, 2)); cell.merge(tbl_s3.cell(r_idx, 3))
            lbl_cell = tbl_s3.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s3.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s3.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.4 QC — In-line Quality Control
    p_s4 = doc.add_paragraph()
    r = p_s4.add_run("1.4. QC - Inspection results (Responsible party: In-line Quality Control) - Step")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s4.paragraph_format.space_after = Pt(2)

    tbl_s4 = doc.add_table(rows=8, cols=4)
    set_table_borders(tbl_s4, COLOR_BORDER)
    tbl_s4.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s4.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s4_0 = tbl_s4.cell(0, 0)
    for i in range(1, 4): c_s4_0.merge(tbl_s4.cell(0, i))
    set_cell_background(c_s4_0, COLOR_YELLOW)
    add_cell_content(c_s4_0, "QC — ผลการตรวจสอบกระบวนการผลิตหน้างาน (In-Line Quality Check 5 จุด)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s4_rows = [
        [("Batch No. *", COLOR_YELLOW), ("1-4", COLOR_WHITE), ("Test Date *", COLOR_YELLOW), ("2026/10/10", COLOR_WHITE)],
        [("Parameter Raw material Logs & Slab*", COLOR_YELLOW), ("Cleanliness (%): Refer wood spec | Moisture content (≤ 70%): 60%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Parameter Raw material Sawdust*", COLOR_YELLOW), ("Moisture content (≤ 60%): 64%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Parameter Chipper*", COLOR_YELLOW), ("Moisture content (≤ 60%): 64%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Parameter After dryer*", COLOR_YELLOW), ("Moisture content (≤12 - 14 %): 14%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Parameter After Magnetic separator*", COLOR_YELLOW), ("Diameter and length: Verified    Moisture content (≤12 - 14 %): 14%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("QC In-Line Inspector / Status*", COLOR_GREEN), ("สถานะการตรวจสอบ: ผ่านเกณฑ์มาตรฐาน ISO 9001:2015 ครบ 5 จุดตรวจ (Zero Deviation)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s4_rows, start=1):
        if r_idx in [2, 3, 4, 5, 6, 7]:
            cell = tbl_s4.cell(r_idx, 1)
            cell.merge(tbl_s4.cell(r_idx, 2)); cell.merge(tbl_s4.cell(r_idx, 3))
            lbl_cell = tbl_s4.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s4.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s4.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.5 QA — Inspection Results
    p_s5 = doc.add_paragraph()
    r = p_s5.add_run("1.5 QA —Inspection Results (Responsible Department: Quality Assurance and Laboratory / QA Lab)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s5.paragraph_format.space_after = Pt(2)

    tbl_s5 = doc.add_table(rows=10, cols=4)
    set_table_borders(tbl_s5, COLOR_BORDER)
    tbl_s5.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s5.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s5_0 = tbl_s5.cell(0, 0)
    for i in range(1, 4): c_s5_0.merge(tbl_s5.cell(0, i))
    set_cell_background(c_s5_0, COLOR_YELLOW)
    add_cell_content(c_s5_0, "QA — ผลการตรวจสอบห้องแล็บและออกใบรับรอง (Final QA Lab & COA)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s5_rows = [
        [("Test Date *", COLOR_YELLOW), ("2026/10/10", COLOR_WHITE), ("Parameter Raw material: Sawdust*", COLOR_YELLOW), ("Moisture xxx%: 47%", COLOR_WHITE)],
        [("Parameter Chipper*", COLOR_YELLOW), ("Chips length (30±10): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Parameter Hammer meal (Sieves) *", COLOR_YELLOW), ("Length (25±15): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Wood pellets After Magnetic separator*", COLOR_YELLOW), ("Diameter (8±1 mm): 8 mm | Length (25±15mm): 26 mm | Moisture content (<10%): 7 %\nBulk density (>600kg/m3): 600 kg/m3 | Fines below (> 1.0%): 1.0 %\nAsh content (<2%): 1.5% | Mechanical durability (> 97.5%): 97.5%", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Non-compliance*", COLOR_YELLOW), ("GGL, SBP (None - Fully Compliant)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Bulk storage warehouses*", COLOR_YELLOW), ("Moisture content (20±10%): 27 % | Bulk density (>600kg/m3): 650 | Fines below (> 1.0): 1.0 %", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("COA & Referenced Report*", COLOR_YELLOW), ("COA: Customer’s requirements | Referenced TPC test report: xxxxxxx", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("QA Analyst*", COLOR_YELLOW), ("Somchai P. / Lead QC Inspector", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("COA Digital Link / QR *", COLOR_GREEN), ("COA Generated: COA-202610-LF2-03918.pdf (Available via secure DMS download)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s5_rows, start=1):
        if r_idx in [2, 3, 4, 5, 6, 7, 8, 9]:
            cell = tbl_s5.cell(r_idx, 1)
            cell.merge(tbl_s5.cell(r_idx, 2)); cell.merge(tbl_s5.cell(r_idx, 3))
            lbl_cell = tbl_s5.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s5.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s5.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.6 Storage — Warehouse
    p_s6 = doc.add_paragraph()
    r = p_s6.add_run("1.6 Storage — Warehouse (Responsible department: Warehouse and Packing Department)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s6.paragraph_format.space_after = Pt(2)

    tbl_s6 = doc.add_table(rows=8, cols=4)
    set_table_borders(tbl_s6, COLOR_BORDER)
    tbl_s6.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s6.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s6_0 = tbl_s6.cell(0, 0)
    for i in range(1, 4): c_s6_0.merge(tbl_s6.cell(0, i))
    set_cell_background(c_s6_0, COLOR_YELLOW)
    add_cell_content(c_s6_0, "Storage — คลังสินค้าและการบรรจุ (Packing & Warehouse Inventory)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s6_rows = [
        [("Packing Daily Report", COLOR_YELLOW), ("xxxxxxx", COLOR_WHITE), ("Packing Date Start- Date Finish", COLOR_YELLOW), ("2026-10-20 – 2026-12-30", COLOR_WHITE)],
        [("Packing Mtd Qties", COLOR_YELLOW), ("xxxxxxx", COLOR_WHITE), ("Big Bag label No.", COLOR_YELLOW), ("factory 1 : xxxxxxxxxxxx\nfactory 2 : xxxxxxxxxxxx", COLOR_WHITE)],
        [("Selection Date from-to", COLOR_YELLOW), ("2026-10-20 – 2026-12-30", COLOR_WHITE), ("Material", COLOR_YELLOW), ("BWP-11-08 / BWP-12-08", COLOR_WHITE)],
        [("Storage Location", COLOR_YELLOW), ("wearhouse1", COLOR_WHITE), ("Opening Stock", COLOR_YELLOW), ("1000 Ton (ยอดยกมา)", COLOR_WHITE)],
        [("Total receipt Qties", COLOR_YELLOW), ("500 Ton (จำนวนที่รับเข้า)", COLOR_WHITE), ("Total issue Qties", COLOR_YELLOW), ("300 Ton (จำนวนที่จ่ายออก)", COLOR_WHITE)],
        [("Closing stock", COLOR_YELLOW), ("1200 Ton (สินค้าคงเหลือยกไป)", COLOR_WHITE), ("Inventory Controller", COLOR_YELLOW), ("Warehouse Manager", COLOR_WHITE)],
        [("Stock Balance Status*", COLOR_GREEN), ("สมดุลยอดสต็อก: ยกมา 1,000 + รับ 500 - จ่าย 300 = คงเหลือ 1,200 Ton (ความถูกต้อง 100%)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s6_rows, start=1):
        if r_idx == 7:
            cell = tbl_s6.cell(r_idx, 1)
            cell.merge(tbl_s6.cell(r_idx, 2)); cell.merge(tbl_s6.cell(r_idx, 3))
            lbl_cell = tbl_s6.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s6.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s6.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.7 RA — Gather information
    p_s7 = doc.add_paragraph()
    r = p_s7.add_run("1.7 RA — Gather information (Responsible department: Regulatory and Certification Dept. / RA Dept.) and send to Sales.")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s7.paragraph_format.space_after = Pt(2)

    tbl_s7 = doc.add_table(rows=4, cols=2)
    set_table_borders(tbl_s7, COLOR_BORDER)
    tbl_s7.alignment = WD_TABLE_ALIGNMENT.CENTER
    s7_w = [Inches(2.0), Inches(5.17)]
    for r in tbl_s7.rows:
        for idx, w in enumerate(s7_w): r.cells[idx].width = w

    c_s7_0 = tbl_s7.cell(0, 0); c_s7_0.merge(tbl_s7.cell(0, 1))
    set_cell_background(c_s7_0, COLOR_YELLOW)
    add_cell_content(c_s7_0, "RA — รวบรวมข้อมูล (ส่งให้ Sales เมื่อมีการร้องขอ)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s7_rows = [
        ("1.GGL (PDF) *", "GGL FIT/FIP:\n[ ■ ] Cover letter      [ ■ ] Transaction Statement      [ ■ ] Transaction Certificate from CU\n[ ■ ] Transport Documents from Shipping      [ ■ ] Certificate of Cleanliness from Shipping\n[ ■ ] GeoJSON      [ ■ ] Non Compliance Document : GGL, SBP"),
        ("GGL SDE++ *", "[ ■ ] Cover Letter      [ ■ ] Transaction Statement      [ ■ ] Transaction Certificate\n[ ■ ] Transport Documents      [ ■ ] Certificate of Cleanliness      [ ■ ] EUDR Data Sheet\n[ ■ ] GeoJSON (Refer Email รอเมื่อขนส่งเสร็จ)"),
        ("SBP / EUDR *", "[ ■ ] Refer 1. (PDF)      [ ■ ] EUDR Data Sheet      [ ■ ] GeoJSON (Refer Email รอเมื่อขนส่งเสร็จ)")
    ]

    for r_idx, (lbl, val) in enumerate(s7_rows, start=1):
        c_lbl = tbl_s7.cell(r_idx, 0); c_val = tbl_s7.cell(r_idx, 1)
        set_cell_background(c_lbl, COLOR_YELLOW); add_cell_content(c_lbl, lbl, bold=True)
        set_cell_background(c_val, COLOR_WHITE); add_cell_content(c_val, val)

    for r in tbl_s7.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 1.8 Shipment — Shipping
    p_s8 = doc.add_paragraph()
    r = p_s8.add_run("1.8 Shipment — Shipping (Responsible department: Logistics & Shipping)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s8.paragraph_format.space_after = Pt(2)

    tbl_s8 = doc.add_table(rows=8, cols=4)
    set_table_borders(tbl_s8, COLOR_BORDER)
    tbl_s8.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s8.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s8_0 = tbl_s8.cell(0, 0)
    for i in range(1, 4): c_s8_0.merge(tbl_s8.cell(0, i))
    set_cell_background(c_s8_0, COLOR_YELLOW)
    add_cell_content(c_s8_0, "9. Shipment — การจัดส่ง ข้อมูลระวางเรือ และตารางเดินเรือ", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    s8_rows = [
        [("SA number*", COLOR_YELLOW), ("SA-202610-03918-ISO", COLOR_WHITE), ("Customer name *", COLOR_YELLOW), ("Bnbm company (ABC Biomass)", COLOR_WHITE)],
        [("POD *", COLOR_YELLOW), ("ANTWERP (or Port of Japan)", COLOR_WHITE), ("Shipping line *", COLOR_YELLOW), ("EVG", COLOR_WHITE)],
        [("Booking no *", COLOR_YELLOW), ("09050012456", COLOR_WHITE), ("Transit time *", COLOR_YELLOW), ("30 days", COLOR_WHITE)],
        [("Loading date", COLOR_YELLOW), ("30/9/26", COLOR_WHITE), ("Finished date*", COLOR_YELLOW), ("07/9/26", COLOR_WHITE)],
        [("ETD *", COLOR_YELLOW), ("10/10/26", COLOR_WHITE), ("ETA *", COLOR_YELLOW), ("10/11/26", COLOR_WHITE)],
        [("ATD *", COLOR_YELLOW), ("11/10/26", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Tracking & Dispatch Status*", COLOR_GREEN), ("สถานะการขนส่ง: จัดส่งแล้วเสร็จ สมบูรณ์ (Completed & Tracked)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for r_idx, r_data in enumerate(s8_rows, start=1):
        if r_idx in [6, 7]:
            cell = tbl_s8.cell(r_idx, 1)
            cell.merge(tbl_s8.cell(r_idx, 2)); cell.merge(tbl_s8.cell(r_idx, 3))
            lbl_cell = tbl_s8.cell(r_idx, 0)
            set_cell_background(lbl_cell, r_data[0][1]); add_cell_content(lbl_cell, r_data[0][0], bold=True)
            set_cell_background(cell, r_data[1][1]); add_cell_content(cell, r_data[1][0], bold=False)
        else:
            for c_idx in range(4):
                cell = tbl_s8.cell(r_idx, c_idx)
                txt, bg = r_data[c_idx]
                set_cell_background(cell, bg)
                add_cell_content(cell, txt, bold=(c_idx % 2 == 0))

    for r in tbl_s8.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # SECTION 2: CONTENT/APPROVE PAGE & DOCUMENT NO
    # -----------------------------------------------------------------
    p_sec2 = doc.add_paragraph()
    r = p_sec2.add_run("2. Content/Approve page\n2.1 Document No")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_sec2.paragraph_format.space_after = Pt(2)

    tbl_docno = doc.add_table(rows=2, cols=4)
    set_table_borders(tbl_docno, COLOR_BORDER)
    tbl_docno.alignment = WD_TABLE_ALIGNMENT.CENTER
    docno_w = [Inches(1.5), Inches(1.8), Inches(1.8), Inches(2.07)]
    for r in tbl_docno.rows:
        for idx, w in enumerate(docno_w): r.cells[idx].width = w

    d_hdr = ["FormID", "Form Name", "Diagram Name", "Form Number"]
    d_val = ["Wood_Pellets", "Wood Pellets", "WP _P0", "WP- %YY%MM%ZM4"]
    for c_idx in range(4):
        c0 = tbl_docno.cell(0, c_idx); set_cell_background(c0, COLOR_YELLOW); add_cell_content(c0, d_hdr[c_idx], bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
        c1 = tbl_docno.cell(1, c_idx); set_cell_background(c1, COLOR_WHITE); add_cell_content(c1, d_val[c_idx], align=WD_ALIGN_PARAGRAPH.CENTER)

    for r in tbl_docno.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 60, 60)

    p_docno_note = doc.add_paragraph()
    r = p_docno_note.add_run("Format: WP %YY%MM%ZM4 (Serial numbers start from 1 at the beginning of each month)\nFor example: WP-26060001 / WP26070001")
    r.font.name = "Times New Roman"; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(71,85,105)
    p_docno_note.paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # SECTION 3: FILL FORM FIELDS
    # -----------------------------------------------------------------
    p_sec3 = doc.add_paragraph()
    r = p_sec3.add_run("3. Fill form fields\n3.1 M-Table-Schema (Master Table Fields)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_sec3.paragraph_format.space_after = Pt(2)

    m_widths = [Inches(1.4), Inches(1.3), Inches(0.65), Inches(0.85), Inches(0.35), Inches(0.6), Inches(0.8), Inches(1.22)]

    base_system_fields = [
        ("FillerID", "Applicant", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("FillerName", "Applicant", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("FillerDept", "Applicant Department", "", "Nvarchar(100)", "", "Filler", "BPM", "Same as development SOP"),
        ("FillerDeptName", "Applicant Department", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("ApplicantID", "Requestor", "select", "Nvarchar(100)", "V", "", "BPM", "Same as development SOP"),
        ("ApplicantName", "Requestor", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("ApplicantDept", "Requestor Department", "", "Nvarchar(100)", "", "FillerDept", "BPM", "Same as development SOP"),
        ("ApplicantDeptName", "Requestor Department", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("ApplicantTitleID", "Requestor Title", "", "Nvarchar(100)", "", "FillerTitle", "BPM", "Same as development SOP"),
        ("ApplicantTitle", "Requestor Title", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("Importance", "Importance", "Radio", "Varchar(4)", "", "Normal", "BPM", "Same as development SOP"),
        ("CompanyCode", "Company", "select", "Nvarchar(10)", "V", "", "BPM", "Same as development SOP"),
        ("CompanyName", "Company", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("CompanyIDshort", "Purpose/Reason for Working at Home", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("Justification", "Justification", "", "Nvarchar(255)", "", "", "BPM", "Same as development SOP")
    ]

    m_step_sections = [
        ("--- 1. Sale Department & Planning Fields ---", [
            ("sale_customer_code", "Customer Code", "Text", "Nvarchar(20)", "V", "", "", ""),
            ("sale_customer_name", "Customer Name", "Text", "Nvarchar(255)", "V", "", "", ""),
            ("sale_po_no", "PO No.", "Text", "Nvarchar(50)", "V", "", "", ""),
            ("sale_order_no", "Order No.", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("sale_from_country", "From country", "Select", "Nvarchar(50)", "V", "", "", ""),
            ("sale_address", "Address", "Text", "Nvarchar(255)", "", "", "", ""),
            ("sale_contact_person", "Contact Person", "Text", "Nvarchar(100)", "", "", "", ""),
            ("sale_email_tel", "Email / Telephone", "Text", "Nvarchar(150)", "", "", "", ""),
            ("sale_customer_po_no", "Customer PO No", "Text", "Nvarchar(50)", "", "", "", ""),
            ("sale_pi_no", "PI NO.", "Text", "Nvarchar(50)", "V", "", "", ""),
            ("sale_product_code", "Product Code", "Text", "Nvarchar(150)", "V", "", "", ""),
            ("sale_product_name", "Product Name", "Text", "Navarchar(255)", "v", "", "", ""),
            ("sale_product_type", "Product Type", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("sale_ship_to", "Ship-to Location", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("sale_quantity", "Quantity", "Number", "int / decimal", "v", "", "", ""),
            ("sale_delivery_date_req", "Requested Delivery Date", "Date", "date", "v", "", "", ""),
            ("sale_delivery_date_target", "Requested Delivery Date target", "Date", "date", "v", "", "", ""),
            ("sale_certificate_req", "Certificate Requirement", "Multi select", "Nvarchar(100)", "v", "", "", ""),
            ("sale_other_certificate", "Other Certificate", "Text", "Nvarchar(150)", "", "", "", ""),
            ("sale_customer_req", "Customer Requirement", "Textarea", "Nvarchar(MAX)", "v", "", "", ""),
            ("sale_special_req", "Special Requirement", "Textarea", "Nvarchar(MAX)", "v", "", "", ""),
            ("plan_pi_no", "PI NO. (Planning)", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("plan_mo_no", "MO No. (Planning)", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("plan_date_start", "Plan Date start", "Date", "Date", "v", "", "", ""),
            ("plan_date_finish", "Plan Date Finish", "Date", "Date", "v", "", "", ""),
            ("plan_prod_batch", "Production Batch", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("plan_prod_desc", "Production Description", "Text", "Nvarchar(255)", "v", "", "", ""),
            ("plan_cert_scheme", "Certificate Scheme", "Multi select", "Nvarchar(100)", "v", "", "", ""),
            ("plan_product_code", "Product Code (Planning)", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("plan_volume", "Volume", "Text", "Nvarchar(50)", "v", "", "", "")
        ]),
        ("--- 2. RA — Regulatory / Requirement Fields ---", [
            ("ra_RegulatoryCertificateStatus", "Regulatory Certificate Status", "Text", "Nvarchar(150)", "v", "", "", "Update from D table"),
            ("ra_cert_status", "Certificate Status", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("ra_license_expired", "License / Permit expired", "Date", "Nvarchar(150)", "v", "", "", ""),
            ("ra_specification_req", "Specification Requirement", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("ra_label_req", "Label Requirement", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("ra_packaging_req", "Packaging Requirement", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("ra_regulatory_req", "Customer Regulatory Requirement", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("ra_transport_Expired_Date", "Transportation Expiry Date", "Date", "Nvarchar(150)", "v", "", "", "")
        ]),
        ("--- 3. Production — Woods material planning Fields ---", [
            ("prod_planned_qty", "Planned Quantity", "Text", "Nvarchar(50)", "v", "", "", "Update from D table"),
            ("prod_actual_qty", "Actual Quantity", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("prod_pl_yield", "Yield", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("prod_total_uptime", "Total Uptime", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("prod_pl_total_downtime", "Total Downtime", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("prod_statDate", "Production Start Date Time", "Text", "Date", "v", "", "", ""),
            ("prod_statTime", "Start Time", "Text", "Time", "v", "", "", ""),
            ("prod_finishDate", "Production Finish Date time", "Text", "Date", "v", "", "", ""),
            ("prod_finishTime", "Finish Time", "Text", "Time", "v", "", "", ""),
            ("prod_material_code", "Material Code", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("prod_plant_supervisor", "Plant Supervisor", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("prod_rawMaterail_reg", "Raw Material Requirement", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("prod_pl_production_issue", "Production Issue", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("prod_fac1_status_util", "Factory 1 Status & Utilities", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("prod_fac2_status_util", "Factory 2 Status & Utilities", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("prod_machine_feed_lines", "Machine Feed Lines", "Multi select", "Nvarchar(100)", "v", "", "", "")
        ]),
        ("--- 4. QC — In-line Quality Control Fields ---", [
            ("qc_batch_no", "Batch No.", "Text", "Nvarchar(50)", "v", "", "", "Update from D table"),
            ("qc_test_date", "Test Date", "Date", "date", "v", "", "", ""),
            ("qc_param_raw_logs_slab", "Parameter Raw material Logs & Slab", "TextArea", "Nvarchar(255)", "v", "", "", ""),
            ("qc_param_raw_sawdust", "Parameter Raw material Sawdust", "TextArea", "Nvarchar(255)", "v", "", "", ""),
            ("qc_param_chipper", "Parameter Chipper", "TextArea", "Nvarchar(255)", "v", "", "", ""),
            ("qc_param_after_dryer", "Parameter After dryer", "TextArea", "Nvarchar(255)", "v", "", "", ""),
            ("qc_param_after_magnetic", "Parameter After Magnetic separator", "TextArea", "Nvarchar(255)", "v", "", "", "")
        ]),
        ("--- 5. QA — Quality Assurance and Laboratory Fields ---", [
            ("qa_testDate", "Test Date", "Date", "date", "v", "", "", "Update from D table"),
            ("qa_param_raw_sawdust", "Parameter Raw material: Sawdust", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("qa_param_chipper", "Parameter Chipper", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("qa_param_hammer_mill", "Parameter Hammer meal (Sieves)", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("qa_wood_pellets_magnetic", "Wood pellets After Magnetic separator", "Textarea", "Nvarchar(MAX)", "v", "", "", ""),
            ("qa_non_compliance", "Non-compliance", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("qa_bulk_warehouses", "Bulk storage warehouses", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("qa_COA_analyst", "COA & Referenced Report", "Textarea", "Nvarchar(255)", "v", "", "", ""),
            ("qa_analyst", "QA Analyst", "Text", "Nvarchar(100)", "v", "", "", "")
        ]),
        ("--- 6. Storage — Warehouse and Packing Fields ---", [
            ("wh_packingDailyReport", "Packing Daily Report", "Text", "Nvarchar(255)", "v", "", "", "Update from D table"),
            ("wh_packingDate_Start", "Packing Date Start - Date Finish", "Date", "Date", "v", "", "", ""),
            ("wh_packingDate_Finish", "Packing Finish Date", "Date", "Date", "v", "", "", ""),
            ("wh_packingMtdQties", "Packing Mtd Qties", "Text", "Nvarchar(100)", "v", "", "", ""),
            ("wh_bigBagLabelNo", "Big Bag label No.", "TextArea", "Nvarchar(255)", "v", "", "", ""),
            ("wh_selectionDate_from", "Selection Date from - to", "Date", "Date", "v", "", "", ""),
            ("wh_selectionDate_to", "Selection Date To", "Date", "Date", "v", "", "", ""),
            ("wh_material", "Material", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_storageLocation", "Storage Location", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_openingStock", "Opening Stock", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_totalReceiptQties", "Total receipt Qties", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_totalIssueQties", "Total issue Qties", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_closingStock", "Closing stock", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("wh_Inventory Controller", "Inventory Controller", "Text", "Nvarchar(150)", "v", "", "", "")
        ]),
        ("--- 7. RA — Gather information (Post-Shipment Compliance Dossier) ---", [
            ("ra_post_ggl_fit_fip", "1.GGL (PDF) FIT/FIP", "Multi select", "Nvarchar(255)", "v", "", "", "Update from D table"),
            ("ra_post_ggl_sde", "GGL SDE++", "Multi select", "Nvarchar(255)", "v", "", "", ""),
            ("ra_post_sbp_eudr", "SBP / EUDR", "Multi select", "Nvarchar(255)", "v", "", "", "")
        ]),
        ("--- 8. Shipment — Shipping Fields ---", [
            ("ship_SA_number", "SA number", "Text", "Nvarchar(150)", "v", "", "", "Update from D table"),
            ("ship_customer_name", "Customer name", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("ship_POD", "POD", "Text", "Nvarchar(150)", "v", "", "", ""),
            ("ship_Shipping_line", "Shipping line", "Text", "Nvarchar(10)", "v", "", "", ""),
            ("ship_Booking_no", "Booking no", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("ship_Transit_time", "Transit time", "Text", "Nvarchar(50)", "v", "", "", ""),
            ("ship_Loading_date", "Loading date", "Date", "Date", "v", "", "", ""),
            ("ship_Finished_date", "Finished date", "Date", "Date", "v", "", "", ""),
            ("ship_ETD", "ETD", "Date", "Date", "v", "", "", ""),
            ("ship_ETA", "ETA", "Date", "Date", "v", "", "", ""),
            ("ship_ATD", "ATD", "Date", "Date", "v", "", "", "")
        ])
    ]

    total_m_rows = 1 + len(base_system_fields) + sum(1 + len(fields) for _, fields in m_step_sections)
    tbl_m = doc.add_table(rows=total_m_rows, cols=8)
    set_table_borders(tbl_m, COLOR_BORDER)
    tbl_m.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_m.rows:
        for idx, w in enumerate(m_widths): r.cells[idx].width = w

    # Header Row
    m_headers = ["Field Name", "Description", "Type", "Data Type", "Req", "Default", "Data Source", "remark"]
    for c_idx, h_txt in enumerate(m_headers):
        c = tbl_m.cell(0, c_idx)
        set_cell_background(c, COLOR_YELLOW)
        add_cell_content(c, h_txt, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    curr_row = 1
    # Add Base System Rows
    for row_data in base_system_fields:
        for c_idx in range(8):
            c = tbl_m.cell(curr_row, c_idx)
            set_cell_background(c, COLOR_WHITE)
            txt = row_data[c_idx]
            align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4, 5, 6] else WD_ALIGN_PARAGRAPH.LEFT
            add_cell_content(c, txt, bold=(c_idx==0), font_size=8.0, align=align)
        curr_row += 1

    # Add Categorized Step Rows
    for sec_title, fields in m_step_sections:
        c_sec = tbl_m.cell(curr_row, 0)
        for i in range(1, 8): c_sec.merge(tbl_m.cell(curr_row, i))
        set_cell_background(c_sec, COLOR_SEC_BG)
        add_cell_content(c_sec, sec_title, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)
        curr_row += 1

        for row_data in fields:
            for c_idx in range(8):
                c = tbl_m.cell(curr_row, c_idx)
                set_cell_background(c, COLOR_WHITE)
                txt = row_data[c_idx]
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4, 5, 6] else WD_ALIGN_PARAGRAPH.LEFT
                is_b = (c_idx == 0)
                add_cell_content(c, txt, bold=is_b, font_size=8.0, align=align)
            curr_row += 1

    for r in tbl_m.rows:
        for c in r.cells: set_cell_margins(c, 30, 30, 50, 50)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 3.2 S-Table-Schema
    # -----------------------------------------------------------------
    p_s_lbl = doc.add_paragraph()
    r = p_s_lbl.add_run("3.2 S-Table-Schema (Step Sub-Form Schema)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s_lbl.paragraph_format.space_after = Pt(2)

    s_step_sections = m_step_sections[1:] # Steps 2 to 8
    total_s_rows = 1 + sum(1 + len(fields) for _, fields in s_step_sections)
    tbl_s = doc.add_table(rows=total_s_rows, cols=8)
    set_table_borders(tbl_s, COLOR_BORDER)
    tbl_s.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s.rows:
        for idx, w in enumerate(m_widths): r.cells[idx].width = w

    for c_idx, h_txt in enumerate(m_headers):
        c = tbl_s.cell(0, c_idx); set_cell_background(c, COLOR_YELLOW); add_cell_content(c, h_txt, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    curr_row = 1
    for sec_title, fields in s_step_sections:
        c_sec = tbl_s.cell(curr_row, 0)
        for i in range(1, 8): c_sec.merge(tbl_s.cell(curr_row, i))
        set_cell_background(c_sec, COLOR_SEC_BG)
        add_cell_content(c_sec, sec_title, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)
        curr_row += 1

        for row_data in fields:
            for c_idx in range(8):
                c = tbl_s.cell(curr_row, c_idx)
                set_cell_background(c, COLOR_WHITE)
                txt = row_data[c_idx]
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4, 5, 6] else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(c, txt, bold=(c_idx==0), font_size=8.0, align=align)
            curr_row += 1

    for r in tbl_s.rows:
        for c in r.cells: set_cell_margins(c, 30, 30, 50, 50)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 3.3 D-Table-Schema (NEW - THE MISSING SECTION)
    # -----------------------------------------------------------------
    p_d_lbl = doc.add_paragraph()
    r = p_d_lbl.add_run("3.3 D-Table-Schema (Detail & Transaction Tables: 8 Sub-Tables)\n[NEWLY ADDED & COMPLETED]")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11.5); r.font.color.rgb = RGBColor(30, 58, 138)
    p_d_lbl.paragraph_format.space_after = Pt(2)

    p_d_desc = doc.add_paragraph()
    r = p_d_desc.add_run(
        "ตารางหมวด D (Detail Tables) รองรับรายการข้อมูลที่มีความสัมพันธ์แบบ 1-to-Many (1 คำสั่งซื้อ มีหลายรายการย่อย) "
        "ซึ่งใน M-Table-Schema มีการระบุหมายเหตุ 'Update from D table' ทั้งหมด 7 จุดหลัก "
        "พร้อมตารางเพิ่มเติมสำหรับ Customer Complaints (ตาม Remark ข้อ 4.2) ดังรายละเอียดตารางทั้ง 8 ตารางต่อไปนี้:"
    )
    r.font.name = "Times New Roman"; r.font.size = Pt(9.0); r.font.color.rgb = RGBColor(51, 65, 85)
    p_d_desc.paragraph_format.space_after = Pt(4)

    # List of 8 D-Tables
    d_tables_specs = [
        ("3.3.1 D_RA_Certificate_Detail (เชื่อมโยง ra_RegulatoryCertificateStatus)", [
            ("d_cert_id", "Certificate Row ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("cert_type", "Certificate Type", "Select", "Nvarchar(50)", "V", "", "grh_v_combo", "SBP, GGL, FSC, ENplus, PEFC"),
            ("cert_no", "Certificate / License No.", "Text", "Nvarchar(100)", "V", "", "RA", "เลขที่ใบอนุญาต/ใบรับรอง"),
            ("issue_date", "Issue Date", "Date", "Date", "V", "", "RA", "วันที่ออกใบรับรอง"),
            ("expiry_date", "Expiry Date", "Date", "Date", "V", "", "RA", "วันหมดอายุใบอนุญาต"),
            ("cert_status", "Active Status", "Select", "Nvarchar(50)", "V", "VALID", "RA", "VALID, PENDING_RENEWAL, EXPIRED"),
            ("attachment_path", "Attached File Path", "File/URL", "Nvarchar(500)", "", "", "DMS", "ลิงก์ไฟล์ PDF สแกนใบรับรอง")
        ]),
        ("3.3.2 D_Production_Daily_Execution (เชื่อมโยง prod_planned_qty)", [
            ("d_prod_id", "Production Execution ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("prod_date", "Execution Date", "Date", "Date", "V", "", "Prod", "วันที่เดินสายการผลิต"),
            ("shift_no", "Work Shift", "Select", "Nvarchar(20)", "V", "Shift 1", "Prod", "Shift 1 (Day) / Shift 2 (Night)"),
            ("planned_tons", "Planned Volume (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ยอดแผนผลิตกะนี้"),
            ("actual_tons", "Actual Volume (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ยอดผลิตได้จริงกะนี้"),
            ("yield_output", "Yield Output (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ผลผลิตเนื้อไม้สุทธิ"),
            ("raw_log_tons", "Raw Logs Used (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ปริมาณไม้ยางท่อนที่ใช้"),
            ("raw_slab_tons", "Raw Slabs Used (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ปริมาณไม้ปีกที่ใช้"),
            ("raw_sawdust_tons", "Raw Sawdust Used (Ton)", "Number", "Decimal(10,2)", "V", "", "Prod", "ปริมาณขี้เลื่อยที่ใช้"),
            ("uptime_mins", "Uptime Minutes", "Number", "int", "V", "", "Prod", "เวลาเครื่องจักรเดินปกติ (นาที)"),
            ("downtime_mins", "Downtime Minutes", "Number", "int", "V", "", "Prod", "เวลาเครื่องจักรหยุดซ่อม (นาที)"),
            ("downtime_reason", "Cause of Downtime", "Textarea", "Nvarchar(255)", "", "", "Prod", "สาเหตุการหยุดเครื่อง"),
            ("fac1_fuels_liters", "Fac 1 Fuel (Liters)", "Number", "Decimal(10,2)", "", "", "Prod", "ปริมาณน้ำมันเชื้อเพลิง โรง 1"),
            ("fac1_kwh", "Fac 1 Power (kWh)", "Number", "Decimal(10,2)", "", "", "Prod", "ปริมาณกระแสไฟฟ้า โรง 1"),
            ("fac2_fuels_liters", "Fac 2 Fuel (Liters)", "Number", "Decimal(10,2)", "", "", "Prod", "ปริมาณน้ำมันเชื้อเพลิง โรง 2"),
            ("fac2_kwh", "Fac 2 Power (kWh)", "Number", "Decimal(10,2)", "", "", "Prod", "ปริมาณกระแสไฟฟ้า โรง 2")
        ]),
        ("3.3.3 D_QC_Inline_Checkpoints (เชื่อมโยง qc_batch_no: 5 จุดตรวจหน้างาน)", [
            ("d_qc_id", "QC Test Row ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("batch_no", "Production Batch No.", "Text", "Nvarchar(50)", "V", "", "QC", "เลขแบทช์ผลิต เช่น 1-4"),
            ("checkpoint_point", "Inspection Checkpoint", "Select", "Nvarchar(100)", "V", "", "QC", "1.Logs & Slab, 2.Sawdust, 3.Chipper, 4.Dryer, 5.Magnetic"),
            ("cleanliness_pct", "Cleanliness (%)", "Number", "Decimal(5,2)", "", "", "QC", "ความสะอาดวัตถุดิบ"),
            ("moisture_pct", "Moisture Content (%)", "Number", "Decimal(5,2)", "V", "", "QC", "ค่าความชื้นที่วัดได้"),
            ("target_moisture", "Target Moisture Spec", "Text", "Nvarchar(50)", "V", "", "QC", "≤70%, ≤60%, 12-14%"),
            ("particle_dimensions", "Diameter & Length", "Text", "Nvarchar(100)", "", "", "QC", "ขนาดเส้นผ่านศูนย์กลางและความยาว"),
            ("check_result", "Pass / Fail Status", "Select", "Nvarchar(20)", "V", "PASS", "QC", "PASS / FAIL / HOLD"),
            ("inspector_name", "QC Inspector", "Text", "Nvarchar(100)", "V", "", "QC", "ชื่อเจ้าหน้าที่ QC ผู้ตรวจ"),
            ("inspection_time", "Inspection Timestamp", "DateTime", "datetime", "V", "GETDATE()", "Auto", "เวลาที่ตรวจหน้างาน")
        ]),
        ("3.3.4 D_QA_Lab_Parameters (เชื่อมโยง qa_testDate: ผลวิเคราะห์ห้องแล็บและ COA)", [
            ("d_qa_id", "QA Test Row ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("sample_no", "Lab Sample ID", "Text", "Nvarchar(50)", "V", "", "QA", "รหัสตัวอย่างสุ่มตรวจ"),
            ("test_date", "Lab Test Date", "Date", "Date", "V", "", "QA", "วันที่นำเข้าห้องทดลอง"),
            ("pellet_diameter_mm", "Pellet Diameter (8±1 mm)", "Number", "Decimal(4,2)", "V", "8.0", "QA", "ขนาดความโตเม็ดไม้ (mm)"),
            ("pellet_length_mm", "Pellet Length (25±15 mm)", "Number", "Decimal(4,2)", "V", "26.0", "QA", "ความยาวเม็ดไม้ (mm)"),
            ("moisture_pct", "Pellet Moisture (<10%)", "Number", "Decimal(4,2)", "V", "7.0", "QA", "ความชื้นห้องแล็บ (%)"),
            ("bulk_density_kgm3", "Bulk Density (>600 kg/m³)", "Number", "Decimal(6,2)", "V", "600", "QA", "ความหนาแน่นรวม"),
            ("fines_pct", "Fines Below (<1.0%)", "Number", "Decimal(4,2)", "V", "0.8", "QA", "ปริมาณฝุ่นแตกหัก (%)"),
            ("ash_content_pct", "Ash Content (<2.0%)", "Number", "Decimal(4,2)", "V", "1.5", "QA", "ปริมาณขี้เถ้าหลังเผา (%)"),
            ("mechanical_durability", "Durability (>97.5%)", "Number", "Decimal(4,2)", "V", "97.8", "QA", "ความทนทานต่อการแตกหัก (%)"),
            ("calorific_value_kcal", "Calorific Value (≥4,000)", "Number", "Decimal(6,2)", "V", "4,250", "QA", "ค่าความร้อน (kcal/kg)"),
            ("chipper_chips_l_w_t", "Chipper Size L/W/T", "Text", "Nvarchar(100)", "", "", "QA", "30±10mm / 25±5mm / ≤8mm"),
            ("hammer_mill_sieves", "Hammer Mill Sieves", "Text", "Nvarchar(100)", "", "", "QA", "Length / Width / Thickness"),
            ("warehouse_storage_spec", "Bulk Warehouse Test", "Text", "Nvarchar(150)", "", "", "QA", "Moisture: 22%, Density: 650"),
            ("coa_file_ref", "COA File Reference", "Text", "Nvarchar(150)", "V", "", "QA", "COA-202610-LF2-03918.pdf"),
            ("tpc_report_ref", "TPC Test Report No.", "Text", "Nvarchar(100)", "", "", "QA", "Referenced TPC test report no."),
            ("analyst_sign", "QA Analyst Name", "Text", "Nvarchar(100)", "V", "", "QA", "Somchai P. / Lead QC Inspector")
        ]),
        ("3.3.5 D_Storage_Packing_Movement (เชื่อมโยง wh_packingDailyReport: บรรจุ Big Bag และสต็อก)", [
            ("d_wh_id", "Storage Movement ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("packing_report_no", "Packing Daily Report No.", "Text", "Nvarchar(100)", "V", "", "WH", "PDR-202610-A01"),
            ("bigbag_serial_no", "Big Bag Label / Barcode", "Text", "Nvarchar(150)", "V", "", "WH", "BB-GRP1-2026-001"),
            ("material_code", "Material Code", "Text", "Nvarchar(50)", "V", "", "WH", "BWP-11-08 / BWP-12-08"),
            ("warehouse_bay", "Warehouse Bay / Location", "Text", "Nvarchar(100)", "V", "Warehouse 1", "WH", "จุดจัดเก็บในคลัง"),
            ("packing_date", "Packing Date", "Date", "Date", "V", "", "WH", "วันที่บรรจุถุง Big Bag"),
            ("packed_qties_ton", "Packed Quantity (Ton)", "Number", "Decimal(10,2)", "V", "", "WH", "ปริมาณบรรจุถุงนี้"),
            ("stock_opening_ton", "Opening Stock", "Number", "Decimal(10,2)", "V", "", "WH", "ยอดยกมา"),
            ("stock_receipt_ton", "Receipt Quantity", "Number", "Decimal(10,2)", "V", "", "WH", "ยอดรับเข้า"),
            ("stock_issue_ton", "Issue Quantity", "Number", "Decimal(10,2)", "V", "", "WH", "ยอดจ่ายออก"),
            ("stock_closing_ton", "Closing Stock", "Number", "Decimal(10,2)", "V", "", "WH", "ยอดคงเหลือยกไป"),
            ("inventory_controller", "Inventory Controller", "Text", "Nvarchar(100)", "V", "", "WH", "เจ้าหน้าที่ควบคุมสต็อกคลัง")
        ]),
        ("3.3.6 D_RA_Compliance_Dossier (เชื่อมโยง ra_post_ggl_fit_fip: เอกสารส่งออก SBP/GGL/EUDR)", [
            ("d_dossier_id", "Dossier Checklist ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("dossier_scheme", "Compliance Scheme", "Select", "Nvarchar(50)", "V", "", "RA", "GGL FIT/FIP, GGL SDE++, SBP/EUDR"),
            ("document_title", "Document Title", "Text", "Nvarchar(150)", "V", "", "RA", "Cover letter, TC from CU, Cleanliness, etc."),
            ("is_checked", "Verification Checked", "Boolean", "Bit", "V", "1", "RA", "1 = สมบูรณ์ครบถ้วน / 0 = รอเอกสาร"),
            ("verified_by", "Verified By Officer", "Text", "Nvarchar(100)", "V", "", "RA", "เจ้าหน้าที่ฝ่ายกำกับดูแล"),
            ("verified_datetime", "Verified Timestamp", "DateTime", "datetime", "V", "GETDATE()", "Auto", "วันเวลาที่ตรวจสอบเอกสาร"),
            ("dms_document_url", "DMS Document Link", "Text/URL", "Nvarchar(500)", "", "", "DMS", "ลิงก์ไฟล์เอกสารดิจิทัลในระบบ")
        ]),
        ("3.3.7 D_Shipment_Logistics_Detail (เชื่อมโยง ship_SA_number: การจัดส่ง ตู้คอนเทนเนอร์ และเรือ)", [
            ("d_ship_id", "Shipment Row ID", "Identity", "int", "V", "", "Auto", "PK / Running No."),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "M-Table", "FK ผูกกับคำสั่งซื้อ MO"),
            ("sa_number", "Shipping Advice (SA No.)", "Text", "Nvarchar(100)", "V", "", "Ship", "SA-202610-03918-ISO"),
            ("container_no", "Container Number", "Text", "Nvarchar(50)", "V", "", "Ship", "เลขที่ตู้คอนเทนเนอร์"),
            ("seal_no", "Customs Seal No.", "Text", "Nvarchar(50)", "V", "", "Ship", "เลขซีลศุลกากร"),
            ("loaded_tons", "Loaded Net Weight (Ton)", "Number", "Decimal(10,2)", "V", "", "Ship", "น้ำหนักบรรทุกสุทธิ"),
            ("shipping_line", "Shipping Line Carrier", "Text", "Nvarchar(50)", "V", "EVG", "Ship", "EVG, MAERSK, ONE, PIL, etc."),
            ("booking_no", "Carrier Booking No.", "Text", "Nvarchar(50)", "V", "", "Ship", "09050012456"),
            ("port_of_loading", "Port of Loading (POL)", "Text", "Nvarchar(100)", "V", "Songkhla Port", "Ship", "ท่าเรือต้นทาง"),
            ("port_of_discharge", "Port of Discharge (POD)", "Text", "Nvarchar(100)", "V", "Port of Japan", "Ship", "ท่าเรือปลายทาง"),
            ("etd_date", "Estimated Departure (ETD)", "Date", "Date", "V", "", "Ship", "กำหนดเรือออก"),
            ("atd_date", "Actual Departure (ATD)", "Date", "Date", "", "", "Ship", "เรือออกเดินทางจริง"),
            ("eta_date", "Estimated Arrival (ETA)", "Date", "Date", "V", "", "Ship", "กำหนดเรือถึงปลายทาง")
        ]),
        ("3.3.8 D_Customer_Complaints (เชื่อมโยง Customer Complaints via Dashboard ตาม Remark 4.2)", [
            ("complaint_id", "Complaint Ticket No.", "Identity/Text", "Nvarchar(50)", "V", "", "BPM", "CMP-202610-001 (PK)"),
            ("order_no", "Order Number", "Text", "Nvarchar(100)", "V", "", "Dashboard", "FK เชื่อมกับคำสั่งซื้อ"),
            ("mo_no", "Manufacturing Order No.", "Text", "Nvarchar(50)", "V", "", "Dashboard", "FK ผูกกับรหัส MO"),
            ("category", "Complaint Category", "Select", "Nvarchar(100)", "V", "", "Sale", "Moisture, Ash, Durability, Packaging, Delay, Billing, Others"),
            ("severity", "Severity Level", "Select", "Nvarchar(30)", "V", "Medium", "Sale", "Low, Medium, High, Critical"),
            ("issue_description", "Customer Description", "Textarea", "Nvarchar(MAX)", "V", "", "Sale", "รายละเอียดข้อร้องเรียนจากลูกค้าหลังรับมอบสินค้า"),
            ("immediate_action", "Corrective Action", "Textarea", "Nvarchar(MAX)", "V", "", "Sale", "มาตรการแก้ไขและชดเชยเบื้องต้น"),
            ("updated_by", "Recorded / Updated By", "Text", "Nvarchar(100)", "V", "", "Sale", "ชื่อเจ้าหน้าที่ฝ่ายขายผู้บันทึก (Mandatory)"),
            ("updated_datetime", "Recorded Timestamp", "DateTime", "datetime", "V", "GETDATE()", "Auto", "วันเวลาที่รับเรื่องและอัปเดต (Mandatory)"),
            ("complaint_status", "Complaint Status", "Select", "Nvarchar(30)", "V", "Pending", "BPM", "Pending, Investigating, Resolved, Closed")
        ])
    ]

    for d_title, d_fields in d_tables_specs:
        p_t = doc.add_paragraph()
        r = p_t.add_run(d_title)
        r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(10); r.font.color.rgb = RGBColor(30, 41, 59)
        p_t.paragraph_format.space_before = Pt(4)
        p_t.paragraph_format.space_after = Pt(1)

        tbl = doc.add_table(rows=1+len(d_fields), cols=8)
        set_table_borders(tbl, COLOR_BORDER)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        for r in tbl.rows:
            for idx, w in enumerate(m_widths): r.cells[idx].width = w

        for c_idx, h_txt in enumerate(m_headers):
            c = tbl.cell(0, c_idx)
            set_cell_background(c, COLOR_D_BG if "Complaint" not in d_title else COLOR_COMP_BG)
            add_cell_content(c, h_txt, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)

        for r_idx, row_data in enumerate(d_fields, start=1):
            for c_idx in range(8):
                c = tbl.cell(r_idx, c_idx)
                set_cell_background(c, COLOR_WHITE)
                txt = row_data[c_idx]
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4, 5, 6] else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(c, txt, bold=(c_idx==0), font_size=8.0, align=align)

        for r in tbl.rows:
            for c in r.cells: set_cell_margins(c, 25, 25, 45, 45)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -----------------------------------------------------------------
    # SECTION 4: APPROVAL PROCESS & DASHBOARD SPECIFICATIONS
    # -----------------------------------------------------------------
    p_sec4 = doc.add_paragraph()
    r = p_sec4.add_run("4. Approval Process\n4.1 Process Diagram (Comprehensive 8-Step Lifecycle Flowchart)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11.5)
    p_sec4.paragraph_format.space_after = Pt(2)

    p_flow_desc = doc.add_paragraph()
    r = p_flow_desc.add_run("ผังขั้นตอนการอนุมัติและวงจรชีวิตคำสั่งซื้อครบวงจร (Sale ➔ RA ➔ Production ➔ QC ➔ QA ➔ Storage ➔ RA Verification ➔ Shipment ➔ FINISHED):")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.0); r.font.color.rgb = RGBColor(71,85,105)

    # Flowchart visual table
    tbl_diag = doc.add_table(rows=6, cols=5)
    set_table_borders(tbl_diag, COLOR_BORDER)
    tbl_diag.alignment = WD_TABLE_ALIGNMENT.CENTER
    flow_w = [Inches(1.4), Inches(0.4), Inches(1.4), Inches(0.4), Inches(1.4)]
    for r in tbl_diag.rows:
        for idx, w in enumerate(flow_w): r.cells[idx].width = w

    def format_step_box(cell, step_no, step_name, owner_dept, action_text):
        set_cell_background(cell, COLOR_YELLOW)
        set_cell_margins(cell, 50, 50, 60, 60)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1); p.paragraph_format.space_after = Pt(1)
        r1 = p.add_run(f"[{step_no}]\n"); r1.bold = True; r1.font.size = Pt(9.0); r1.font.color.rgb = RGBColor(180,83,9)
        r2 = p.add_run(f"{step_name}\n"); r2.bold = True; r2.font.size = Pt(8.5); r2.font.color.rgb = RGBColor(0,0,0)
        r3 = p.add_run(f"({owner_dept})\n"); r3.italic = True; r3.font.size = Pt(7.5); r3.font.color.rgb = RGBColor(71,85,105)
        r4 = p.add_run(f"➔ {action_text}"); r4.bold = True; r4.font.size = Pt(7.5); r4.font.color.rgb = RGBColor(22,101,52)

    def format_arrow(cell, arrow_txt="🡺"):
        set_cell_background(cell, COLOR_WHITE)
        set_cell_margins(cell, 50, 50, 30, 30)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(arrow_txt); r.bold = True; r.font.size = Pt(14); r.font.color.rgb = RGBColor(100,116,139)

    # Row 0: Step 1 -> Step 2 -> Step 3
    format_step_box(tbl_diag.cell(0, 0), "Step 1", "Sale Department", "ฝ่ายขาย", "Submit / Withdraw")
    format_arrow(tbl_diag.cell(0, 1), "🡺")
    format_step_box(tbl_diag.cell(0, 2), "Step 2", "RA Regulatory", "ฝ่ายกำกับดูแล", "Agree ➔ Next / Reject")
    format_arrow(tbl_diag.cell(0, 3), "🡺")
    format_step_box(tbl_diag.cell(0, 4), "Step 3", "Woods Planning", "ฝ่ายวางแผน", "Agree ➔ Next / Return")

    # Row 1: Connector down to Step 4
    for c in range(4):
        c_emp = tbl_diag.cell(1, c); set_cell_background(c_emp, COLOR_WHITE); c_emp.text = ""
    format_arrow(tbl_diag.cell(1, 4), "🡻")

    # Row 2: Step 6 <- Step 5 <- Step 4
    format_step_box(tbl_diag.cell(2, 4), "Step 4", "QC In-Line", "ฝ่าย QC หน้างาน", "5 จุดตรวจ ➔ Agree")
    format_arrow(tbl_diag.cell(2, 3), "🡸")
    format_step_box(tbl_diag.cell(2, 2), "Step 5", "QA Laboratory", "ฝ่าย QA Lab", "COA & Sieves ➔ Agree")
    format_arrow(tbl_diag.cell(2, 1), "🡸")
    format_step_box(tbl_diag.cell(2, 0), "Step 6", "Warehouse/Storage", "ฝ่ายคลังสินค้า", "Packing & Stock ➔ Agree")

    # Row 3: Connector down to Step 7
    format_arrow(tbl_diag.cell(3, 0), "🡻")
    for c in range(1, 5):
        c_emp = tbl_diag.cell(3, c); set_cell_background(c_emp, COLOR_WHITE); c_emp.text = ""

    # Row 4: Step 7 -> Step 8 -> FINISHED
    format_step_box(tbl_diag.cell(4, 0), "Step 7", "RA Gather Info", "ฝ่าย RA ส่ง Sale", "GGL, SBP Dossier ➔ Agree")
    format_arrow(tbl_diag.cell(4, 1), "🡺")
    format_step_box(tbl_diag.cell(4, 2), "Step 8", "Shipment / Logistics", "ฝ่ายขนส่ง", "Dispatch ➔ Complete")
    format_arrow(tbl_diag.cell(4, 3), "🡺")

    c_fin = tbl_diag.cell(4, 4)
    set_cell_background(c_fin, COLOR_GREEN)
    set_cell_margins(c_fin, 60, 60, 60, 60)
    p = c_fin.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f1 = p.add_run("FINISHED\n"); r_f1.bold = True; r_f1.font.size = Pt(11); r_f1.font.color.rgb = RGBColor(21,128,61)
    r_f2 = p.add_run("(Order Closed)"); r_f2.font.size = Pt(8.5); r_f2.font.color.rgb = RGBColor(15,23,42)

    # Row 5: Dashboard Note
    c_mgt = tbl_diag.cell(5, 0)
    for i in range(1, 5): c_mgt.merge(tbl_diag.cell(5, i))
    set_cell_background(c_mgt, "F1F5F9")
    set_cell_margins(c_mgt, 50, 50, 70, 70)
    p = c_mgt.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("📊 Management Dashboard: ติดตาม Real-time 8-Step KPI, สถานะคำสั่งซื้อ, การขนส่ง และบันทึกข้อร้องเรียนลูกค้า (Customer Complaints)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(30,41,59)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 4.2 Explanation of approval steps
    p_ex_lbl = doc.add_paragraph()
    r = p_ex_lbl.add_run("4.2 Explanation of approval steps (สิทธิ์และการส่งต่องานระหว่างขั้นตอน)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_ex_lbl.paragraph_format.space_after = Pt(2)

    tbl_app = doc.add_table(rows=10, cols=4)
    set_table_borders(tbl_app, COLOR_BORDER)
    tbl_app.alignment = WD_TABLE_ALIGNMENT.CENTER
    app_w = [Inches(1.8), Inches(1.5), Inches(2.0), Inches(1.87)]
    for r in tbl_app.rows:
        for idx, w in enumerate(app_w): r.cells[idx].width = w

    app_headers = ["Step Name", "Responsible Dept", "Function / Action", "Step Remark"]
    for c_idx, h_txt in enumerate(app_headers):
        c = tbl_app.cell(0, c_idx)
        set_cell_background(c, COLOR_YELLOW)
        add_cell_content(c, h_txt, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    app_steps_data = [
        ("1.Start -Sale", "Sale Department", "- Submit\n- withdraw", "กรอกข้อมูลลูกค้า สัญญา แนบ PO/PI\n(Sale แก้ไขข้อมูลได้ทุก Vendor ระหว่างผลิต)"),
        ("2.RA", "RA Department", "- Agree 🡺Next\n- Rejected 🡺Complete\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) แนบ Title deed, พิกัด GPS, SD, DF/LC"),
        ("3.Production Woods material planning", "Production Planning", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) กำหนด Batch, เครื่องจักร, ปริมาณสับ/อัด"),
        ("4.QC (In-line)", "In-line QC Inspector", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) ตรวจสอบหน้างาน 5 จุด (Logs, Sawdust, Dryer, etc.)"),
        ("5.QA", "QA Laboratory", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) วิเคราะห์แล็บ ละเอียด, COA, Sieves, Durability"),
        ("6.Warehouse/Store", "Warehouse & Packing", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) รายงานการบรรจุ Big Bag และปรับปรุงสต็อก 4 ยอด"),
        ("7.RA (Gather Info)", "RA Department", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).รวบรวมชุดเอกสาร GGL, SBP, EUDR Data Sheet, GeoJSON ส่งให้ Sales เมื่อร้องขอ"),
        ("8.Shipping", "Logistics & Shipping", "- Agree 🡺FINISHED\n- Rejected 🡺Return\n- Other/QueryOpinion, Waiting", "(1).Get email – Approval Request\n(2) บันทึก SA, บุ๊กกิ้งเรือ, ตู้คอนเทนเนอร์, วันที่ออกเดินทาง"),
        ("Agree / Complete", "System Automated", "- Close Order\n- Notify Dashboard", "คำสั่งซื้อเสร็จสมบูรณ์ 100% บันทึกเข้าประวัติคำสั่งซื้อสำเร็จ")
    ]

    for r_idx, row_info in enumerate(app_steps_data, start=1):
        for c_idx in range(4):
            c = tbl_app.cell(r_idx, c_idx)
            set_cell_margins(c, 40, 40, 60, 60)
            if c_idx == 0:
                set_cell_background(c, COLOR_YELLOW)
                add_cell_content(c, row_info[c_idx], bold=True, font_size=8.0)
            elif c_idx == 2:
                set_cell_background(c, COLOR_WHITE)
                add_cell_content(c, row_info[c_idx], bold=True, font_size=8.0, color_rgb=(22,101,52))
            else:
                set_cell_background(c, COLOR_WHITE)
                add_cell_content(c, row_info[c_idx], font_size=8.0)

    p_rem = doc.add_paragraph()
    r_rem = p_rem.add_run(
        "Remark:\n"
        "- During the approval process, form fields cannot be modified. If any adjustments are required, the form will be rejected or returned to the previous step for data modification.\n"
        "- Sale department will input customer complaints on the Dashboard of each Order.\n"
        "- Some information will display on Dashboard."
    )
    r_rem.font.name = "Times New Roman"; r_rem.font.size = Pt(8.5); r_rem.font.italic = True
    p_rem.paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 4.3 CUSTOMER COMPLAINTS ON DASHBOARD (NEW - ADDED)
    # -----------------------------------------------------------------
    p_cc = doc.add_paragraph()
    r = p_cc.add_run("4.3 Customer Complaints Management on Dashboard (Post-Delivery Claims)\n[NEW SPECIFICATION PER REMARK 4.2]")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.color.rgb = RGBColor(190, 18, 60)
    p_cc.paragraph_format.space_after = Pt(2)

    p_cc_desc = doc.add_paragraph()
    r = p_cc_desc.add_run(
        "เนื่องจากข้อร้องเรียนจากลูกค้า (Customer Complaints) จะเกิดขึ้นภายหลังจากที่ลูกค้าได้รับสินค้าเรียบร้อยแล้ว (Post-Delivery) "
        "ฝ่ายขาย (Sale Department) จึงสามารถบันทึกข้อร้องเรียนได้โดยตรงผ่านหน้า Dashboard โดยไม่ต้องเปิดแบบฟอร์มขั้นตอนที่ 1 ซ้ำ โดยมีข้อกำหนดดังนี้:\n"
        "1. การเข้าถึง: กดปุ่ม '[💬 Complain]' ในตารางคำสั่งซื้อของ Dashboard หรือกดปุ่ม '[+ Log Complaint]' ในกล่องรายละเอียดออเดอร์\n"
        "2. การระบุตัวตนและเวลา (Mandatory): ต้องระบุชื่อผู้บันทึก (Updated By / Recorded By) และวันเวลาที่บันทึก (Timestamp) ทุกครั้ง โดยระบบจำชื่อผู้บันทึกไว้ใน LocalStorage เพื่อความสะดวกรวดเร็ว\n"
        "3. หมวดหมู่ข้อร้องเรียน: ความชื้นเกินเกณฑ์ (Moisture), ปริมาณขี้เถ้า (Ash Content), ฝุ่นแตกหัก (Durability/Fines), บรรจุภัณฑ์ชำรุด (Packaging), ส่งมอบล่าช้า (Shipping Delay), เอกสารใบแจ้งหนี้ (Billing), อื่นๆ (Others)\n"
        "4. การแสดงผลแจ้งเตือน: แสดงป้ายเตือนสีส้ม '⚠️ X Complain(s)' บนแถวคำสั่งซื้อในตาราง Dashboard ทันทีที่มีการบันทึกข้อร้องเรียน\n"
        "5. การเชื่อมโยง: ประวัติข้อร้องเรียนจะแสดงผลร่วมใน BPM Master Modal (Step 1) และพิมพ์ออกรายงาน BPM Print Report อย่างเป็นทางการ"
    )
    r.font.name = "Times New Roman"; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(51, 65, 85)
    p_cc_desc.paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 4.4 DASHBOARD INFORMATION DISPLAY MATRIX (NEW - ADDED)
    # -----------------------------------------------------------------
    p_dm = doc.add_paragraph()
    r = p_dm.add_run("4.4 Dashboard Information Display Matrix (Dashboard Integration Specification)\n[NEW SPECIFICATION PER REMARK 4.2]")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11); r.font.color.rgb = RGBColor(14, 116, 144)
    p_dm.paragraph_format.space_after = Pt(2)

    p_dm_desc = doc.add_paragraph()
    r = p_dm_desc.add_run(
        "ตารางแสดงการเชื่อมโยงข้อมูลจากฟอร์มทั้ง 8 ขั้นตอน มาแสดงผลบนหน้าจอหลักของ Dashboard (Operations View) เพื่อให้ผู้บริหารและฝ่ายปฏิบัติการติดตามผลได้แบบ Real-time:"
    )
    r.font.name = "Times New Roman"; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(71, 85, 105)
    p_dm_desc.paragraph_format.space_after = Pt(2)

    tbl_matrix = doc.add_table(rows=10, cols=4)
    set_table_borders(tbl_matrix, COLOR_BORDER)
    tbl_matrix.alignment = WD_TABLE_ALIGNMENT.CENTER
    matrix_w = [Inches(1.5), Inches(2.0), Inches(2.0), Inches(1.67)]
    for r in tbl_matrix.rows:
        for idx, w in enumerate(matrix_w): r.cells[idx].width = w

    mat_headers = ["Lifecycle Step", "Source Field in Form", "Dashboard Display Component", "Display Format / KPI Target"]
    for c_idx, h_txt in enumerate(mat_headers):
        c = tbl_matrix.cell(0, c_idx); set_cell_background(c, COLOR_YELLOW); add_cell_content(c, h_txt, bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    matrix_data = [
        ("Step 1 (Sale)", "sale_order_no, sale_customer_name, plan_mo_no, sale_quantity", "Dashboard Main Table (Column 2: Order Info)", "Order No (MO No), Customer Name, Ordered Tons"),
        ("Step 1 (Sale)", "Customer Complaints (D_Customer_Complaints)", "Dashboard Table Badge & Expanded Row", "ป้ายเตือน '⚠️ X Complain' + รายการข้อร้องเรียน"),
        ("Step 2 (RA)", "ra_cert_status, EUDR Geolocation (lat, lng)", "Dashboard Modal & Cadastral GIS View", "สถานะใบรับรอง, พิกัดแปลง และเส้นขอบเขต KML"),
        ("Step 3 (Production)", "prod_planned_qty, prod_actual_qty, prod_total_uptime", "Top KPI Card 2 (Production Progress %)", "เปอร์เซ็นต์ความคืบหน้าการผลิตสะสม (Progress Bar)"),
        ("Step 4 (QC In-line)", "qc_param_after_dryer, qc_param_after_magnetic", "Order Expanded Accordion (Col 2: Pellet Quality)", "Pellet Moisture (≤8%), Cooling Moisture, Downtime"),
        ("Step 5 (QA Lab)", "qa_COA_analyst, qa_wood_pellets_magnetic", "Top KPI Card 4 (Quality Deviations)", "Zero Deviations, COA Generated, Durability >97.5%"),
        ("Step 6 (Storage)", "wh_storageLocation, wh_closingStock", "Order Expanded Accordion (Col 3: Stock Movement)", "คลังที่เก็บ, ยอดสต็อกคงเหลือยกไป (Closing Stock)"),
        ("Step 7 (RA Verify)", "ra_post_ggl_fit_fip, ra_post_sbp_eudr", "BPM Modal & Print Report Dossier Check", "เครื่องหมายติ๊กถูกรับรองเอกสาร GGL, SBP, EUDR พร้อมส่งออก"),
        ("Step 8 (Shipment)", "ship_Shipping_line, ship_Booking_no, ship_ETD, ship_ETA", "Dashboard Main Table (Columns 3-5: Logistics)", "Shipping Line, Booking No, ETD, ETA, Transit Days")
    ]

    for r_idx, row_info in enumerate(matrix_data, start=1):
        for c_idx in range(4):
            c = tbl_matrix.cell(r_idx, c_idx)
            set_cell_margins(c, 35, 35, 50, 50)
            set_cell_background(c, COLOR_WHITE)
            is_b = (c_idx == 0)
            add_cell_content(c, row_info[c_idx], bold=is_b, font_size=8.0)

    # -----------------------------------------------------------------
    # SAVE DOCUMENT TO DESIGNATED DIRECTORIES
    # -----------------------------------------------------------------
    filename = "WoodPellets_SA_Document_Spec_20261026.docx"
    dest_dir_1 = r"D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets"
    dest_dir_2 = r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005\docs"
    
    saved_paths = []

    # 1. Save in Parent Project Directory
    path1 = os.path.join(dest_dir_1, filename)
    try:
        doc.save(path1)
        saved_paths.append(path1)
        print(f"[OK] Saved primary SA Document to: {path1}")
    except Exception as e:
        print(f"[ERR] Failed saving to path1: {e}")

    # 2. Save in Dashboard docs Directory
    path2 = os.path.join(dest_dir_2, filename)
    try:
        doc.save(path2)
        saved_paths.append(path2)
        print(f"[OK] Saved copy SA Document to docs: {path2}")
    except Exception as e:
        print(f"[ERR] Failed saving to path2: {e}")

    return saved_paths

if __name__ == "__main__":
    paths = create_sa_document()
    print("Generation complete! Total files saved:", len(paths))
