# -*- coding: utf-8 -*-
r"""
Generate Complete Wood Pellets Specification Document (.docx)
Includes:
- Section 1: UI BPM Full Layout (Steps 1 to 8)
- Section 2.1: M-Table-Schema starting from System Fields down to Justification, 
  followed by structured Step 1 to Step 8 fields with section colors
- Section 4: Brand New Flow Chart & Detailed Approval Process (8 Steps + Finish)
Destination: D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\WoodPellets_Full_Lifecycle_Spec_20261022.docx
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def generate_doc():
    doc = docx.Document()

    # Page Margins A4 Portrait
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(0.55)
        s.bottom_margin = Inches(0.55)
        s.left_margin = Inches(0.55)
        s.right_margin = Inches(0.55)

    COLOR_YELLOW = "FFFECC" # Exact label / header color from user screenshot
    COLOR_GREEN  = "CFFFCE" # Exact user input date/status color
    COLOR_WHITE  = "FFFFFF" # Normal input color
    COLOR_BORDER = "000000" # Black single border
    COLOR_SEC_BG = "FEF08A" # Slightly deeper yellow for section dividers in M-Table

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=60, bottom=60, left=75, right=75):
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

    w4 = [Inches(1.65), Inches(1.95), Inches(1.65), Inches(1.92)]

    # -----------------------------------------------------------------
    # TITLE & REVISION
    # -----------------------------------------------------------------
    p_comp = doc.add_paragraph()
    r_c = p_comp.add_run("Greenriverholding.com\nWood Pellets Form\nSpec Document")
    r_c.bold = True
    r_c.font.name = "Times New Roman"
    r_c.font.size = Pt(11)
    p_comp.paragraph_format.space_after = Pt(2)

    p_docmod = doc.add_paragraph()
    r_dm = p_docmod.add_run("Document version and modification remarks.")
    r_dm.font.name = "Times New Roman"
    r_dm.font.size = Pt(9.5)
    p_docmod.paragraph_format.space_after = Pt(2)

    tbl_ver = doc.add_table(rows=4, cols=4)
    set_table_borders(tbl_ver, COLOR_BORDER)
    tbl_ver.alignment = WD_TABLE_ALIGNMENT.CENTER
    ver_w = [Inches(0.8), Inches(1.3), Inches(1.5), Inches(3.57)]
    for r in tbl_ver.rows:
        for idx, w in enumerate(ver_w):
            r.cells[idx].width = w

    v_data = [
        ["Ver.", "Date", "Author", "Modified remark"],
        ["0.1", "2026/09/28", "Pa", "Initial Draft"],
        ["0.3", "2026/10/22", "Pa", "Full Lifecycle & Data Ownership Matrix"],
        ["0.5", "2026/10/22", "Pa & System Architect", "M-Table Schema (Steps 1-8 following Justification) & Brand New Flowchart"]
    ]
    for r_idx, row in enumerate(tbl_ver.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 45, 45, 65, 65)
            set_cell_background(cell, COLOR_YELLOW if r_idx == 0 else COLOR_WHITE)
            add_cell_content(cell, v_data[r_idx][c_idx], bold=(r_idx==0), align=WD_ALIGN_PARAGRAPH.LEFT if c_idx==3 else WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -----------------------------------------------------------------
    # HEADER BPM TABLE (Company & Requestor Info)
    # -----------------------------------------------------------------
    p_ht = doc.add_paragraph()
    r = p_ht.add_run("Wood pellets Form\nUI BPM")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_ht.paragraph_format.space_after = Pt(2)

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

    # -----------------------------------------------------------------
    # STEP 1: SALE DEPARTMENT & PLANNING
    # -----------------------------------------------------------------
    p_s1 = doc.add_paragraph()
    r = p_s1.add_run("1.Sale Department - Step")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s1.paragraph_format.space_after = Pt(2)

    tbl_s1 = doc.add_table(rows=19, cols=4)
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
        [("PO No. *", COLOR_YELLOW), ("PO-2026-09821", COLOR_WHITE), ("Order No. *", COLOR_YELLOW), ("ORD-2026-04159", COLOR_WHITE)],
        [("From country*", COLOR_YELLOW), ("US", COLOR_WHITE), ("Address", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE)],
        [("Contact Person:", COLOR_YELLOW), ("Thomason", COLOR_WHITE), ("Email /Telephone:", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE)],
        [("Customer PO No", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE), ("PI NO. *", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE)],
        [("Product Code *", COLOR_YELLOW), ("WP-001", COLOR_WHITE), ("Product Name*", COLOR_YELLOW), ("Wood Pellets", COLOR_WHITE)],
        [("Product Type", COLOR_YELLOW), ("1.  0.6mm± 1 mm, 2.  0.8mm ± 1 mm", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Ship-to Location*", COLOR_YELLOW), ("Port of Japan", COLOR_WHITE), ("Quantity*", COLOR_YELLOW), ("5000 MT", COLOR_WHITE)],
        [("Requested Delivery Date", COLOR_YELLOW), ("2026/12/15", COLOR_GREEN), ("Requested Delivery Date", COLOR_YELLOW), ("2026/12/30", COLOR_GREEN)],
        [("Certificate Requirement", COLOR_YELLOW), ("[ ■ ] SBP    [ ■ ] GGL", COLOR_WHITE), ("Other Certificate", COLOR_YELLOW), ("", COLOR_WHITE)],
        [("Customer Requirement:", COLOR_YELLOW), ("ตัวอย่าง (Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)],
        [("Special Requirement:", COLOR_YELLOW), ("ตัวอย่าง (ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection, etc.)", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]

    for row_idx, r_info in enumerate(s1_rows[:6], start=1):
        for col_idx in range(4):
            c = tbl_s1.cell(row_idx, col_idx)
            set_cell_background(c, r_info[col_idx][1]); add_cell_content(c, r_info[col_idx][0], bold=(r_info[col_idx][1]==COLOR_YELLOW))

    # Row 7: Product Type spans 3 cols
    tbl_s1.cell(7, 0).text = ""; set_cell_background(tbl_s1.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(7, 0), "Product Type", bold=True)
    c_pt = tbl_s1.cell(7, 1); c_pt.merge(tbl_s1.cell(7, 2)); c_pt.merge(tbl_s1.cell(7, 3))
    set_cell_background(c_pt, COLOR_WHITE); add_cell_content(c_pt, "1.  0.6mm± 1 mm, 2.  0.8mm ± 1 mm")

    # Row 8: Ship-to Location* | Port of Japan | Quantity* | 5000 MT
    tbl_s1.cell(8, 0).text = ""; set_cell_background(tbl_s1.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(8, 0), "Ship-to Location*", bold=True)
    tbl_s1.cell(8, 1).text = ""; set_cell_background(tbl_s1.cell(8, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(8, 1), "Port of Japan")
    tbl_s1.cell(8, 2).text = ""; set_cell_background(tbl_s1.cell(8, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(8, 2), "Quantity*", bold=True)
    tbl_s1.cell(8, 3).text = ""; set_cell_background(tbl_s1.cell(8, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(8, 3), "5000 MT")

    # Row 9: Requested Delivery Date | 2026/12/15 | Requested Delivery Date | 2026/12/30
    tbl_s1.cell(9, 0).text = ""; set_cell_background(tbl_s1.cell(9, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(9, 0), "Requested Delivery Date", bold=True)
    tbl_s1.cell(9, 1).text = ""; set_cell_background(tbl_s1.cell(9, 1), COLOR_GREEN);  add_cell_content(tbl_s1.cell(9, 1), "2026/12/15")
    tbl_s1.cell(9, 2).text = ""; set_cell_background(tbl_s1.cell(9, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(9, 2), "Requested Delivery Date", bold=True)
    tbl_s1.cell(9, 3).text = ""; set_cell_background(tbl_s1.cell(9, 3), COLOR_GREEN);  add_cell_content(tbl_s1.cell(9, 3), "2026/12/30")

    # Row 10: Certificate Requirement | [ ■ ] SBP [ ■ ] GGL | Other Certificate |
    tbl_s1.cell(10, 0).text = ""; set_cell_background(tbl_s1.cell(10, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(10, 0), "Certificate Requirement", bold=True)
    tbl_s1.cell(10, 1).text = ""; set_cell_background(tbl_s1.cell(10, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(10, 1), "[ ■ ] SBP   [ ■ ] GGL")
    tbl_s1.cell(10, 2).text = ""; set_cell_background(tbl_s1.cell(10, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(10, 2), "Other Certificate", bold=True)
    tbl_s1.cell(10, 3).text = ""; set_cell_background(tbl_s1.cell(10, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(10, 3), "")

    # Row 11: Customer Requirement: spans 3 cols
    tbl_s1.cell(11, 0).text = ""; set_cell_background(tbl_s1.cell(11, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(11, 0), "Customer Requirement:", bold=True)
    c_cr = tbl_s1.cell(11, 1); c_cr.merge(tbl_s1.cell(11, 2)); c_cr.merge(tbl_s1.cell(11, 3))
    set_cell_background(c_cr, COLOR_WHITE); add_cell_content(c_cr, "ตัวอย่าง (Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection)")

    # Row 12: Special Requirement: spans 3 cols
    tbl_s1.cell(12, 0).text = ""; set_cell_background(tbl_s1.cell(12, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(12, 0), "Special Requirement:", bold=True)
    c_sr = tbl_s1.cell(12, 1); c_sr.merge(tbl_s1.cell(12, 2)); c_sr.merge(tbl_s1.cell(12, 3))
    set_cell_background(c_sr, COLOR_WHITE); add_cell_content(c_sr, "ตัวอย่าง (ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection, etc.)")

    # Row 13: Sub-header "Planning"
    c_pl = tbl_s1.cell(13, 0); c_pl.merge(tbl_s1.cell(13, 1)); c_pl.merge(tbl_s1.cell(13, 2)); c_pl.merge(tbl_s1.cell(13, 3))
    set_cell_background(c_pl, COLOR_YELLOW); add_cell_content(c_pl, "Planning", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 14: PI NO.* | PO-ABC-2026-001 | MO No.* | MP202600XX
    tbl_s1.cell(14, 0).text = ""; set_cell_background(tbl_s1.cell(14, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(14, 0), "PI NO.*", bold=True)
    tbl_s1.cell(14, 1).text = ""; set_cell_background(tbl_s1.cell(14, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(14, 1), "PO-ABC-2026-001")
    tbl_s1.cell(14, 2).text = ""; set_cell_background(tbl_s1.cell(14, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(14, 2), "MO No.*", bold=True, color_rgb=(220,38,38))
    tbl_s1.cell(14, 3).text = ""; set_cell_background(tbl_s1.cell(14, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(14, 3), "MP202600XX", color_rgb=(220,38,38))

    # Row 15: Plan Date start* | 2026/09/28 | Plan Date Finish * | 2026/09/30
    tbl_s1.cell(15, 0).text = ""; set_cell_background(tbl_s1.cell(15, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(15, 0), "Plan Date start*", bold=True)
    tbl_s1.cell(15, 1).text = ""; set_cell_background(tbl_s1.cell(15, 1), COLOR_GREEN);  add_cell_content(tbl_s1.cell(15, 1), "2026/09/28")
    tbl_s1.cell(15, 2).text = ""; set_cell_background(tbl_s1.cell(15, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(15, 2), "Plan Date Finish *", bold=True)
    tbl_s1.cell(15, 3).text = ""; set_cell_background(tbl_s1.cell(15, 3), COLOR_GREEN);  add_cell_content(tbl_s1.cell(15, 3), "2026/09/30")

    # Row 16: Production Batch* | SBP-xx-YY-02-3003 | Production Description* | Rubber wood pellets
    tbl_s1.cell(16, 0).text = ""; set_cell_background(tbl_s1.cell(16, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(16, 0), "Production Batch*", bold=True)
    tbl_s1.cell(16, 1).text = ""; set_cell_background(tbl_s1.cell(16, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(16, 1), "SBP-xx-YY-02-3003")
    tbl_s1.cell(16, 2).text = ""; set_cell_background(tbl_s1.cell(16, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(16, 2), "Production Description*", bold=True)
    tbl_s1.cell(16, 3).text = ""; set_cell_background(tbl_s1.cell(16, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(16, 3), "Rubber wood pellets")

    # Row 17: Certificate Scheme:* | [ ■ ] SBP [ ■ ] GGL | Product Code* | Bwp.12-08
    tbl_s1.cell(17, 0).text = ""; set_cell_background(tbl_s1.cell(17, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(17, 0), "Certificate Scheme:*", bold=True)
    tbl_s1.cell(17, 1).text = ""; set_cell_background(tbl_s1.cell(17, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(17, 1), "[ ■ ] SBP    [ ■ ] GGL")
    tbl_s1.cell(17, 2).text = ""; set_cell_background(tbl_s1.cell(17, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(17, 2), "Product Code*", bold=True)
    tbl_s1.cell(17, 3).text = ""; set_cell_background(tbl_s1.cell(17, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(17, 3), "Bwp.12-08")

    # Row 18: Volume* | 5,000 MT (spans across)
    tbl_s1.cell(18, 0).text = ""; set_cell_background(tbl_s1.cell(18, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(18, 0), "Volume*", bold=True)
    c_vol = tbl_s1.cell(18, 1); c_vol.merge(tbl_s1.cell(18, 2)); c_vol.merge(tbl_s1.cell(18, 3))
    set_cell_background(c_vol, COLOR_WHITE); add_cell_content(c_vol, "5,000 MT")

    for r in tbl_s1.rows:
        for c in r.cells: set_cell_margins(c, 40, 40, 60, 60)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # 2. FILL FORM FIELDS: 2.1 M-TABLE-SCHEMA (STARTING FROM JUSTIFICATION)
    # -----------------------------------------------------------------
    p_m_lbl = doc.add_paragraph()
    r_ml = p_m_lbl.add_run("2. Fill form fields\n2.1 M-Table-Schema")
    r_ml.bold = True
    r_ml.font.name = "Times New Roman"
    r_ml.font.size = Pt(11)
    p_m_lbl.paragraph_format.space_after = Pt(2)

    # We will build M-Table-Schema starting from System Fields down to Justification,
    # and then insert all Fields from Step 1 to Step 8 categorized with clean colors!
    m_widths = [Inches(1.4), Inches(1.3), Inches(0.65), Inches(0.85), Inches(0.35), Inches(0.6), Inches(0.8), Inches(1.22)]

    # 15 Base System Rows
    base_rows = [
        ("FillerID", "Applicant", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("FillerName", "Applicant", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("FillerDept", "Applicant Department", "", "Nvarchar(100)", "", "Filler", "BPM", "Same as development SOP"),
        ("FillerDeptName", "Applicant Department", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("ApplicantID", "Requestor", "select", "Nvarchar(100)", "V", "", "BPM", "Same as development SOP"),
        ("ApplicantName", "Requestor", "", "Nvarchar(100)", "", "", "BPM", "Same as development SOP"),
        ("ApplicantDept", "Requestor Department", "", "Nvarchar(100)", "", "FillerDept", "BPM", "Same as development SOP"),
        ("ApplicantDeptName", "Requestor Department", "", "Nvarchar(100)", "", "", "", "Same as development SOP"),
        ("ApplicantTitleID", "Requestor Title", "", "Nvarchar(100)", "", "FillerTitle", "", "Same as development SOP"),
        ("ApplicantTitle", "Requestor Title", "", "Nvarchar(100)", "", "", "", "Same as development SOP"),
        ("Importance", "Importance", "Radio", "Varchar(4)", "", "Normal", "", "Same as development SOP"),
        ("CompanyCode", "Company", "select", "Nvarchar(10)", "V", "", "BPM", "Same as development SOP"),
        ("CompanyName", "Company", "", "Nvarchar(100)", "", "", "", "Same as development SOP"),
        ("CompanyIDshort", "Purpose/Reason for Working at Home", "", "Nvarchar(100)", "", "", "", "Same as development SOP"),
        ("Justification", "Justification", "", "Nvarchar(255)", "", "", "", "Same as development SOP")
    ]

    # Dynamic Field Rows Categorized by Step 1 to Step 8
    step_sections = [
        ("--- 1. Sale Department & Planning Fields ---", [
            ("sale_customer_code", "Customer Code", "Text", "Nvarchar(20)", "V", "", "ERP", "Customer code e.g. 02545"),
            ("sale_customer_name", "Customer Name", "Text", "Nvarchar(255)", "V", "", "ERP", "Customer company name"),
            ("sale_po_no", "PO No.", "Text", "Nvarchar(50)", "V", "", "Sale", "Customer Purchase Order No."),
            ("sale_order_no", "Order No.", "Text", "Nvarchar(100)", "v", "", "BPM", "System generated order no."),
            ("sale_from_country", "From country", "Select", "Nvarchar(50)", "V", "US", "Master Country", "Origin/Destination country"),
            ("sale_address", "Address", "Textarea", "Nvarchar(255)", "", "", "Sale", "Customer address"),
            ("sale_contact_person", "Contact Person", "Text", "Nvarchar(100)", "", "", "Sale", "Contact person name"),
            ("sale_email_tel", "Email / Telephone", "Text", "Nvarchar(150)", "", "", "Sale", "Email and phone contact"),
            ("sale_customer_po_no", "Customer PO No", "Text", "Nvarchar(50)", "", "", "Sale", "PO-ABC-2026-001"),
            ("sale_pi_no", "PI NO.", "Text", "Nvarchar(50)", "V", "", "Sale", "Proforma Invoice No."),
            ("sale_product_code", "Product Code", "Select", "Nvarchar(150)", "V", "WP-001", "Item Master", "Wood Pellets item code"),
            ("sale_product_name", "Product Name", "Text", "Navarchar(255)", "v", "Wood Pellets", "Item Master", "Product commercial name"),
            ("sale_product_type", "Product Type", "Select", "Nvarchar(100)", "v", "", "Master Type", "1. 0.6mm±1mm, 2. 0.8mm±1mm"),
            ("sale_ship_to", "Ship-to Location", "Text", "Nvarchar(150)", "v", "", "Master Port", "Port of Japan / Discharge port"),
            ("sale_quantity", "Quantity", "Number", "int / decimal", "v", "5000", "Sale", "Order volume in MT / kg"),
            ("sale_delivery_date_req", "Requested Delivery Date", "Date", "date", "v", "", "Sale", "Customer requested date"),
            ("sale_delivery_date_target", "Requested Delivery Date target", "Date", "date", "v", "", "Sale", "Delivery completion target"),
            ("sale_certificate_req", "Certificate Requirement", "Multi select", "Nvarchar(100)", "v", "", "grh_V_combo", "SPB, GGL multi-select"),
            ("sale_other_certificate", "Other Certificate", "Text", "Nvarchar(150)", "", "", "Sale", "Other international certs"),
            ("sale_customer_req", "Customer Requirement", "Textarea", "Nvarchar(MAX)", "v", "", "Sale", "11 Customer specs criteria"),
            ("sale_special_req", "Special Requirement", "Textarea", "Nvarchar(MAX)", "v", "", "Sale", "9 Special handling requirements"),
            ("plan_pi_no", "PI NO. (Planning)", "Text", "Nvarchar(50)", "v", "", "Sale", "Reference sale PI"),
            ("plan_mo_no", "MO No. (Planning)", "Text", "Nvarchar(50)", "v", "", "BPM", "Manufacturing order MP202600XX"),
            ("plan_date_start", "Plan Date start", "Date", "Date", "v", "", "Planning", "Production plan start date"),
            ("plan_date_finish", "Plan Date Finish", "Date", "Date", "v", "", "Planning", "Production plan finish date"),
            ("plan_prod_batch", "Production Batch", "Text", "Nvarchar(100)", "v", "", "Planning", "Batch SBP-xx-YY-02-3003"),
            ("plan_prod_desc", "Production Description", "Text", "Nvarchar(255)", "v", "Rubber wood pellets", "Planning", "Pellet specification desc"),
            ("plan_cert_scheme", "Certificate Scheme", "Multi select", "Nvarchar(100)", "v", "", "Planning", "SPB, GGL multi-select"),
            ("plan_product_code", "Product Code (Planning)", "Text", "Nvarchar(100)", "v", "Bwp.12-08", "Planning", "Internal grade code"),
            ("plan_volume", "Volume", "Text", "Nvarchar(50)", "v", "5,000 MT", "Planning", "Allocated planning volume")
        ]),
        ("--- 2. RA — Regulatory / Requirement Fields ---", [
            ("ra_RegulatoryCertificateStatus", "Regulatory Certificate Status", "Text", "Nvarchar(150)", "v", "", "RA", "Certificate validity status"),
            ("ra_cert_status", "Certificate Status", "Text", "Nvarchar(100)", "v", "APPROVED & VALID", "RA", "Status valid through 2028"),
            ("ra_license_expired", "License / Permit expired", "Date", "Nvarchar(150)", "v", "2027-09-30", "RA", "Export permit expiration date"),
            ("ra_specification_req", "Specification Requirement", "Textarea", "Nvarchar(255)", "v", "", "RA", "EN 10204 3.1 & Material certs"),
            ("ra_label_req", "Label Requirement", "Textarea", "Nvarchar(255)", "v", "", "RA", "QR-Code Barcode Label 100x150"),
            ("ra_packaging_req", "Packaging Requirement", "Textarea", "Nvarchar(255)", "v", "", "RA", "VCI Anti-Corrosion Vacuum Sealed"),
            ("ra_regulatory_req", "Customer Regulatory Requirement", "Textarea", "Nvarchar(255)", "v", "", "RA", "RoHS 3, REACH, EUDR compliance"),
            ("ra_transport_Expired_Date", "Transportation Expiry Date", "Date", "Nvarchar(150)", "v", "2027-03-31", "RA", "Active transport permit"),
            ("ra_mo_latitude", "Latitude", "Decimal/Text", "Nvarchar(50)", "v", "", "GPS", "Plantation / Mill latitude"),
            ("ra_mo_longitude", "Longitude", "Decimal/Text", "Nvarchar(50)", "v", "", "GPS", "Plantation / Mill longitude"),
            ("ra_info_supplier", "Information Supplier", "File/Attachment", "Nvarchar(255)", "v", "", "PU/RA", "Title deed, SD, Lands map, DF/LC")
        ]),
        ("--- 3. Production — Woods material planning Fields ---", [
            ("prod_planned_qty", "Planned Quantity", "Number", "Nvarchar(50)", "v", "20,000 Ton", "Planning", "Planned production volume"),
            ("prod_actual_qty", "Actual Quantity", "Number", "Nvarchar(50)", "v", "15,000 Ton", "Factory", "Actual milled quantity"),
            ("prod_pl_yield", "Yield", "Number", "int", "v", "90000 Ton", "Factory", "Total yield produced"),
            ("prod_total_uptime", "Total Uptime", "Number", "Nvarchar(50)", "v", "5760 mins.", "Factory", "Machine operation minutes"),
            ("prod_pl_total_downtime", "Total Downtime", "Number", "Nvarchar(10)", "v", "40 mins.", "Factory", "Downtime minutes"),
            ("prod_statDate", "Production Start Date Time", "DateTime", "Date", "v", "", "Factory", "Run start timestamp"),
            ("prod_finishDate", "Production Finish Date time", "DateTime", "Date", "v", "", "Factory", "Run finish timestamp"),
            ("prod_material_code", "Material Code", "Text", "Nvarchar(150)", "v", "BWP-11-08 / BWP-12-08", "Factory", "Raw material batch code"),
            ("prod_plant_supervisor", "Plant Supervisor", "Text", "Nvarchar(100)", "v", "Operations Lead", "Factory", "In-charge supervisor"),
            ("prod_rawMaterail_reg", "Raw Material Requirement", "Multi select", "Nvarchar(100)", "v", "", "grh_V_combo", "Log, Slab, Sawdust amount"),
            ("prod_pl_production_issue", "Production Issue", "Textarea", "Nvarchar(255)", "v", "", "Factory", "Breakdown / dryness issues"),
            ("prod_fac1_status_util", "Factory 1 Status & Utilities", "Textarea", "Nvarchar(255)", "v", "", "Factory", "Fuels & Electricity units"),
            ("prod_fac2_status_util", "Factory 2 Status & Utilities", "Textarea", "Nvarchar(255)", "v", "", "Factory", "Fuels & Electricity units"),
            ("prod_machine_feed_lines", "Machine Feed Lines", "Multi select", "Nvarchar(100)", "v", "", "Factory", "Hammer mill, Flaker 3, Flaker 4")
        ]),
        ("--- 4. QC — In-line Quality Control Fields ---", [
            ("qc_batch_no", "Batch No.", "Text", "Nvarchar(50)", "v", "1-4", "QC", "Testing batch serial"),
            ("qc_test_date", "Test Date", "Date", "date", "v", "2026/10/10", "QC", "In-line test date"),
            ("qc_param_raw_logs_slab", "Parameter Raw material Logs & Slab", "Text", "Nvarchar(255)", "v", "", "QC", "Cleanliness & Moisture ≤70%"),
            ("qc_param_raw_sawdust", "Parameter Raw material Sawdust", "Text", "Nvarchar(255)", "v", "", "QC", "Moisture content ≤60%"),
            ("qc_param_chipper", "Parameter Chipper", "Text", "Nvarchar(255)", "v", "", "QC", "Moisture content ≤60%"),
            ("qc_param_after_dryer", "Parameter After dryer", "Text", "Nvarchar(255)", "v", "", "QC", "Moisture content ≤12 - 14%"),
            ("qc_param_after_magnetic", "Parameter After Magnetic separator", "Text", "Nvarchar(255)", "v", "", "QC", "Diameter & length verification"),
            ("qc_release_status", "Release Status (QC)", "Select", "Nvarchar(50)", "v", "Pass", "QC", "In-line release pass/hold")
        ]),
        ("--- 5. QA — Quality Assurance and Laboratory Fields ---", [
            ("qa_testDate", "Test Date", "Date", "date", "v", "2026/10/10", "QA", "Lab test date"),
            ("qa_param_raw_sawdust", "Parameter Raw material: Sawdust", "Text", "Nvarchar(100)", "v", "Moisture: 47%", "QA", "Lab oven moisture test"),
            ("qa_param_chipper", "Parameter Chipper", "Text", "Nvarchar(255)", "v", "", "QA", "Chips length, width, thickness"),
            ("qa_param_hammer_mill", "Parameter Hammer meal (Sieves)", "Text", "Nvarchar(255)", "v", "", "QA", "Sieves analysis sieve size"),
            ("qa_wood_pellets_magnetic", "Wood pellets After Magnetic separator", "Textarea", "Nvarchar(MAX)", "v", "", "QA", "Dia, Length, Moisture, Density, Ash, Durability"),
            ("qa_release_non_compliance", "Release Status & Non-compliance", "Select", "Nvarchar(100)", "v", "Pass", "QA", "Pass/Hold & SBP/GGL compliance"),
            ("qa_bulk_warehouses", "Bulk storage warehouses", "Textarea", "Nvarchar(255)", "v", "", "QA", "Warehouse moisture & bulk density"),
            ("qa_COA", "qa_COA", "File/Text", "Nvarchar(255)", "v", "", "QA", "Certificate of Analysis PDF"),
            ("qa_analyst", "qa_analyst", "Text", "Nvarchar(100)", "v", "Somchai P. / Lead QC", "QA", "Laboratory certified analyst"),
            ("qa_QC_Report", "qa_QC_Report", "Text", "Nvarchar(100)", "v", "", "QA", "Referenced TPC test report")
        ]),
        ("--- 6. Storage — Warehouse and Packing Fields ---", [
            ("wh_packingDailyReport", "Packing Daily Report", "Text", "Nvarchar(255)", "v", "", "Warehouse", "Daily packing log reference"),
            ("wh_packingDateStart_Finish", "Packing Date Start - Date Finish", "DateRange", "Date", "v", "", "Warehouse", "Packing operation period"),
            ("wh_packingMtdQties", "Packing Mtd Qties", "Number", "Nvarchar(100)", "v", "", "Warehouse", "Month-to-date packed quantity"),
            ("wh_bigBagLabelNo", "Big Bag label No.", "Text", "Nvarchar(150)", "v", "", "Warehouse", "Factory 1 & Factory 2 labels"),
            ("wh_selectionDateFrom_To", "Selection Date from - to", "DateRange", "Date", "v", "", "Warehouse", "Stock query date range"),
            ("wh_material", "Material", "Select", "Nvarchar(150)", "v", "BWP-11-08 / BWP-12-08", "Warehouse", "Inventory material grade"),
            ("wh_storageLocation", "Storage Location", "Select", "Nvarchar(50)", "v", "wearhouse1", "Warehouse", "Designated storage warehouse"),
            ("wh_openingStock", "Opening Stock", "Number", "Nvarchar(50)", "v", "1000 Ton", "Warehouse", "ยอดยกมา"),
            ("wh_totalReceiptQties", "Total receipt Qties", "Number", "Nvarchar(50)", "v", "500 Ton", "Warehouse", "จำนวนที่รับเข้า"),
            ("wh_totalIssueQties", "Total issue Qties", "Number", "Nvarchar(50)", "v", "300 Ton", "Warehouse", "จำนวนที่จ่ายออก"),
            ("wh_closingStock", "Closing stock", "Number", "Nvarchar(50)", "v", "1200 Ton", "Warehouse", "สินค้าคงเหลือยกไป")
        ]),
        ("--- 7. RA — Gather information (Post-Shipment Compliance Dossier) ---", [
            ("ra_post_ggl_fit_fip", "1.GGL (PDF) FIT/FIP", "File/Text", "Nvarchar(255)", "v", "", "RA", "Cover letter, TC, GeoJSON, Cleanliness"),
            ("ra_post_ggl_sde", "GGL SDE++", "File/Text", "Nvarchar(255)", "v", "", "RA", "SDE++ Transport & EUDR Data Sheet"),
            ("ra_post_sbp_eudr", "SBP / EUDR", "File/Text", "Nvarchar(255)", "v", "", "RA", "EUDR Data Sheet & GeoJSON upload"),
            ("ra_post_customer_complain", "Customer complain Issue", "Textarea", "Nvarchar(255)", "", "", "RA", "Export complain log resolution")
        ]),
        ("--- 8. Shipment — Shipping Fields ---", [
            ("ship_SA_number", "SA number", "Text", "Nvarchar(50)", "v", "SA-202610-03918-ISO", "Logistics", "Shipping advice identifier"),
            ("ship_customer_name", "Customer name", "Text", "Nvarchar(50)", "v", "Bnbm company", "Logistics", "Consignee customer name"),
            ("ship_POD", "POD", "Select", "Nvarchar(50)", "v", "ANTWERP", "Logistics", "Port of Discharge destination"),
            ("ship_Shipping_line", "Shipping line", "Select", "Nvarchar(50)", "v", "EVG", "Logistics", "Contracted shipping carrier"),
            ("ship_Booking_no", "Booking no", "Text", "Nvarchar(50)", "v", "09050012456", "Logistics", "Ocean freight carrier booking"),
            ("ship_Transit_time", "Transit time", "Text", "Nvarchar(50)", "v", "30 days", "Logistics", "Estimated voyage transit days"),
            ("ship_Loading_date", "Loading date", "Date", "Date", "v", "30/9/26", "Logistics", "Container / bulk loading date"),
            ("ship_Finished_date", "Finished date", "Date", "Date", "v", "07/9/26", "Logistics", "Loading completion date"),
            ("ship_ETD", "ETD", "Date", "Date", "v", "10/10/26", "Logistics", "Estimated departure timestamp"),
            ("ship_ETA", "ETA", "Date", "Date", "v", "10/11/26", "Logistics", "Estimated arrival timestamp"),
            ("ship_ATD", "ATD", "Date", "Date", "v", "11/10/26", "Logistics", "Actual departure timestamp")
        ])
    ]

    # Calculate total rows: 1 (Header) + 15 (Base) + 8 (Section Dividers) + sum(len of each section)
    total_field_rows = 1 + len(base_rows) + len(step_sections) + sum(len(fields) for _, fields in step_sections)
    
    tbl_m = doc.add_table(rows=total_field_rows, cols=8)
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

    # Insert 15 Base System Rows (Down to Justification)
    for b_data in base_rows:
        for c_idx, val in enumerate(b_data):
            c = tbl_m.cell(curr_row, c_idx)
            set_cell_margins(c, 35, 35, 50, 50)
            if c_idx == 0:
                set_cell_background(c, COLOR_YELLOW)
                add_cell_content(c, val, bold=True, font_size=8.0)
            else:
                set_cell_background(c, COLOR_WHITE)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(c, val, font_size=8.0, align=align)
        curr_row += 1

    # Insert Categorized Sections 1 to 8
    for sec_title, fields in step_sections:
        # Section Divider Row (Spans across all 8 columns with deeper yellow / clean theme)
        c_sec = tbl_m.cell(curr_row, 0)
        for i in range(1, 8):
            c_sec.merge(tbl_m.cell(curr_row, i))
        set_cell_background(c_sec, COLOR_SEC_BG)
        set_cell_margins(c_sec, 55, 55, 70, 70)
        add_cell_content(c_sec, sec_title, bold=True, font_size=9.0, align=WD_ALIGN_PARAGRAPH.LEFT)
        curr_row += 1

        # Fields in this section
        for f_data in fields:
            for c_idx, val in enumerate(f_data):
                c = tbl_m.cell(curr_row, c_idx)
                set_cell_margins(c, 35, 35, 50, 50)
                if c_idx == 0:
                    set_cell_background(c, COLOR_YELLOW)
                    add_cell_content(c, val, bold=True, font_size=8.0)
                elif c_idx == 4 and val.lower() == 'v':
                    set_cell_background(c, COLOR_GREEN) # Green highlight for required
                    add_cell_content(c, val, bold=True, font_size=8.0, align=WD_ALIGN_PARAGRAPH.CENTER)
                else:
                    set_cell_background(c, COLOR_WHITE)
                    align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
                    add_cell_content(c, val, font_size=8.0, align=align)
            curr_row += 1

    doc.add_page_break()

    # -----------------------------------------------------------------
    # SECTION 4: APPROVAL PROCESS & BRAND NEW FLOW CHART
    # -----------------------------------------------------------------
    p_ap = doc.add_paragraph()
    r = p_ap.add_run("4. Approval Process\n4.1 Process Diagram (New Flow Chart ครบ 8 ขั้นตอน)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_ap.paragraph_format.space_after = Pt(2)

    p_flow_desc = doc.add_paragraph()
    r = p_flow_desc.add_run("ผังกระบวนการอนุมัติและการปฏิบัติงานฉบับปรับปรุงใหม่ (Comprehensive Lifecycle Flow Chart) ครอบคลุมการทำงานแบบเรียลไทม์ตั้งแต่เริ่มคำสั่งซื้อ จนถึงการส่งออกและรวบรวมเอกสารรับรอง:")
    r.font.name = "Times New Roman"; r.font.size = Pt(9.0); r.font.color.rgb = RGBColor(71,85,105)

    # Visual Flow Diagram Table (8 Steps + Finish Box)
    tbl_diag = doc.add_table(rows=6, cols=5)
    set_table_borders(tbl_diag, COLOR_BORDER)
    tbl_diag.alignment = WD_TABLE_ALIGNMENT.CENTER
    flow_w = [Inches(1.4), Inches(0.4), Inches(1.4), Inches(0.4), Inches(1.4)]
    for r in tbl_diag.rows:
        for idx, w in enumerate(flow_w): r.cells[idx].width = w

    # Helper to style a step box
    def format_step_box(cell, step_no, step_name, owner_dept, action_text):
        set_cell_background(cell, COLOR_YELLOW)
        set_cell_margins(cell, 60, 60, 70, 70)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        
        r1 = p.add_run(f"[{step_no}]\n")
        r1.bold = True; r1.font.name = "Times New Roman"; r1.font.size = Pt(9.0); r1.font.color.rgb = RGBColor(180,83,9)
        
        r2 = p.add_run(f"{step_name}\n")
        r2.bold = True; r2.font.name = "Times New Roman"; r2.font.size = Pt(8.5); r2.font.color.rgb = RGBColor(0,0,0)
        
        r3 = p.add_run(f"({owner_dept})\n")
        r3.italic = True; r3.font.name = "Times New Roman"; r3.font.size = Pt(7.5); r3.font.color.rgb = RGBColor(71,85,105)
        
        r4 = p.add_run(f"➔ {action_text}")
        r4.bold = True; r4.font.name = "Times New Roman"; r4.font.size = Pt(7.5); r4.font.color.rgb = RGBColor(22,101,52)

    def format_arrow(cell, arrow_txt="🡺"):
        set_cell_background(cell, COLOR_WHITE)
        set_cell_margins(cell, 60, 60, 40, 40)
        p = cell.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(arrow_txt); r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(14); r.font.color.rgb = RGBColor(100,116,139)

    # Row 0: Step 1 -> Step 2 -> Step 3
    format_step_box(tbl_diag.cell(0, 0), "Step 1", "Sale Department", "ฝ่ายขาย", "Submit / Withdraw")
    format_arrow(tbl_diag.cell(0, 1), "🡺")
    format_step_box(tbl_diag.cell(0, 2), "Step 2", "RA Regulatory", "ฝ่ายกำกับดูแล", "Agree ➔ Next / Reject")
    format_arrow(tbl_diag.cell(0, 3), "🡺")
    format_step_box(tbl_diag.cell(0, 4), "Step 3", "Woods Planning", "ฝ่ายวางแผน", "Agree ➔ Next / Return")

    # Row 1: Vertical Connector down to Step 4
    for c in range(4):
        c_emp = tbl_diag.cell(1, c); set_cell_background(c_emp, COLOR_WHITE); c_emp.text = ""
    format_arrow(tbl_diag.cell(1, 4), "🡻")

    # Row 2: Step 6 <- Step 5 <- Step 4
    format_step_box(tbl_diag.cell(2, 4), "Step 4", "QC In-Line", "ฝ่าย QC หน้างาน", "5 จุดตรวจ ➔ Agree")
    format_arrow(tbl_diag.cell(2, 3), "🡸")
    format_step_box(tbl_diag.cell(2, 2), "Step 5", "QA Laboratory", "ฝ่าย QA Lab", "COA & Sieves ➔ Agree")
    format_arrow(tbl_diag.cell(2, 1), "🡸")
    format_step_box(tbl_diag.cell(2, 0), "Step 6", "Warehouse/Storage", "ฝ่ายคลังสินค้า", "Packing & Stock ➔ Agree")

    # Row 3: Vertical Connector down to Step 7
    format_arrow(tbl_diag.cell(3, 0), "🡻")
    for c in range(1, 5):
        c_emp = tbl_diag.cell(3, c); set_cell_background(c_emp, COLOR_WHITE); c_emp.text = ""

    # Row 4: Step 7 -> Step 8 -> FINISHED
    format_step_box(tbl_diag.cell(4, 0), "Step 7", "RA Gather Info", "ฝ่าย RA ส่ง Sale", "GGL, SBP Dossier ➔ Agree")
    format_arrow(tbl_diag.cell(4, 1), "🡺")
    format_step_box(tbl_diag.cell(4, 2), "Step 8", "Shipment / Logistics", "ฝ่ายขนส่ง", "Dispatch ➔ Complete")
    format_arrow(tbl_diag.cell(4, 3), "🡺")
    
    # Finish Box
    c_fin = tbl_diag.cell(4, 4)
    set_cell_background(c_fin, COLOR_GREEN)
    set_cell_margins(c_fin, 70, 70, 70, 70)
    p = c_fin.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f1 = p.add_run("FINISHED\n"); r_f1.bold = True; r_f1.font.size = Pt(11); r_f1.font.color.rgb = RGBColor(21,128,61)
    r_f2 = p.add_run("(Order Closed)"); r_f2.font.size = Pt(8.5); r_f2.font.color.rgb = RGBColor(15,23,42)

    # Row 5: Management Dashboard Note
    c_mgt = tbl_diag.cell(5, 0)
    for i in range(1, 5): c_mgt.merge(tbl_diag.cell(5, i))
    set_cell_background(c_mgt, "F1F5F9")
    set_cell_margins(c_mgt, 60, 60, 80, 80)
    p = c_mgt.paragraphs[0]; p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("📊 Management Dashboard: ผู้บริหารติดตาม Real-time KPI ทุกขั้นตอนผ่าน Dashboard โดยไม่ต้องกรอกข้อมูลปฏิบัติการ")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(8.5); r.font.color.rgb = RGBColor(30,41,59)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 4.2 Explanation of approval steps (New 8 Steps Table)
    p_ex_lbl = doc.add_paragraph()
    r = p_ex_lbl.add_run("4.2 Explanation of approval steps (คำอธิบายสิทธิ์และการปฏิบัติงานแต่ละขั้นตอน)")
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
            set_cell_margins(c, 45, 45, 65, 65)
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
    r_rem = p_rem.add_run("Remark:\n- During the approval process, form fields cannot be modified.\nIf any adjustments are required, the form will be rejected and returned to the requester for data modification.\nRequirement specification document\nIf there are any change requirements, a change request will be raised and handled separately.")
    r_rem.font.name = "Times New Roman"
    r_rem.font.size = Pt(8.5)
    r_rem.font.italic = True
    p_rem.paragraph_format.space_before = Pt(4)

    # -----------------------------------------------------------------
    # SAVE DOCUMENT TO TARGET PATHS
    # -----------------------------------------------------------------
    dest_dir = r"D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets"
    filename_primary = "WoodPellets_Full_Lifecycle_Spec_20261022.docx"
    filename_v2 = "WoodPellets_Full_Lifecycle_Spec_20261022_v2.docx"
    
    saved_paths = []

    # 1. Try Primary requested file
    primary_path = os.path.join(dest_dir, filename_primary)
    try:
        doc.save(primary_path)
        saved_paths.append(primary_path)
        print(f"1. Saved to Primary Path: {primary_path}")
    except PermissionError:
        print(f"1. Primary Path locked by Word. Saving as v2 instead...")
        v2_path = os.path.join(dest_dir, filename_v2)
        doc.save(v2_path)
        saved_paths.append(v2_path)
        print(f"1. Successfully saved to: {v2_path}")

    # 2. Save in Workspace
    ws_file = os.path.join(r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005", filename_primary)
    try:
        doc.save(ws_file)
        saved_paths.append(ws_file)
        print(f"2. Saved to Workspace: {ws_file}")
    except PermissionError:
        ws_file_v2 = os.path.join(r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005", filename_v2)
        doc.save(ws_file_v2)
        saved_paths.append(ws_file_v2)
        print(f"2. Saved to Workspace as: {ws_file_v2}")

    # 3. Save in IIS Path
    iis_file = os.path.join(r"D:\Inetpub\WWWRoot\BPM\wood_pellets", filename_primary)
    try:
        doc.save(iis_file)
        saved_paths.append(iis_file)
        print(f"3. Saved to IIS Path: {iis_file}")
    except Exception as e:
        print(f"IIS primary save note: {e}")
        try:
            iis_file_v2 = os.path.join(r"D:\Inetpub\WWWRoot\BPM\wood_pellets", filename_v2)
            doc.save(iis_file_v2)
            saved_paths.append(iis_file_v2)
            print(f"3. Saved to IIS as: {iis_file_v2}")
        except Exception as e2:
            print(f"IIS v2 note: {e2}")

    return saved_paths

if __name__ == "__main__":
    generate_doc()
