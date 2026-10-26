# -*- coding: utf-8 -*-
"""
Generate Complete Wood Pellets Full Lifecycle Specification Document (.docx)
Updated Structure:
Separating Sales into 2 Distinct Sections:
1. Sales — ข้อมูลคำสั่งซื้อ (Sales Order & Customer Requirements)
2. Planning (Order Production Planning & Batch Allocation)
Followed by:
3. RA — Regulatory / Requirement (Pre-production Due Diligence)
4. Production — Woods material planning (Factory Execution & Resources)
5. QC — ผลการตรวจสอบ (In-Line Process Inspection)
6. QA — ผลการตรวจสอบ (Final QA Lab Inspection & COA)
7. Storage — คลังสินค้า (Packing & Warehouse Inventory)
8. RA — รวบรวมข้อมูลส่ง Sales (Post-Shipment Compliance Dossier)
9. Shipment — การจัดส่ง (Logistics & Sea Freight Dispatch)
10. Management — ผู้บริหาร & Data Ownership Matrix

Color Theme:
- Label & Header Cells: #FFFECC (Yellow)
- General Input Cells: #FFFFFF (White)
- User Fillable Dates / Selection Status: #CFFFCE (Green)
- Black Single Borders: #000000
- Highlight Text: Red #DC2626
Destination: D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\WoodPellets_Full_Lifecycle_Spec_20261022.docx
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def build_full_lifecycle_document():
    doc = docx.Document()

    # Page Margins A4 Portrait
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(0.55)
        s.bottom_margin = Inches(0.55)
        s.left_margin = Inches(0.55)
        s.right_margin = Inches(0.55)

    COLOR_YELLOW = "FFFECC" # Label / header color
    COLOR_GREEN  = "CFFFCE" # User input date/status color
    COLOR_WHITE  = "FFFFFF" # Normal input color
    COLOR_BORDER = "000000" # Black single border

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=65, bottom=65, left=85, right=85):
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

    def add_cell_content(cell, text, bold=False, color_rgb=(0,0,0), font_size=9.0, align=WD_ALIGN_PARAGRAPH.LEFT, is_star_red=True):
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
    r_c = p_comp.add_run("Greenriverholding.com  —  Wood Pellets Form Complete Specification\nDocument version and modification remarks.")
    r_c.bold = True
    r_c.font.name = "Times New Roman"
    r_c.font.size = Pt(11)
    p_comp.paragraph_format.space_after = Pt(2)

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
        ["0.3", "2026/10/22", "Pa", "Added QC & QA separation, Full Lifecycle"],
        ["0.4", "2026/10/22", "Pa", "Separated Sale into: 1. Sales — ข้อมูลคำสั่งซื้อ and 2. Planning"]
    ]
    for r_idx, row in enumerate(tbl_ver.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 45, 45, 65, 65)
            set_cell_background(cell, COLOR_YELLOW if r_idx == 0 else COLOR_WHITE)
            add_cell_content(cell, v_data[r_idx][c_idx], bold=(r_idx==0), align=WD_ALIGN_PARAGRAPH.LEFT if c_idx==3 else WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -----------------------------------------------------------------
    # GENERAL BPM HEADER
    # -----------------------------------------------------------------
    tbl_head = doc.add_table(rows=5, cols=4)
    set_table_borders(tbl_head, COLOR_BORDER)
    tbl_head.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_head.rows:
        for idx, w in enumerate(w4):
            r.cells[idx].width = w

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
    # ส่วนที่ 1: 1. Sales — ข้อมูลคำสั่งซื้อ
    # -----------------------------------------------------------------
    p_s1 = doc.add_paragraph()
    r = p_s1.add_run("1. Sales — ข้อมูลคำสั่งซื้อ (ฝ่ายที่รับผิดชอบ: ฝ่ายขาย / Sales)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s1.paragraph_format.space_after = Pt(2)

    tbl_s1 = doc.add_table(rows=14, cols=4)
    set_table_borders(tbl_s1, COLOR_BORDER)
    tbl_s1.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_s1.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_s0 = tbl_s1.cell(0, 0)
    for i in range(1, 4): c_s0.merge(tbl_s1.cell(0, i))
    set_cell_background(c_s0, COLOR_YELLOW)
    add_cell_content(c_s0, "1. Sales — ข้อมูลคำสั่งซื้อ และข้อกำหนดลูกค้า", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 1-7: Order & Customer Details
    s1_rows = [
        [("Customer Code *", COLOR_YELLOW), ("CUS- 001", COLOR_WHITE), ("Customer Name *", COLOR_YELLOW), ("ABC Biomass Energy CO.,LTD", COLOR_WHITE)],
        [("country", COLOR_YELLOW), ("xxxxx", COLOR_WHITE), ("Address", COLOR_YELLOW), ("xxxxxx", COLOR_WHITE)],
        [("Contact Person", COLOR_YELLOW), ("Thomason (ไม่บังคับ)", COLOR_WHITE), ("Email /Telephone", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE)],
        [("Customer PO No.", COLOR_YELLOW), ("PO-ABC-2026-001 (ไม่บังคับ)", COLOR_WHITE), ("PI NO. *", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE)],
        [("Product Code *", COLOR_YELLOW), ("WP-001", COLOR_WHITE), ("Product Name *", COLOR_YELLOW), ("Wood Pellets", COLOR_WHITE)],
        [("Product Type *", COLOR_YELLOW), ("1.  0.6mm± 1 mm, 2.  0.8mm ± 1 mm", COLOR_WHITE), ("Quantity *", COLOR_YELLOW), ("5,000", COLOR_WHITE)],
        [("Unit *", COLOR_YELLOW), ("MT (metric tons ), kg.", COLOR_WHITE), ("Ship-to Location *", COLOR_YELLOW), ("Port of Japan", COLOR_WHITE)]
    ]
    for row_idx, r_info in enumerate(s1_rows, start=1):
        for col_idx in range(4):
            c = tbl_s1.cell(row_idx, col_idx)
            set_cell_background(c, r_info[col_idx][1])
            add_cell_content(c, r_info[col_idx][0], bold=(r_info[col_idx][1]==COLOR_YELLOW))

    # Row 8: Requested Delivery Date & Certificate Requirement
    tbl_s1.cell(8, 0).text = ""; set_cell_background(tbl_s1.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(8, 0), "Requested Delivery Date*", bold=True)
    tbl_s1.cell(8, 1).text = ""; set_cell_background(tbl_s1.cell(8, 1), COLOR_GREEN);  add_cell_content(tbl_s1.cell(8, 1), "30/11/2026")
    tbl_s1.cell(8, 2).text = ""; set_cell_background(tbl_s1.cell(8, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(8, 2), "Certificate Requirement *", bold=True)
    tbl_s1.cell(8, 3).text = ""; set_cell_background(tbl_s1.cell(8, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(8, 3), "SPB, GGL (ทำเป็นตัวเลือกให้เลือกได้ 2 อันขึ้นไป)")

    # Row 9: Customer Requirement (Merged across 3 cols)
    tbl_s1.cell(9, 0).text = ""; set_cell_background(tbl_s1.cell(9, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(9, 0), "Customer Requirement *", bold=True)
    c_cr = tbl_s1.cell(9, 1); c_cr.merge(tbl_s1.cell(9, 2)); c_cr.merge(tbl_s1.cell(9, 3))
    set_cell_background(c_cr, COLOR_WHITE); add_cell_content(c_cr, "ตัวอย่าง (Rubberwood, Pellet Diameter 0.6mm±1mm, Moisture ≤10%, Ash ≤3%, Calorie ≥4,000 kcal/kg, Density ≥600 kg/m³, Fines ≤1%, Bulk Shipment, COA, Inspection)")

    # Row 10: Special Requirement (Merged across 3 cols)
    tbl_s1.cell(10, 0).text = ""; set_cell_background(tbl_s1.cell(10, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(10, 0), "Special Requirement *", bold=True)
    c_sr = tbl_s1.cell(10, 1); c_sr.merge(tbl_s1.cell(10, 2)); c_sr.merge(tbl_s1.cell(10, 3))
    set_cell_background(c_sr, COLOR_WHITE); add_cell_content(c_sr, "ตัวอย่าง (ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด, Moisture ≤8%, ตรวจทุก Batch, ส่ง COA ก่อนโหลด, Weather Protection, etc.)")

    # Row 11: Other Special Requirement & Customer complain
    tbl_s1.cell(11, 0).text = ""; set_cell_background(tbl_s1.cell(11, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(11, 0), "Other Special Requirement", bold=True)
    tbl_s1.cell(11, 1).text = ""; set_cell_background(tbl_s1.cell(11, 1), COLOR_WHITE);  add_cell_content(tbl_s1.cell(11, 1), "XXXXXXX")
    tbl_s1.cell(11, 2).text = ""; set_cell_background(tbl_s1.cell(11, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(11, 2), "Customer complain", bold=True)
    tbl_s1.cell(11, 3).text = ""; set_cell_background(tbl_s1.cell(11, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(11, 3), "XXXXXXX")

    # Row 12: Status Customer complain (GREEN) & Policy
    tbl_s1.cell(12, 0).text = ""; set_cell_background(tbl_s1.cell(12, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(12, 0), "Status Customer complain", bold=True)
    tbl_s1.cell(12, 1).text = ""; set_cell_background(tbl_s1.cell(12, 1), COLOR_GREEN);  add_cell_content(tbl_s1.cell(12, 1), "open or close")
    tbl_s1.cell(12, 2).text = ""; set_cell_background(tbl_s1.cell(12, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(12, 2), "Sale Revision Policy", bold=True)
    tbl_s1.cell(12, 3).text = ""; set_cell_background(tbl_s1.cell(12, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(12, 3), "****(sale สามารถเปลี่ยนแปลงข้อมูลได้ทุก vender ระหว่างการผลิต) ****", color_rgb=(180,83,9))

    # Row 13: Order Status & Sales Officer
    tbl_s1.cell(13, 0).text = ""; set_cell_background(tbl_s1.cell(13, 0), COLOR_YELLOW); add_cell_content(tbl_s1.cell(13, 0), "Sales Order Status *", bold=True)
    tbl_s1.cell(13, 1).text = ""; set_cell_background(tbl_s1.cell(13, 1), COLOR_GREEN);  add_cell_content(tbl_s1.cell(13, 1), "Confirmed & Submitted")
    tbl_s1.cell(13, 2).text = ""; set_cell_background(tbl_s1.cell(13, 2), COLOR_YELLOW); add_cell_content(tbl_s1.cell(13, 2), "Sales Responsible Officer", bold=True)
    tbl_s1.cell(13, 3).text = ""; set_cell_background(tbl_s1.cell(13, 3), COLOR_WHITE);  add_cell_content(tbl_s1.cell(13, 3), "Sales Account Manager")

    for r in tbl_s1.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Sub-tables: Customer Requirement 11 Items & Special Requirement 9 Items
    p_cr = doc.add_paragraph()
    r = p_cr.add_run("Customer Requirement: ตัวอย่าง (11 รายการ) & Special Requirement: ตัวอย่าง (9 รายการ)")
    r.bold = True; r.font.name = "Times New Roman"; r.font.size = Pt(9.5)
    p_cr.paragraph_format.space_after = Pt(2)

    tbl_reqs = doc.add_table(rows=12, cols=4)
    set_table_borders(tbl_reqs, COLOR_BORDER)
    tbl_reqs.alignment = WD_TABLE_ALIGNMENT.CENTER
    rw = [Inches(1.5), Inches(2.1), Inches(1.5), Inches(2.07)]
    for r in tbl_reqs.rows:
        for idx, w in enumerate(rw): r.cells[idx].width = w

    tbl_reqs.cell(0, 0).text = ""; set_cell_background(tbl_reqs.cell(0, 0), COLOR_YELLOW); add_cell_content(tbl_reqs.cell(0, 0), "Topic", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_reqs.cell(0, 1).text = ""; set_cell_background(tbl_reqs.cell(0, 1), COLOR_YELLOW); add_cell_content(tbl_reqs.cell(0, 1), "Detail (Customer Requirement)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_reqs.cell(0, 2).text = ""; set_cell_background(tbl_reqs.cell(0, 2), COLOR_YELLOW); add_cell_content(tbl_reqs.cell(0, 2), "No. & Special Req", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_reqs.cell(0, 3).text = ""; set_cell_background(tbl_reqs.cell(0, 3), COLOR_YELLOW); add_cell_content(tbl_reqs.cell(0, 3), "รายละเอียดข้อกำหนดพิเศษ", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    req_pairs = [
        ("Raw Material", "Rubberwood", "1. Moisture Control", "ความชื้นต้องไม่เกิน 8%"),
        ("Pellet Diameter", "0.6mm± 1 mm", "2. Quality Inspection", "ต้องตรวจสอบคุณภาพทุก Batch"),
        ("Moisture Content", "≤ 10%", "3. COA Approval", "ต้องส่ง COA ให้ลูกค้าตรวจสอบก่อนโหลดสินค้า"),
        ("Ash Content", "≤ 3%", "4. Raw Material Control", "ใช้วัตถุดิบตามแหล่งและประเภทที่ลูกค้าอนุมัติ"),
        ("Net Calorific Value", "≥ 4,000 kcal/kg", "5. Product Contamination", "ต้องไม่มีสิ่งแปลกปลอมที่ไม่เป็นไปตามข้อกำหนด"),
        ("Bulk Density", "≥ 600 kg/m³", "6. Pellet Durability", "ต้องมีความทนทานของเม็ดตามค่าที่ลูกค้ากำหนด"),
        ("Fines Content", "≤ 1%", "7. Shipment Inspection", "ต้องตรวจสอบสินค้าก่อนเริ่มโหลดขึ้นเรือ"),
        ("Packaging", "Bulk Shipment", "8. Weather Protection", "ต้องป้องกันสินค้าเปียกฝนระหว่างจัดเก็บ/ขนส่ง"),
        ("Quality Certificate", "Certificate of Analysis (COA)", "9. Shipment Documents", "ต้องส่งเอกสารตามรายการที่ลูกค้ากำหนด"),
        ("Inspection", "Pre-shipment Inspection", "Customer Complain", "Open / Close (sale เปลี่ยนแปลงข้อมูลได้)"),
        ("Required Documents", "Commercial Invoice, Packing List, COA, B/L", "Special Action", "ต้องแจ้งลูกค้าหากคุณภาพไม่เป็นไปตามข้อกำหนด")
    ]
    for r_idx, (t1, d1, t2, d2) in enumerate(req_pairs, start=1):
        c0 = tbl_reqs.cell(r_idx, 0); set_cell_background(c0, COLOR_YELLOW); add_cell_content(c0, t1, bold=True)
        c1 = tbl_reqs.cell(r_idx, 1); set_cell_background(c1, COLOR_WHITE);  add_cell_content(c1, d1)
        c2 = tbl_reqs.cell(r_idx, 2); set_cell_background(c2, COLOR_YELLOW); add_cell_content(c2, t2, bold=True)
        c3 = tbl_reqs.cell(r_idx, 3); set_cell_background(c3, COLOR_WHITE);  add_cell_content(c3, d2)

    for r in tbl_reqs.rows:
        for c in r.cells: set_cell_margins(c, 35, 35, 55, 55)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # ส่วนที่ 2: 2. Planning (Order Planning & Batch Assignment)
    # -----------------------------------------------------------------
    p_s2 = doc.add_paragraph()
    r = p_s2.add_run("2. Planning (ฝ่ายที่รับผิดชอบ: ฝ่ายวางแผนการผลิต / Planning Dept)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(11)
    p_s2.paragraph_format.space_after = Pt(2)

    tbl_pl2 = doc.add_table(rows=6, cols=4)
    set_table_borders(tbl_pl2, COLOR_BORDER)
    tbl_pl2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_pl2.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_pl2_0 = tbl_pl2.cell(0, 0)
    for i in range(1, 4): c_pl2_0.merge(tbl_pl2.cell(0, i))
    set_cell_background(c_pl2_0, COLOR_YELLOW)
    add_cell_content(c_pl2_0, "2. Planning — การวางแผนคำสั่งซื้อ กำหนดล็อต และสเปกการผลิต", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    pl2_data = [
        [("*PI NO.:", COLOR_YELLOW), ("PO-ABC-2026-001", COLOR_WHITE), ("*MO No.:", COLOR_YELLOW, (220,38,38)), ("MP202600XX", COLOR_WHITE, (220,38,38))],
        [("*Plan Date start", COLOR_YELLOW), ("2026/09/28", COLOR_GREEN), ("*Plan Date Finish", COLOR_YELLOW), ("2026/09/30", COLOR_GREEN)],
        [("*Production Batch:", COLOR_YELLOW), ("SBP-xx-YY-02-3003", COLOR_WHITE), ("*Production Description:", COLOR_YELLOW), ("Rubber wood pellets", COLOR_WHITE)],
        [("*Certificate Scheme:", COLOR_YELLOW), ("SPB, GGL (ทำเป็นตัวเลือกให้เลือกได้ 2 อันขึ้นไป)", COLOR_WHITE), ("* Product Code :", COLOR_YELLOW), ("Bwp.12-08", COLOR_WHITE)],
        [("*Volume :", COLOR_YELLOW), ("5,000 MT", COLOR_WHITE), ("*Unit :", COLOR_YELLOW), ("MT (metric tons ), kg.", COLOR_WHITE)]
    ]
    for r_idx, r_info in enumerate(pl2_data, start=1):
        for col_idx in range(4):
            c = tbl_pl2.cell(r_idx, col_idx)
            info = r_info[col_idx]
            txt = info[0]; bg = info[1]; col = info[2] if len(info)>2 else (0,0,0)
            set_cell_background(c, bg); add_cell_content(c, txt, bold=(bg==COLOR_YELLOW), color_rgb=col)

    for r in tbl_pl2.rows:
        for c in r.cells: set_cell_margins(c, 50, 50, 70, 70)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 3. RA — REGULATORY / REQUIREMENT (PRE-PRODUCTION)
    # -----------------------------------------------------------------
    p_s3 = doc.add_paragraph()
    r = p_s3.add_run("3. RA — Regulatory / Requirement (ฝ่ายที่รับผิดชอบ: ฝ่ายกำกับและรับรอง / RA Dept)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s3.paragraph_format.space_after = Pt(2)

    tbl_ra = doc.add_table(rows=9, cols=4)
    set_table_borders(tbl_ra, COLOR_BORDER)
    tbl_ra.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_ra.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_ra0 = tbl_ra.cell(0, 0)
    for i in range(1, 4): c_ra0.merge(tbl_ra.cell(0, i))
    set_cell_background(c_ra0, COLOR_YELLOW)
    add_cell_content(c_ra0, "3. RA — Regulatory / Requirement (การตรวจสอบใบอนุญาตและเกณฑ์กำกับดูแลก่อนผลิต)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    ra_fields = [
        [("Regulatory Certificate Status *", COLOR_YELLOW), ("XXXXXXXXX", COLOR_WHITE), ("License / Permit  expired *", COLOR_YELLOW), ("2026/10/20", COLOR_GREEN)],
        [("Specification Requirement *", COLOR_YELLOW), ("XXXXXXXX", COLOR_WHITE), ("Transportation Expiry Date *", COLOR_YELLOW), ("2026/10/20", COLOR_GREEN)],
        [("Label Requirement *", COLOR_YELLOW), ("XXXXXXXXXXX", COLOR_WHITE), ("Packaging Requirement *", COLOR_YELLOW), ("XXXXXXXXXXX", COLOR_WHITE)],
        [("Customer Regulatory Requirement *", COLOR_YELLOW), ("XXXXX", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]
    for r_idx, r_info in enumerate(ra_fields[:3], start=1):
        for col_idx in range(4):
            c = tbl_ra.cell(r_idx, col_idx)
            txt = r_info[col_idx][0]; bg = r_info[col_idx][1]
            set_cell_background(c, bg); add_cell_content(c, txt, bold=(bg==COLOR_YELLOW))

    tbl_ra.cell(4, 0).text = ""; set_cell_background(tbl_ra.cell(4, 0), COLOR_YELLOW); add_cell_content(tbl_ra.cell(4, 0), "Customer Regulatory Req *", bold=True)
    c_crr = tbl_ra.cell(4, 1); c_crr.merge(tbl_ra.cell(4, 2)); c_crr.merge(tbl_ra.cell(4, 3))
    set_cell_background(c_crr, COLOR_WHITE); add_cell_content(c_crr, "XXXXX (EUDR Due Diligence Statement, SBP Standard 1 & 2, GGL)")

    tbl_ra.cell(5, 0).text = ""; set_cell_background(tbl_ra.cell(5, 0), COLOR_YELLOW); add_cell_content(tbl_ra.cell(5, 0), "Information Supplier *", bold=True)
    c_sup = tbl_ra.cell(5, 1); c_sup.merge(tbl_ra.cell(5, 2)); c_sup.merge(tbl_ra.cell(5, 3))
    set_cell_background(c_sup, COLOR_WHITE); add_cell_content(c_sup, "PU แนบเอกสาร: [ ■ ] Title deed     [ ■ ] Latitude & Longitude     [ ■ ] SD ทั้งหมด")

    tbl_ra.cell(6, 0).text = ""; set_cell_background(tbl_ra.cell(6, 0), COLOR_YELLOW); add_cell_content(tbl_ra.cell(6, 0), "ในกรณีที่เป็น GGL *", bold=True)
    c_ggl = tbl_ra.cell(6, 1); c_ggl.merge(tbl_ra.cell(6, 2)); c_ggl.merge(tbl_ra.cell(6, 3))
    set_cell_background(c_ggl, COLOR_WHITE); add_cell_content(c_ggl, "ต้องมีเอกสาร: Raw Material Statement | RA: Lands map แนบเอกสาร | Legal Compliance Checklist for Plantation Level แนบเอกสาร")

    tbl_ra.cell(7, 0).text = ""; set_cell_background(tbl_ra.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_ra.cell(7, 0), "Collect Information *", bold=True)
    c_coll = tbl_ra.cell(7, 1); c_coll.merge(tbl_ra.cell(7, 2)); c_coll.merge(tbl_ra.cell(7, 3))
    set_cell_background(c_coll, COLOR_WHITE); add_cell_content(c_coll, "[ ■ ] -Deforestation Free (DF)     [ ■ ] -Legality Verification (LC)")

    tbl_ra.cell(8, 0).text = ""; set_cell_background(tbl_ra.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_ra.cell(8, 0), "Status *", bold=True)
    tbl_ra.cell(8, 1).text = ""; set_cell_background(tbl_ra.cell(8, 1), COLOR_GREEN);  add_cell_content(tbl_ra.cell(8, 1), "Approval / Rejected")
    tbl_ra.cell(8, 2).text = ""; set_cell_background(tbl_ra.cell(8, 2), COLOR_YELLOW); add_cell_content(tbl_ra.cell(8, 2), "RA Inspector", bold=True)
    tbl_ra.cell(8, 3).text = ""; set_cell_background(tbl_ra.cell(8, 3), COLOR_WHITE);  add_cell_content(tbl_ra.cell(8, 3), "Lead RA Compliance Officer")

    for r in tbl_ra.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # 4. PRODUCTION — WOODS MATERIAL PLANNING (FACTORY OPERATIONS)
    # -----------------------------------------------------------------
    p_s4 = doc.add_paragraph()
    r = p_s4.add_run("4. Production — Woods material planning (ฝ่ายที่รับผิดชอบ: ฝ่ายวางแผนโรงงาน / Plant Production)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s4.paragraph_format.space_after = Pt(2)

    tbl_p4 = doc.add_table(rows=11, cols=4)
    set_table_borders(tbl_p4, COLOR_BORDER)
    tbl_p4.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_p4.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_p4_0 = tbl_p4.cell(0, 0)
    for i in range(1, 4): c_p4_0.merge(tbl_p4.cell(0, i))
    set_cell_background(c_p4_0, COLOR_YELLOW)
    add_cell_content(c_p4_0, "4. Production — Woods material planning & Factory Execution", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    p4_rows = [
        [("Planned Quantity *", COLOR_YELLOW), ("20,000 Ton", COLOR_WHITE), ("Actual Quantity *", COLOR_YELLOW), ("15,000 Ton", COLOR_WHITE)],
        [("Yield *", COLOR_YELLOW), ("90000 Ton", COLOR_WHITE), ("Production Status *", COLOR_YELLOW), ("Processing / Completed", COLOR_GREEN)],
        [("Total Uptime *", COLOR_YELLOW), ("5760 mins.", COLOR_WHITE), ("Total Downtime *", COLOR_YELLOW), ("40 mins.", COLOR_WHITE)],
        [("Production Start Date Time *", COLOR_YELLOW), ("2026/09/28  02:00", COLOR_GREEN), ("Production Finish Date time *", COLOR_YELLOW), ("2026/09/30 07:00", COLOR_GREEN)],
        [("Material Code *", COLOR_YELLOW), ("BWP-11-08 / BWP-12-08", COLOR_WHITE), ("Plant Supervisor", COLOR_YELLOW), ("Operations Lead", COLOR_WHITE)]
    ]
    for r_idx, r_info in enumerate(p4_rows, start=1):
        for col_idx in range(4):
            c = tbl_p4.cell(r_idx, col_idx)
            info = r_info[col_idx]
            set_cell_background(c, info[1]); add_cell_content(c, info[0], bold=(info[1]==COLOR_YELLOW))

    # Row 6: Raw Material Requirement (Log, Slab, Sawdust)
    tbl_p4.cell(6, 0).text = ""; set_cell_background(tbl_p4.cell(6, 0), COLOR_YELLOW); add_cell_content(tbl_p4.cell(6, 0), "Raw Material Requirement *", bold=True)
    c_rm = tbl_p4.cell(6, 1); c_rm.merge(tbl_p4.cell(6, 2)); c_rm.merge(tbl_p4.cell(6, 3))
    set_cell_background(c_rm, COLOR_WHITE); add_cell_content(c_rm, "Log amount: XX Ton.   |   Slab amount: XX Ton.   |   Sawdust amount: XX Ton.")

    # Row 7: Production Issue
    tbl_p4.cell(7, 0).text = ""; set_cell_background(tbl_p4.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_p4.cell(7, 0), "Production Issue *", bold=True)
    c_iss = tbl_p4.cell(7, 1); c_iss.merge(tbl_p4.cell(7, 2)); c_iss.merge(tbl_p4.cell(7, 3))
    set_cell_background(c_iss, COLOR_WHITE); add_cell_content(c_iss, "It couldn’t be pressed into solid bar because raw materials were too dry.")

    # Row 8: Factory 1 Utilities
    tbl_p4.cell(8, 0).text = ""; set_cell_background(tbl_p4.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_p4.cell(8, 0), "Factory 1 Status & Utilities", bold=True)
    c_f1 = tbl_p4.cell(8, 1); c_f1.merge(tbl_p4.cell(8, 2)); c_f1.merge(tbl_p4.cell(8, 3))
    set_cell_background(c_f1, COLOR_WHITE); add_cell_content(c_f1, "Status: Open | Downtime: 40 mins | Cause of downtime: Raw material dry\nFuels: xxx litters | Electricity: xxx units xxxx")

    # Row 9: Factory 2 Utilities
    tbl_p4.cell(9, 0).text = ""; set_cell_background(tbl_p4.cell(9, 0), COLOR_YELLOW); add_cell_content(tbl_p4.cell(9, 0), "Factory 2 Status & Utilities", bold=True)
    c_f2 = tbl_p4.cell(9, 1); c_f2.merge(tbl_p4.cell(9, 2)); c_f2.merge(tbl_p4.cell(9, 3))
    set_cell_background(c_f2, COLOR_WHITE); add_cell_content(c_f2, "Status: Open | Downtime: 0 mins | Cause of downtime: None\nFuels: xxx litters | Electricity: xxx units")

    # Row 10: Machine Ingestion Check
    tbl_p4.cell(10, 0).text = ""; set_cell_background(tbl_p4.cell(10, 0), COLOR_YELLOW); add_cell_content(tbl_p4.cell(10, 0), "Machine Feed Lines", bold=True)
    c_mf = tbl_p4.cell(10, 1); c_mf.merge(tbl_p4.cell(10, 2)); c_mf.merge(tbl_p4.cell(10, 3))
    set_cell_background(c_mf, COLOR_WHITE); add_cell_content(c_mf, "[ ■ ] Hammer mill       [ ■ ] Flaker 3       [ ■ ] Flaker 4")

    for r in tbl_p4.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 5. QC — ผลการตรวจสอบ (IN-LINE PROCESS INSPECTION)
    # -----------------------------------------------------------------
    p_s5 = doc.add_paragraph()
    r = p_s5.add_run("5. QC — ผลการตรวจสอบ (ฝ่ายที่รับผิดชอบ: เจ้าหน้าที่ตรวจสอบคุณภาพในกระบวนการ / In-line QC)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s5.paragraph_format.space_after = Pt(2)

    tbl_qc = doc.add_table(rows=8, cols=4)
    set_table_borders(tbl_qc, COLOR_BORDER)
    tbl_qc.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_qc.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_qc0 = tbl_qc.cell(0, 0)
    for i in range(1, 4): c_qc0.merge(tbl_qc.cell(0, i))
    set_cell_background(c_qc0, COLOR_YELLOW)
    add_cell_content(c_qc0, "5. QC — ผลการตรวจสอบกระบวนการผลิตหน้างาน (In-Line Quality Check 5 จุด)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    tbl_qc.cell(1, 0).text = ""; set_cell_background(tbl_qc.cell(1, 0), COLOR_YELLOW); add_cell_content(tbl_qc.cell(1, 0), "Batch No. *", bold=True)
    tbl_qc.cell(1, 1).text = ""; set_cell_background(tbl_qc.cell(1, 1), COLOR_WHITE);  add_cell_content(tbl_qc.cell(1, 1), "1-4")
    tbl_qc.cell(1, 2).text = ""; set_cell_background(tbl_qc.cell(1, 2), COLOR_YELLOW); add_cell_content(tbl_qc.cell(1, 2), "Test Date *", bold=True)
    tbl_qc.cell(1, 3).text = ""; set_cell_background(tbl_qc.cell(1, 3), COLOR_GREEN);  add_cell_content(tbl_qc.cell(1, 3), "2026/10/10")

    qc_params = [
        ("Parameter Raw material Logs & Slab", "Cleanliness (%): Refer wood spec | Moisture content (≤ 70%): 60%"),
        ("Parameter Raw material Sawdust", "Moisture content (≤ 60%): 64%"),
        ("Parameter Chipper", "Moisture content (≤ 60%): 64%"),
        ("Parameter After dryer", "Moisture content (≤12 - 14 %): 14%"),
        ("Parameter After Magnetic separator", "Diameter and length: Verified | Moisture content (≤12 - 14 %): 14%")
    ]
    for idx, (p_t, p_v) in enumerate(qc_params, start=2):
        tbl_qc.cell(idx, 0).text = ""; set_cell_background(tbl_qc.cell(idx, 0), COLOR_YELLOW); add_cell_content(tbl_qc.cell(idx, 0), p_t, bold=True)
        c_val = tbl_qc.cell(idx, 1); c_val.merge(tbl_qc.cell(idx, 2)); c_val.merge(tbl_qc.cell(idx, 3))
        set_cell_background(c_val, COLOR_WHITE); add_cell_content(c_val, p_v)

    tbl_qc.cell(7, 0).text = ""; set_cell_background(tbl_qc.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_qc.cell(7, 0), "Release Status *", bold=True)
    tbl_qc.cell(7, 1).text = ""; set_cell_background(tbl_qc.cell(7, 1), COLOR_GREEN);  add_cell_content(tbl_qc.cell(7, 1), "XXXXXXXXXXXXXXX (Pass / In-line Approved)")
    tbl_qc.cell(7, 2).text = ""; set_cell_background(tbl_qc.cell(7, 2), COLOR_YELLOW); add_cell_content(tbl_qc.cell(7, 2), "QC Shift Inspector", bold=True)
    tbl_qc.cell(7, 3).text = ""; set_cell_background(tbl_qc.cell(7, 3), COLOR_WHITE);  add_cell_content(tbl_qc.cell(7, 3), "Shift QC Inspector [Shift A]")

    for r in tbl_qc.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # 6. QA — ผลการตรวจสอบ (FINAL QA LAB & COA)
    # -----------------------------------------------------------------
    p_s6 = doc.add_paragraph()
    r = p_s6.add_run("6. QA — ผลการตรวจสอบ (ฝ่ายที่รับผิดชอบ: ฝ่ายประกันคุณภาพและห้องปฏิบัติการ / QA Lab)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s6.paragraph_format.space_after = Pt(2)

    tbl_qa = doc.add_table(rows=10, cols=4)
    set_table_borders(tbl_qa, COLOR_BORDER)
    tbl_qa.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_qa.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_qa0 = tbl_qa.cell(0, 0)
    for i in range(1, 4): c_qa0.merge(tbl_qa.cell(0, i))
    set_cell_background(c_qa0, COLOR_YELLOW)
    add_cell_content(c_qa0, "6. QA — ผลการตรวจสอบห้องแล็บและออกใบรับรอง (Final QA Lab & COA)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    tbl_qa.cell(1, 0).text = ""; set_cell_background(tbl_qa.cell(1, 0), COLOR_YELLOW); add_cell_content(tbl_qa.cell(1, 0), "Test Date *", bold=True)
    tbl_qa.cell(1, 1).text = ""; set_cell_background(tbl_qa.cell(1, 1), COLOR_GREEN);  add_cell_content(tbl_qa.cell(1, 1), "2026/10/10")
    tbl_qa.cell(1, 2).text = ""; set_cell_background(tbl_qa.cell(1, 2), COLOR_YELLOW); add_cell_content(tbl_qa.cell(1, 2), "Parameter Raw material: Sawdust", bold=True)
    tbl_qa.cell(1, 3).text = ""; set_cell_background(tbl_qa.cell(1, 3), COLOR_WHITE);  add_cell_content(tbl_qa.cell(1, 3), "Moisture xxx%: 47%")

    qa_details = [
        ("Parameter Chipper", "Chips length (30±10): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm"),
        ("Parameter Hammer meal (Sieves)", "Length (25±15): 30 mm | width (25±5): 25.5 mm | Thickness (≤8): 8 mm"),
        ("Wood pellets After Magnetic separator", "Diameter (8±1 mm): 8 mm | Length (25±15mm): 26 mm | Moisture content (<10%): 7 %\nBulk density (>600kg/m3): 600 kg/m3 | Fines below (> 1.0%): 1.0 %\nAsh content (<2%): 1.5% | Mechanical durability (> 97.5%): 97.5%"),
        ("Release Status & Non-compliance", "Release Status: Pass / Hold (Selected: Pass) | Non Compliance Quality: GGL, SBP"),
        ("Bulk storage warehouses", "Moisture content (20±10%): 27 % | Bulk density (>600kg/m3): 650 | Fines below (> 1.0): 1.0 %\nRelease Status: Pass / Hold (Selected: Pass)"),
        ("COA & Referenced Report", "COA: Customer’s requirements | Referenced TPC test report: xxxxxxx | Status: Pass / Fail")
    ]
    for idx, (p_t, p_v) in enumerate(qa_details, start=2):
        tbl_qa.cell(idx, 0).text = ""; set_cell_background(tbl_qa.cell(idx, 0), COLOR_YELLOW); add_cell_content(tbl_qa.cell(idx, 0), p_t, bold=True)
        c_v = tbl_qa.cell(idx, 1); c_v.merge(tbl_qa.cell(idx, 2)); c_v.merge(tbl_qa.cell(idx, 3))
        set_cell_background(c_v, COLOR_WHITE); add_cell_content(c_v, p_v)

    tbl_qa.cell(8, 0).text = ""; set_cell_background(tbl_qa.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_qa.cell(8, 0), "QA Analyst", bold=True)
    tbl_qa.cell(8, 1).text = ""; set_cell_background(tbl_qa.cell(8, 1), COLOR_WHITE);  add_cell_content(tbl_qa.cell(8, 1), "Somchai P. / Lead QC Inspector")
    tbl_qa.cell(8, 2).text = ""; set_cell_background(tbl_qa.cell(8, 2), COLOR_YELLOW); add_cell_content(tbl_qa.cell(8, 2), "QA Final Status *", bold=True)
    tbl_qa.cell(8, 3).text = ""; set_cell_background(tbl_qa.cell(8, 3), COLOR_GREEN);  add_cell_content(tbl_qa.cell(8, 3), "Pass (Zero Deviation)")

    tbl_qa.cell(9, 0).text = ""; set_cell_background(tbl_qa.cell(9, 0), COLOR_YELLOW); add_cell_content(tbl_qa.cell(9, 0), "Attached Certificate", bold=True)
    c_coa = tbl_qa.cell(9, 1); c_coa.merge(tbl_qa.cell(9, 2)); c_coa.merge(tbl_qa.cell(9, 3))
    set_cell_background(c_coa, COLOR_WHITE); add_cell_content(c_coa, "COA-202610-LF2-03918.pdf (Generated with dynamic QR-code watermark)")

    for r in tbl_qa.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 7. STORAGE — คลังสินค้า (ฝ่ายคลังสินค้า)
    # -----------------------------------------------------------------
    p_s7 = doc.add_paragraph()
    r = p_s7.add_run("7. Storage — คลังสินค้า (ฝ่ายที่รับผิดชอบ: ฝ่ายคลังสินค้าและการบรรจุ / Warehouse Dept)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s7.paragraph_format.space_after = Pt(2)

    tbl_wh = doc.add_table(rows=8, cols=4)
    set_table_borders(tbl_wh, COLOR_BORDER)
    tbl_wh.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_wh.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_wh0 = tbl_wh.cell(0, 0)
    for i in range(1, 4): c_wh0.merge(tbl_wh.cell(0, i))
    set_cell_background(c_wh0, COLOR_YELLOW)
    add_cell_content(c_wh0, "7. Storage — คลังสินค้าและการบรรจุ (Packing & Warehouse Inventory)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    wh_data = [
        [("6.1 Packing Daily Report", COLOR_YELLOW), ("xxxxxxx", COLOR_WHITE), ("Packing Date start- Date Finish", COLOR_YELLOW), ("Date start- Date Finish", COLOR_GREEN)],
        [("Packing Mtd Qties", COLOR_YELLOW), ("xxxxxxx", COLOR_WHITE), ("Big Bag label No.", COLOR_YELLOW), ("factory 1 : xxx\nfactory 2 : xxx", COLOR_WHITE)],
        [("6.2 Selection Date", COLOR_YELLOW), ("from Date – To Date", COLOR_GREEN), ("Material", COLOR_YELLOW), ("BWP-11-08 / BWP-12-08", COLOR_WHITE)],
        [("Storage Location", COLOR_YELLOW), ("wearhouse1", COLOR_WHITE), ("Opening Stock", COLOR_YELLOW), ("1000 Ton (ยอดยกมา)", COLOR_WHITE)],
        [("Total receipt Qties", COLOR_YELLOW), ("500 Ton (จำนวนที่รับเข้า)", COLOR_WHITE), ("Total issue Qties", COLOR_YELLOW), ("300 Ton (จำนวนที่จ่ายออก)", COLOR_WHITE)],
        [("Closing stock", COLOR_YELLOW), ("1200 Ton (สินค้าคงเหลือยกไป)", COLOR_GREEN), ("Inventory Controller", COLOR_YELLOW), ("Warehouse Manager", COLOR_WHITE)],
        [("Warehouse Status", COLOR_YELLOW), ("Inventory Verified & Ready for Logistics Dispatch", COLOR_WHITE), ("", COLOR_WHITE), ("", COLOR_WHITE)]
    ]
    for r_idx, r_info in enumerate(wh_data[:6], start=1):
        for col_idx in range(4):
            c = tbl_wh.cell(r_idx, col_idx)
            info = r_info[col_idx]
            set_cell_background(c, info[1]); add_cell_content(c, info[0], bold=(info[1]==COLOR_YELLOW))

    tbl_wh.cell(7, 0).text = ""; set_cell_background(tbl_wh.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_wh.cell(7, 0), "Stock Audit Note", bold=True)
    c_san = tbl_wh.cell(7, 1); c_san.merge(tbl_wh.cell(7, 2)); c_san.merge(tbl_wh.cell(7, 3))
    set_cell_background(c_san, COLOR_WHITE); add_cell_content(c_san, "ยอดสต็อกยกมา 1000 Ton + รับเข้า 500 Ton - จ่ายออก 300 Ton = สินค้าคงเหลือยกไป 1200 Ton ถูกต้องตรงตามระบบ ERP")

    for r in tbl_wh.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # 8. RA — รวบรวมข้อมูล (ส่งให้ Sales เมื่อมีการร้องขอ)
    # -----------------------------------------------------------------
    p_s8 = doc.add_paragraph()
    r = p_s8.add_run("8. RA — รวบรวมข้อมูล (ฝ่ายที่รับผิดชอบ: ฝ่ายกำกับและรับรอง / RA Dept ส่งให้ Sales)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s8.paragraph_format.space_after = Pt(2)

    tbl_ra2 = doc.add_table(rows=6, cols=4)
    set_table_borders(tbl_ra2, COLOR_BORDER)
    tbl_ra2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_ra2.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_ra2_0 = tbl_ra2.cell(0, 0)
    for i in range(1, 4): c_ra2_0.merge(tbl_ra2.cell(0, i))
    set_cell_background(c_ra2_0, COLOR_YELLOW)
    add_cell_content(c_ra2_0, "8. RA — รวบรวมข้อมูล (ส่งให้ Sales เมื่อมีการร้องขอ)", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    ra2_items = [
        ("1.GGL (PDF) *", "GGL FIT/FIP: Cover letter | Transaction Statement | Transaction Certificate จาก CU\nTransport Documents จาก Shipping | Certificate of Cleanliness จาก Shipping | GeoJSON\n*Non Compliance Document : GGL, SBP"),
        ("GGL SDE++ *", "Cover Letter | Transaction Statement | Transaction Certificate | Transport Documents\nCertificate of Cleanliness | EUDR Data Sheet | GeoJSON (Refer Email รอเมื่อขนส่งเสร็จ)"),
        ("SBP / EUDR *", "Refer 1. (PDF) | EUDR Data Sheet | GeoJSON (Refer Email รอเมื่อขนส่งเสร็จ)"),
        ("Customer complain Issue", "บันทึกประเด็นข้อร้องเรียนของลูกค้า (ถ้ามี) เพื่อแนบร่วมกับชุดเอกสารรับรอง"),
        ("Dossier Dispatch Status *", "Ready for Sales Request (เอกสารครบถ้วนพร้อมส่งให้ฝ่ายขายตามคำขอ)")
    ]
    for idx, (lbl, val) in enumerate(ra2_items, start=1):
        tbl_ra2.cell(idx, 0).text = ""; set_cell_background(tbl_ra2.cell(idx, 0), COLOR_YELLOW); add_cell_content(tbl_ra2.cell(idx, 0), lbl, bold=True)
        c_v = tbl_ra2.cell(idx, 1); c_v.merge(tbl_ra2.cell(idx, 2)); c_v.merge(tbl_ra2.cell(idx, 3))
        set_cell_background(c_v, COLOR_GREEN if idx==5 else COLOR_WHITE); add_cell_content(c_v, val)

    for r in tbl_ra2.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # 9. SHIPMENT — การจัดส่ง (ฝ่ายโลจิสติกส์และการส่งออก)
    # -----------------------------------------------------------------
    p_s9 = doc.add_paragraph()
    r = p_s9.add_run("9. Shipment — การจัดส่ง (ฝ่ายที่รับผิดชอบ: ฝ่ายโลจิสติกส์และการส่งออก / Logistics & Shipping)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s9.paragraph_format.space_after = Pt(2)

    tbl_sh = doc.add_table(rows=7, cols=4)
    set_table_borders(tbl_sh, COLOR_BORDER)
    tbl_sh.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_sh.rows:
        for idx, w in enumerate(w4): r.cells[idx].width = w

    c_sh0 = tbl_sh.cell(0, 0)
    for i in range(1, 4): c_sh0.merge(tbl_sh.cell(0, i))
    set_cell_background(c_sh0, COLOR_YELLOW)
    add_cell_content(c_sh0, "9. Shipment — การจัดส่ง ข้อมูลระวางเรือ และตารางเดินเรือ", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    sh_data = [
        [("SA number* :", COLOR_YELLOW), ("SA-202610-03918-ISO", COLOR_WHITE), ("Customer name :", COLOR_YELLOW), ("Bnbm company (ABC Biomass)", COLOR_WHITE)],
        [("POD :", COLOR_YELLOW), ("ANTWERP (or Port of Japan)", COLOR_WHITE), ("Shipping line :", COLOR_YELLOW), ("EVG", COLOR_WHITE)],
        [("Booking no :", COLOR_YELLOW), ("09050012456", COLOR_WHITE), ("Transit time :", COLOR_YELLOW), ("30 days", COLOR_WHITE)],
        [("Loading date:", COLOR_YELLOW), ("30/9/26", COLOR_GREEN), ("Finished date :", COLOR_YELLOW), ("07/9/26", COLOR_GREEN)],
        [("ETD :", COLOR_YELLOW), ("10/10/26", COLOR_GREEN), ("ETA :", COLOR_YELLOW), ("10/11/26", COLOR_GREEN)],
        [("ATD :", COLOR_YELLOW), ("11/10/26", COLOR_GREEN), ("Shipment Status :", COLOR_YELLOW), ("Shipped / Completed", COLOR_GREEN)]
    ]
    for r_idx, r_info in enumerate(sh_data, start=1):
        for col_idx in range(4):
            c = tbl_sh.cell(r_idx, col_idx)
            info = r_info[col_idx]
            set_cell_background(c, info[1]); add_cell_content(c, info[0], bold=(info[1]==COLOR_YELLOW))

    for r in tbl_sh.rows:
        for c in r.cells: set_cell_margins(c, 45, 45, 65, 65)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # 10. MANAGEMENT — ผู้บริหาร & DATA OWNERSHIP MATRIX
    # -----------------------------------------------------------------
    p_s10 = doc.add_paragraph()
    r = p_s10.add_run("10. Management — ผู้บริหาร & Data Ownership Matrix (หลักการ 1 ข้อมูล = 1 เจ้าของข้อมูล)")
    r.bold = True; r.italic = True; r.font.name = "Times New Roman"; r.font.size = Pt(10.5)
    p_s10.paragraph_format.space_after = Pt(2)

    p_m_desc = doc.add_paragraph()
    r = p_m_desc.add_run("ผู้บริหาร ไม่ควรต้องกรอกข้อมูลปฏิบัติการ ควรดู Dashboard ที่ระบบรวบรวมให้ เช่น:\n- KPI ข้อมูล   - Open Orders จำนวน Order   - Production ผลิตแล้วกี่ %   - QA Pass / Fail   - RA Approved / Blocked   - Warehouse Stock   - Shipment Shipped / Pending   - On-time Delivery %   - Exception จำนวนปัญหา\n\nสิ่งสำคัญที่สุด: ใครกรอกอะไร? ใช้หลักการ 1 ข้อมูล = 1 เจ้าของข้อมูล ดังนี้:")
    r.font.name = "Times New Roman"; r.font.size = Pt(8.8); r.font.color.rgb = RGBColor(71,85,105)

    tbl_matrix = doc.add_table(rows=11, cols=4)
    set_table_borders(tbl_matrix, COLOR_BORDER)
    tbl_matrix.alignment = WD_TABLE_ALIGNMENT.CENTER
    mat_w = [Inches(1.5), Inches(1.8), Inches(2.3), Inches(1.57)]
    for r in tbl_matrix.rows:
        for idx, w in enumerate(mat_w): r.cells[idx].width = w

    tbl_matrix.cell(0, 0).text = ""; set_cell_background(tbl_matrix.cell(0, 0), COLOR_YELLOW); add_cell_content(tbl_matrix.cell(0, 0), "ขั้นตอน (Step)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_matrix.cell(0, 1).text = ""; set_cell_background(tbl_matrix.cell(0, 1), COLOR_YELLOW); add_cell_content(tbl_matrix.cell(0, 1), "ฝ่ายที่รับผิดชอบ (Data Owner)", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_matrix.cell(0, 2).text = ""; set_cell_background(tbl_matrix.cell(0, 2), COLOR_YELLOW); add_cell_content(tbl_matrix.cell(0, 2), "ชุดข้อมูลที่ต้องรับผิดชอบ/กรอก", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    tbl_matrix.cell(0, 3).text = ""; set_cell_background(tbl_matrix.cell(0, 3), COLOR_YELLOW); add_cell_content(tbl_matrix.cell(0, 3), "สิทธิ์ในระบบ BPM", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    matrix_rows = [
        ("1. Sales Order", "ฝ่ายขาย (Sales Dept)", "ลูกค้า, PO, PI, สเปก 11 ข้อ, ข้อกำหนดพิเศษ 9 ข้อ, Complaint", "สร้างคำขอ (Create & Submit)"),
        ("2. Planning", "ฝ่ายวางแผน (Planning Dept)", "กำหนด PI, MO, แผนเริ่ม-จบ, Batch Code, ชนิดสินค้า, Volume, Unit", "จัดสรรล็อต (Plan & Allocate)"),
        ("3. RA Pre-Check", "ฝ่ายกำกับดูแล (RA Dept)", "ตรวจใบอนุญาต, โฉนด, พิกัด GPS, SD, Statement, DF/LC (EUDR)", "อนุมัติก่อนผลิต (Approve/Reject)"),
        ("4. Production Planning", "ฝ่ายโรงงาน (Plant Production)", "สัดส่วน Log/Slab/Sawdust, Yield, Uptime, Downtime, เชื้อเพลิง/ไฟฟ้า", "บันทึกการผลิต (Execute)"),
        ("5. In-Line QC", "ฝ่ายควบคุมคุณภาพ (QC)", "ตรวจเช็คหน้างาน 5 จุด (Logs, Sawdust, Chipper, Dryer, Separator)", "ปล่อยสายผลิต (In-Line Release)"),
        ("6. QA Laboratory", "ฝ่ายประกันคุณภาพ (QA)", "ตรวจแล็บเชิงลึก (Sieves, Density, Ash, Calorie, Durability, COA)", "อนุมัติคุณภาพขั้นสุดท้าย (Release)"),
        ("7. Storage & Wh.", "ฝ่ายคลังสินค้า (Warehouse)", "บันทึก Packing MTD, Big Bag Label, ยอดสต็อก ยกมา/รับ/จ่าย/ยกไป", "ตัดยอดคลัง (Stock Update)"),
        ("8. Post RA Dossier", "ฝ่ายกำกับดูแล (RA Dept)", "รวบรวมเอกสาร GGL, SDE++, SBP/EUDR Data Sheet ส่งให้ฝ่ายขาย", "จัดชุดเอกสารรับรองส่งออก"),
        ("9. Shipment", "ฝ่ายขนส่ง (Logistics)", "SA number, สายเรือ, บุ๊กกิ้ง, วันที่โหลด, ETD, ETA, ATD", "ปิดงานจัดส่ง (Shipment Closed)"),
        ("10. Management", "ผู้บริหาร (Management)", "ดู Dashboard สรุปภาพรวม: Orders, % ผลิต, QA Pass, Stock, On-time", "ดู Dashboard (View Only)")
    ]

    for r_idx, (st, ow, dt, ro) in enumerate(matrix_rows, start=1):
        c0 = tbl_matrix.cell(r_idx, 0); set_cell_background(c0, COLOR_YELLOW); add_cell_content(c0, st, bold=True)
        c1 = tbl_matrix.cell(r_idx, 1); set_cell_background(c1, COLOR_WHITE);  add_cell_content(c1, ow, bold=True)
        c2 = tbl_matrix.cell(r_idx, 2); set_cell_background(c2, COLOR_WHITE);  add_cell_content(c2, dt)
        c3 = tbl_matrix.cell(r_idx, 3); set_cell_background(c3, COLOR_GREEN if "Approve" in ro or "View" in ro else COLOR_WHITE); add_cell_content(c3, ro)

    for r in tbl_matrix.rows:
        for c in r.cells: set_cell_margins(c, 35, 35, 55, 55)

    # -----------------------------------------------------------------
    # SAVE DOCUMENT TO TARGET PATHS
    # -----------------------------------------------------------------
    filename = "WoodPellets_Full_Lifecycle_Spec_20261022.docx"
    dest_dir = r"D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets"
    dest_file = os.path.join(dest_dir, filename)
    doc.save(dest_file)
    print(f"1. Saved to Requested Path: {dest_file}")

    ws_file = os.path.join(r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005", filename)
    doc.save(ws_file)
    print(f"2. Saved to Workspace: {ws_file}")

    iis_file = os.path.join(r"D:\Inetpub\WWWRoot\BPM\wood_pellets", filename)
    try:
        doc.save(iis_file)
        print(f"3. Saved to IIS Path: {iis_file}")
    except Exception as e:
        print(f"IIS note: {e}")

if __name__ == "__main__":
    build_full_lifecycle_document()
