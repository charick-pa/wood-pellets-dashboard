# -*- coding: utf-8 -*-
"""
Generate Wood Pellets Sales & Planning Spec Word Document (.docx)
Following Enterprise BPM Layout Specification (Style 20261001_EUDR_Spec_V3)
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()

    # 1. Page Setup: A4 Portrait with standard 0.7 in margins
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(0.7)
        s.bottom_margin = Inches(0.7)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    # Styles & Colors
    # Primary: Forest Green #166534 / #15803d (Green River Brand)
    # Secondary: Deep Slate #0f172a / #1e293b
    # Accent: Amber #b45309 / #d97706
    # Table Header BG: #15803D (White Text)
    # Table Subheader BG: #F1F5F9 (Slate-800 Text)
    # Border: #CBD5E1

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def set_table_borders(table, color="94A3B8", sz="4", val="single"):
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

    def format_cell_text(cell, text, bold=False, color_rgb=(15, 23, 42), font_size=9.5, align=WD_ALIGN_PARAGRAPH.LEFT):
        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.bold = bold
        run.font.name = "Calibri"
        run.font.size = Pt(font_size)
        run.font.color.rgb = RGBColor(*color_rgb)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # ----------------------------------------------------
    # Header Banner & Title
    # ----------------------------------------------------
    p_comp = doc.add_paragraph()
    p_comp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_comp = p_comp.add_run("GREEN RIVER PANELS (THAILAND) CO., LTD.")
    r_comp.bold = True
    r_comp.font.name = "Calibri"
    r_comp.font.size = Pt(14)
    r_comp.font.color.rgb = RGBColor(21, 128, 61) # Green River Forest Green

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_title = p_title.add_run("Wood Pellets Form — System Specification Document (BPM UI & Database Layout)")
    r_title.bold = True
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(16)
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    r_sub = p_sub.add_run("Module 1: Sales Department (คำสั่งซื้อและลูกค้า) & Module 2: Production Woods Material Planning (วางแผนการผลิต)\nBased on: WoodPallets_20261021 summarize toolkits database sales document | Template Style: 20261001_EUDR_Spec_V3")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(9.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ----------------------------------------------------
    # Revision History Table
    # ----------------------------------------------------
    h_rev = doc.add_paragraph()
    r_h_rev = h_rev.add_run("Document Version & Modification Remarks")
    r_h_rev.bold = True
    r_h_rev.font.name = "Calibri"
    r_h_rev.font.size = Pt(11)
    r_h_rev.font.color.rgb = RGBColor(30, 41, 59)

    tbl_rev = doc.add_table(rows=4, cols=4)
    tbl_rev.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_rev, "94A3B8")
    
    col_widths_rev = [Inches(0.8), Inches(1.2), Inches(1.4), Inches(3.3)]
    for row in tbl_rev.rows:
        for idx, width in enumerate(col_widths_rev):
            row.cells[idx].width = width

    rev_data = [
        ["Ver.", "Date", "Author", "Modified Remark"],
        ["0.1", "2026/09/28", "Pa", "Initial Wood Pellets Form Specification"],
        ["0.2", "2026/10/01", "Pa / BPM Team", "EUDR Geolocation, GIS Map Integration & High-Precision Print Spec (V3)"],
        ["0.3", "2026/10/22", "Pa / System Architect", "New Sales Document Layout: Detailed Customer Specs, 9 Special Reqs, Planning & M/S Schema"]
    ]

    for r_idx, row in enumerate(tbl_rev.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 80, 80, 120, 120)
            if r_idx == 0:
                set_cell_background(cell, "15803D")
                format_cell_text(cell, rev_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 1, 2] else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, rev_data[r_idx][c_idx], bold=(c_idx==0), align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ----------------------------------------------------
    # Table of Contents Outline
    # ----------------------------------------------------
    h_toc = doc.add_paragraph()
    r_h_toc = h_toc.add_run("Contents Outline (สารบัญโครงสร้างเอกสาร)")
    r_h_toc.bold = True
    r_h_toc.font.size = Pt(11)
    r_h_toc.font.color.rgb = RGBColor(30, 41, 59)

    toc_items = [
        "1. Wood Pellets Form — UI BPM Layout Design (Mockup)",
        "   1.1 Header BPM Section (ข้อมูลทั่วไปคำขอ)",
        "   1.2 Module 1: Sale Department — ข้อมูลคำสั่งซื้อและลูกค้า (Sales Order & Requirements)",
        "       - Customer Information & Commercial Contract Data",
        "       - Customer Requirement Table (สเปกเม็ดไม้ชีวมวล 11 รายการ)",
        "       - Special Requirement Table (ข้อกำหนดพิเศษ 9 ข้อและมาตรการควบคุม)",
        "       - Customer Complaint & Vendor Data Amendment Policy",
        "   1.3 Module 2: Production — Woods Material Planning (วางแผนการผลิตและวัตถุดิบ)",
        "   1.4 Summary of Approval Steps (7-Step Lifecycle)",
        "2. Database & Toolkits Schema (M-Table & S-Table Data Dictionary)",
        "   2.1 M-Table-Schema (Master Fields Dictionary for BPM Form)",
        "   2.2 S-Table-Schema (Step-Specific Sub Table Schema)",
        "3. Document Numbering Format (WP %YY%MM%ZM4)",
        "4. Approval Process & Workflow Diagram"
    ]
    for item in toc_items:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(1)
        p_item.paragraph_format.space_after = Pt(1)
        p_item.paragraph_format.line_spacing = 1.15
        r = p_item.add_run(item)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        if item.startswith("1.") or item.startswith("2.") or item.startswith("3.") or item.startswith("4."):
            r.bold = True
            r.font.color.rgb = RGBColor(21, 128, 61)
        else:
            r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_page_break()

    # ----------------------------------------------------
    # SECTION 1: UI BPM LAYOUT DESIGN
    # ----------------------------------------------------
    h1 = doc.add_paragraph()
    r_h1 = h1.add_run("1. Wood Pellets Form — UI BPM Layout Design (Mockup)")
    r_h1.bold = True
    r_h1.font.size = Pt(13)
    r_h1.font.color.rgb = RGBColor(21, 128, 61)

    p_desc = doc.add_paragraph()
    r_desc = p_desc.add_run("โครงร่างการจัดวางหน้าจอ (Layout Design) สำหรับระบบ NewType AutoWeb FlowBPM เพื่อใช้ในการบันทึก, ตรวจสอบ และอนุมัติข้อมูลคำสั่งซื้อเม็ดไม้ชีวมวลอัดเม็ด (Wood Pellets) ตามมาตรฐาน EUDR และใบรับรองระดับสากล:")
    r_desc.font.size = Pt(9.5)
    r_desc.font.color.rgb = RGBColor(71, 85, 105)

    # 1.1 Header BPM Section Table
    h_sec1 = doc.add_paragraph()
    r_sec1 = h_sec1.add_run("1.1 Header BPM Section (ข้อมูลทั่วไปคำขอ)")
    r_sec1.bold = True
    r_sec1.font.size = Pt(11)
    r_sec1.font.color.rgb = RGBColor(30, 41, 59)

    tbl_hdr = doc.add_table(rows=5, cols=4)
    tbl_hdr.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_hdr, "94A3B8")
    col_w_hdr = [Inches(1.5), Inches(1.8), Inches(1.5), Inches(1.9)]
    for row in tbl_hdr.rows:
        for idx, w in enumerate(col_w_hdr):
            row.cells[idx].width = w

    # Row 0: Banner
    cell_top = tbl_hdr.cell(0, 0)
    for c in range(1, 4):
        cell_top.merge(tbl_hdr.cell(0, c))
    set_cell_background(cell_top, "166534")
    set_cell_margins(cell_top, 140, 140, 150, 150)
    format_cell_text(cell_top, "Green River Panels (Thailand) Co., Ltd.  —  Wood Pellets Operations Form", bold=True, color_rgb=(255, 255, 255), font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    hdr_fields = [
        [("Application No.", True), ("Identify after submit (e.g. WP26100001)", False), ("Application Date", True), ("Default Today (2026/10/22)", False)],
        [("Applicant", True), ("Somchai P. [NL-4092] ▼", False), ("Applicant Dept", True), ("Sales & Marketing ▼", False)],
        [("Requestor", True), ("Natrutdin Y. [GR-1088] ▼", False), ("Requestor Dept", True), ("Supply Chain Planning ▼", False)],
        [("Company", True), ("Green River Panels (Thailand) ▼", False), ("Importance", True), ("◉ Normal    ○ Urgent    ○ Top Urgent", False)]
    ]

    for r_idx, row_data in enumerate(hdr_fields, start=1):
        for c_idx in range(4):
            cell = tbl_hdr.cell(r_idx, c_idx)
            set_cell_margins(cell, 80, 80, 120, 120)
            txt, is_label = row_data[c_idx]
            if is_label:
                set_cell_background(cell, "F1F5F9")
                format_cell_text(cell, txt, bold=True, color_rgb=(30, 41, 59))
            else:
                set_cell_background(cell, "FFFFFF")
                format_cell_text(cell, txt, bold=False, color_rgb=(15, 23, 42))

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1.2 Module 1: Sale Department
    h_sec2 = doc.add_paragraph()
    r_sec2 = h_sec2.add_run("1.2 Module 1: Sale Department — ข้อมูลคำสั่งซื้อและลูกค้า (Sales Order & Requirements)")
    r_sec2.bold = True
    r_sec2.font.size = Pt(11)
    r_sec2.font.color.rgb = RGBColor(30, 41, 59)

    tbl_sale = doc.add_table(rows=10, cols=4)
    tbl_sale.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sale, "94A3B8")
    for row in tbl_sale.rows:
        for idx, w in enumerate(col_w_hdr):
            row.cells[idx].width = w

    # Row 0: Section Header
    cell_sale_top = tbl_sale.cell(0, 0)
    for c in range(1, 4):
        cell_sale_top.merge(tbl_sale.cell(0, c))
    set_cell_background(cell_sale_top, "0F172A")
    set_cell_margins(cell_sale_top, 120, 120, 150, 150)
    format_cell_text(cell_sale_top, "STEP 1: SALE DEPARTMENT — ข้อมูลคำสั่งซื้อ ลูกค้า และข้อกำหนดทางสัญญา", bold=True, color_rgb=(255, 255, 255), font_size=10)

    sale_fields = [
        [("Customer Code *", True), ("02545 / CUS-001", False), ("Customer Name *", True), ("ABC Biomass Energy CO., LTD", False)],
        [("Country / Region", True), ("Japan / Tokyo", False), ("Address", True), ("1-8-2 Marunouchi, Chiyoda-ku, Tokyo", False)],
        [("Contact Person", True), ("Mr. Thomason (Procurement Mgr)", False), ("Email / Telephone", True), ("thomason@abc-biomass.jp / +81-3-5555-0199", False)],
        [("Customer PO No. *", True), ("PO-ABC-2026-001", False), ("Proforma Invoice (PI No.) *", True), ("PI-ABC-2026-001", False)],
        [("Order No. (ERP/BPM) *", True), ("ORD-2026-04159", False), ("MO No. (Manufacturing) *", True), ("MP20260021 / a346534534", False)],
        [("Product Code *", True), ("WP-001 (Bwp.12-08)", False), ("Product Name *", True), ("Wood Pellets (เม็ดไม้ชีวมวลอัดเม็ด)", False)],
        [("Product Type *", True), ("1. 0.6mm ± 1 mm\n2. 0.8mm ± 1 mm", False), ("Quantity / Unit *", True), ("5,000 MT (Metric Tons)\n[รองรับหน่วย MT, kg, Ton/KK]", False)],
        [("Requested Delivery Date *", True), ("2026/11/30 (30 พ.ย. 2026)", False), ("Ship-to Location (Port) *", True), ("Port of Japan (Tokyo / Osaka Port)", False)],
        [("Certificate Requirement *", True), ("☑ SBP (Sustainable Biomass Program)\n☑ GGL (Green Gold Label)\n☑ FSC-100% (Forest Stewardship Council)", False), ("Production Plan Period *", True), ("Start: 2026/09/28\nFinish: 2026/10/30", False)]
    ]

    for r_idx, row_data in enumerate(sale_fields, start=1):
        for c_idx in range(4):
            cell = tbl_sale.cell(r_idx, c_idx)
            set_cell_margins(cell, 80, 80, 120, 120)
            txt, is_label = row_data[c_idx]
            if is_label:
                set_cell_background(cell, "F1F5F9")
                format_cell_text(cell, txt, bold=True, color_rgb=(30, 41, 59))
            else:
                set_cell_background(cell, "FFFFFF")
                format_cell_text(cell, txt, bold=False, color_rgb=(15, 23, 42))

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1.2.1 Customer Requirement Table
    p_req_title = doc.add_paragraph()
    r_rt = p_req_title.add_run("Customer Requirement: สเปกและคุณสมบัติสินค้าตามที่ลูกค้ากำหนด (11 พารามิเตอร์)")
    r_rt.bold = True
    r_rt.font.size = Pt(10)
    r_rt.font.color.rgb = RGBColor(21, 128, 61)

    tbl_creq = doc.add_table(rows=12, cols=3)
    tbl_creq.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_creq, "94A3B8")
    col_w_creq = [Inches(0.6), Inches(2.5), Inches(3.6)]
    for row in tbl_creq.rows:
        for idx, w in enumerate(col_w_creq):
            row.cells[idx].width = w

    creq_data = [
        ["No.", "Topic (หัวข้อคุณสมบัติ)", "Detail (รายละเอียดข้อกำหนด)"],
        ["1", "Raw Material (แหล่งวัตถุดิบ)", "Rubberwood (ไม้ยางพาราแท้ 100% ปลอดสารปนเปื้อน)"],
        ["2", "Pellet Diameter (ขนาดเส้นผ่านศูนย์กลาง)", "0.6mm ± 1 mm (หรือ 0.8mm ตามประเภทที่ระบุ)"],
        ["3", "Moisture Content (ความชื้น)", "≤ 10% (มาตรฐานควบคุมไม่เกิน 8% ในการผลิตจริง)"],
        ["4", "Ash Content (ปริมาณเถ้า)", "≤ 3% (ผ่านเกณฑ์มาตรฐานอุตสาหกรรมชีวมวล)"],
        ["5", "Net Calorific Value (ค่าความร้อนสุทธิ)", "≥ 4,000 kcal/kg (หรือ ≥ 16.5 MJ/kg)"],
        ["6", "Bulk Density (ความหนาแน่นรวม)", "≥ 600 kg/m³"],
        ["7", "Fines Content (ปริมาณฝุ่นผงละเอียด)", "≤ 1%"],
        ["8", "Packaging (รูปแบบการบรรจุภัณฑ์)", "Bulk Shipment (เทกองลงระวางเรือ) หรือ Big Bag ตามสัญญา"],
        ["9", "Quality Certificate (ใบรับรองคุณภาพ)", "Certificate of Analysis (COA) รับรองทุกล็อต"],
        ["10", "Inspection (การตรวจสอบคุณภาพ)", "Pre-shipment Inspection โดยหน่วยงานภายนอกที่รับรอง"],
        ["11", "Required Documents (เอกสารส่งมอบ)", "Commercial Invoice, Packing List, COA, Bill of Lading (B/L)"]
    ]

    for r_idx, row in enumerate(tbl_creq.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 70, 70, 110, 110)
            if r_idx == 0:
                set_cell_background(cell, "166534")
                format_cell_text(cell, creq_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, creq_data[r_idx][c_idx], bold=(c_idx==1), align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1.2.2 Special Requirement Table (9 Items)
    p_sreq_title = doc.add_paragraph()
    r_srt = p_sreq_title.add_run("Special Requirement: ข้อกำหนดพิเศษที่ต้องควบคุมและแจ้งเตือน (9 ข้อกำหนด)")
    r_srt.bold = True
    r_srt.font.size = Pt(10)
    r_srt.font.color.rgb = RGBColor(180, 83, 9) # Amber

    p_sreq_note = doc.add_paragraph()
    r_sn = p_sreq_note.add_run("⚠️ กฎเหล็ก: ต้องแจ้งลูกค้าทันทีหากคุณภาพหรือกระบวนการผลิตไม่เป็นไปตามข้อกำหนดด้านล่างนี้")
    r_sn.font.size = Pt(9)
    r_sn.font.italic = True
    r_sn.font.color.rgb = RGBColor(180, 83, 9)

    tbl_sreq = doc.add_table(rows=10, cols=3)
    tbl_sreq.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sreq, "94A3B8")
    for row in tbl_sreq.rows:
        for idx, w in enumerate(col_w_creq):
            row.cells[idx].width = w

    sreq_data = [
        ["No.", "Special Requirement (หัวข้อ)", "รายละเอียดข้อกำหนดและมาตรการปฏิบัติ"],
        ["1", "Moisture Control", "ความชื้นต้องไม่เกิน 8% (สุ่มตรวจทุกชั่วโมงในสายการผลิต)"],
        ["2", "Quality Inspection", "ต้องตรวจสอบคุณภาพทุก Batch พร้อมเก็บบันทึกผลการทดสอบ"],
        ["3", "COA Approval", "ต้องส่ง Certificate of Analysis (COA) ให้ลูกค้าตรวจสอบและอนุมัติก่อนเริ่มโหลดสินค้า"],
        ["4", "Raw Material Control", "ใช้วัตถุดิบตามแหล่งสวนยางและประเภทแปลงปลูกที่ลูกค้าอนุมัติ (EUDR Verified)"],
        ["5", "Product Contamination", "ต้องไม่มีสิ่งแปลกปลอม โลหะ หรือสารปนเปื้อนที่ไม่เป็นไปตามข้อกำหนด"],
        ["6", "Pellet Durability", "ต้องมีความทนทานทางกลของเม็ด (Mechanical Durability ≥ 97.5%) ตามค่าที่ลูกค้ากำหนด"],
        ["7", "Shipment Inspection", "ต้องตรวจสอบสภาพระวางเรือ / ตู้สินค้า และตรวจสอบสินค้าก่อนเริ่มโหลดขึ้นเรือ"],
        ["8", "Weather Protection", "ต้องมีผ้าใบคลุมกันฝน ป้องกันสินค้าเปียกชื้นระหว่างการจัดเก็บในคลังและการขนส่ง"],
        ["9", "Shipment Documents", "ต้องส่งเอกสารตามรายการที่ลูกค้ากำหนดครบถ้วนล่วงหน้า 3 วันทำการก่อนเรือถึงท่า"]
    ]

    for r_idx, row in enumerate(tbl_sreq.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 70, 70, 110, 110)
            if r_idx == 0:
                set_cell_background(cell, "B45309") # Amber Header
                format_cell_text(cell, sreq_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "FFFBEB" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, sreq_data[r_idx][c_idx], bold=(c_idx==1), align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1.2.3 Other Special Requirement & Customer Complaint
    tbl_comp = doc.add_table(rows=3, cols=2)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_comp, "94A3B8")
    tbl_comp.rows[0].cells[0].width = Inches(2.2)
    tbl_comp.rows[0].cells[1].width = Inches(4.5)
    tbl_comp.rows[1].cells[0].width = Inches(2.2)
    tbl_comp.rows[1].cells[1].width = Inches(4.5)
    tbl_comp.rows[2].cells[0].width = Inches(2.2)
    tbl_comp.rows[2].cells[1].width = Inches(4.5)

    comp_data = [
        ("Other Special Requirement", "ระบุข้อกำหนดเพิ่มเติมอื่น ๆ (ถ้ามี) จากลูกค้า"),
        ("Customer Complaint History", "บันทึกประวัติข้อร้องเรียนของลูกค้ารายนี้ (ถ้ามี)"),
        ("Status Customer Complaint", "○ None    ◉ Open (อยู่ระหว่างตรวจสอบ)    ○ Closed (แก้ไขเรียบร้อยแล้ว)\n**** หมายเหตุ: ฝ่าย Sale สามารถเปลี่ยนแปลงข้อมูลได้ทุก Vendor ระหว่างกระบวนการผลิต ****")
    ]

    for r_idx, (fld, val) in enumerate(comp_data):
        c0 = tbl_comp.cell(r_idx, 0)
        c1 = tbl_comp.cell(r_idx, 1)
        set_cell_margins(c0, 80, 80, 120, 120)
        set_cell_margins(c1, 80, 80, 120, 120)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF")
        format_cell_text(c0, fld, bold=True, color_rgb=(30, 41, 59))
        format_cell_text(c1, val, bold=False, color_rgb=(15, 23, 42))

    doc.add_page_break()

    # ----------------------------------------------------
    # SECTION 2: PRODUCTION WOODS MATERIAL PLANNING
    # ----------------------------------------------------
    h2 = doc.add_paragraph()
    r_h2 = h2.add_run("1.3 Module 2: Production — Woods Material Planning (วางแผนการผลิตและวัตถุดิบ)")
    r_h2.bold = True
    r_h2.font.size = Pt(13)
    r_h2.font.color.rgb = RGBColor(21, 128, 61)

    p_pldesc = doc.add_paragraph()
    r_pld = p_pldesc.add_run("ส่วนการทำงานของฝ่ายวางแผนวัตถุดิบและโรงงาน (Step 3: Woods Material Planning) เพื่อจับคู่คำสั่งซื้อเข้ากับล็อตวัตถุดิบและไลน์เครื่องจักร:")
    r_pld.font.size = Pt(9.5)
    r_pld.font.color.rgb = RGBColor(71, 85, 105)

    tbl_plan = doc.add_table(rows=7, cols=4)
    tbl_plan.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_plan, "94A3B8")
    for row in tbl_plan.rows:
        for idx, w in enumerate(col_w_hdr):
            row.cells[idx].width = w

    # Row 0: Header
    c_p0 = tbl_plan.cell(0, 0)
    for c in range(1, 4):
        c_p0.merge(tbl_plan.cell(0, c))
    set_cell_background(c_p0, "0F172A")
    set_cell_margins(c_p0, 120, 120, 150, 150)
    format_cell_text(c_p0, "STEP 3: PRODUCTION — WOODS MATERIAL PLANNING (การวางแผนวัตถุดิบและล็อตผลิต)", bold=True, color_rgb=(255, 255, 255), font_size=10)

    plan_fields = [
        [("Proforma Invoice (PI No.) *", True), ("PO-ABC-2026-001", False), ("MO No. (Manufacturing Order) *", True), ("MP20260021 (ระบบออกให้อัตโนมัติ)", False)],
        [("Plan Date Start *", True), ("2026/09/28", False), ("Plan Date Finish *", True), ("2026/09/30", False)],
        [("Production Batch Code *", True), ("SBP-xx-YY-02-3003", False), ("Production Description *", True), ("Rubber Wood Pellets (ไม้ยางพาราอัดเม็ด)", False)],
        [("Certificate Scheme *", True), ("☑ SBP    ☑ GGL    ☑ FSC-100%\n(สามารถเลือกได้ 2 ตัวเลือกขึ้นไป)", False), ("Product Code (Internal) *", True), ("Bwp.12-08 (Wood Pellet Grade A)", False)],
        [("Planned Quantity *", True), ("5,000 MT (Metric Tons)\n[หรือ 20,000 Ton/KK]", False), ("Actual Quantity (To-date) *", True), ("15,000 Ton/KK (หรือตามยอดจริง)", False)],
        [("Raw Material Requirement *", True), ("☑ Hammer Mill\n☑ Flaker 3\n☑ Flaker 4\n(ดึงจาก Table: grh_V_combo)", False), ("Production Status *", True), ("◉ Open (กำลังดำเนินการ)\n○ On Hold\n○ Completed", False)]
    ]

    for r_idx, row_data in enumerate(plan_fields, start=1):
        for c_idx in range(4):
            cell = tbl_plan.cell(r_idx, c_idx)
            set_cell_margins(cell, 80, 80, 120, 120)
            txt, is_label = row_data[c_idx]
            if is_label:
                set_cell_background(cell, "F1F5F9")
                format_cell_text(cell, txt, bold=True, color_rgb=(30, 41, 59))
            else:
                set_cell_background(cell, "FFFFFF")
                format_cell_text(cell, txt, bold=False, color_rgb=(15, 23, 42))

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ----------------------------------------------------
    # SECTION 3: 7-STEP LIFECYCLE & APPROVAL FLOW
    # ----------------------------------------------------
    h3 = doc.add_paragraph()
    r_h3 = h3.add_run("1.4 Summary of Approval Steps & 7-Step Lifecycle")
    r_h3.bold = True
    r_h3.font.size = Pt(11)
    r_h3.font.color.rgb = RGBColor(30, 41, 59)

    tbl_flow = doc.add_table(rows=8, cols=4)
    tbl_flow.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_flow, "94A3B8")
    flow_col_w = [Inches(1.8), Inches(1.3), Inches(1.6), Inches(2.0)]
    for row in tbl_flow.rows:
        for idx, w in enumerate(flow_col_w):
            row.cells[idx].width = w

    flow_data = [
        ["Step Name", "Department", "Available Actions", "Remarks & Email Triggers"],
        ["1. Start - Sale", "Sale Dept", "Submit, Withdraw", "กรอกข้อมูลคำสั่งซื้อและแนบ PO/PI"],
        ["2. RA (Compliance)", "RA Dept", "Agree ➔ Next\nRejected ➔ Complete", "ตรวจสอบใบอนุญาตส่งออก & EUDR (แนบเอกสาร)"],
        ["3. Woods Planning", "Production Planning", "Agree ➔ Next\nRejected ➔ Return", "จัดสรรล็อตสวนยางและเครื่องจักร (แจ้งเตือนอีเมล)"],
        ["4. Pelletizing (QC)", "Plant Production", "Agree ➔ Next\nRejected ➔ Return", "บันทึกผลการผลิต Yield, Downtime, Moisture"],
        ["5. QA Lab", "QA Inspection", "Agree ➔ Next\nRejected ➔ Return", "ตรวจแล็บ Ash, Calorie, COA, Scan Report"],
        ["6. Warehouse/Store", "Warehouse Dept", "Agree ➔ Next\nRejected ➔ Return", "บันทึกยอด Stock ยกมา, จ่ายออก, คงเหลือยกไป"],
        ["7. Shipment", "Logistics Dept", "Agree ➔ FINISHED\nRejected ➔ Return", "บันทึกตู้คอนเทนเนอร์, B/L, Booking, ETD, ETA"]
    ]

    for r_idx, row in enumerate(tbl_flow.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 70, 70, 110, 110)
            if r_idx == 0:
                set_cell_background(cell, "166534")
                format_cell_text(cell, flow_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [1, 2] else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, flow_data[r_idx][c_idx], bold=(c_idx==0), align=align)

    doc.add_page_break()

    # ----------------------------------------------------
    # SECTION 4: DATABASE SCHEMA & TOOLKITS (M-TABLE & S-TABLE)
    # ----------------------------------------------------
    h4 = doc.add_paragraph()
    r_h4 = h4.add_run("2. Database & Toolkits Schema (Data Dictionary)")
    r_h4.bold = True
    r_h4.font.size = Pt(13)
    r_h4.font.color.rgb = RGBColor(21, 128, 61)

    p_sch_desc = doc.add_paragraph()
    r_schd = p_sch_desc.add_run("โครงสร้างตารางข้อมูลในระบบ FlowBPM (M-Table สำหรับ Main Form และ S-Table สำหรับ Sub-Process) โดยสรุปเฉพาะฟิลด์ที่เกี่ยวข้องกับ Sales Department และ Production Woods Material Planning:")
    r_schd.font.size = Pt(9.5)
    r_schd.font.color.rgb = RGBColor(71, 85, 105)

    # 2.1 M-Table-Schema
    p_m_title = doc.add_paragraph()
    r_mt = p_m_title.add_run("2.1 M-Table-Schema (Master Form Fields Data Dictionary)")
    r_mt.bold = True
    r_mt.font.size = Pt(11)
    r_mt.font.color.rgb = RGBColor(30, 41, 59)

    tbl_m = doc.add_table(rows=21, cols=7)
    tbl_m.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_m, "94A3B8")
    m_col_w = [Inches(1.4), Inches(1.3), Inches(0.8), Inches(0.9), Inches(0.4), Inches(0.8), Inches(1.1)]
    for row in tbl_m.rows:
        for idx, w in enumerate(m_col_w):
            row.cells[idx].width = w

    m_data = [
        ["Field Name", "Description", "Control", "Data Type", "Req", "Default", "Remark"],
        ["sale_customer_code", "Customer Code", "Text", "Nvarchar(20)", "V", "", "รหัสลูกค้า เช่น 02545"],
        ["sale_customer_name", "Customer Name", "Text", "Nvarchar(255)", "V", "", "ชื่อลูกค้า / บริษัทผู้ซื้อ"],
        ["sale_customer_country", "Country", "Select", "Nvarchar(100)", "", "Japan", "ประเทศปลายทาง"],
        ["sale_customer_address", "Address", "Textarea", "Nvarchar(255)", "", "", "ที่อยู่ลูกค้า"],
        ["sale_contact_person", "Contact Person", "Text", "Nvarchar(100)", "", "", "ผู้ติดต่อ (ไม่บังคับ)"],
        ["sale_email_tel", "Email / Tel", "Text", "Nvarchar(150)", "", "", "ข้อมูลติดต่อลูกค้า"],
        ["sale_po_no", "Customer PO No.", "Text", "Nvarchar(50)", "V", "", "เลขที่ PO ของลูกค้า"],
        ["sale_pi_no", "PI No.", "Text", "Nvarchar(50)", "V", "", "เลขที่ Proforma Invoice"],
        ["sale_order_no", "Order No.", "Text", "Nvarchar(100)", "V", "", "เลขที่ออเดอร์ในระบบ"],
        ["sale_mo_no", "MO No.", "Text", "Nvarchar(50)", "V", "", "Manufacturing Order"],
        ["sale_product_code", "Product Code", "Select", "Nvarchar(150)", "V", "WP-001", "รหัสสินค้า Wood Pellets"],
        ["sale_product_name", "Product Name", "Text", "Nvarchar(255)", "V", "Wood Pellets", "ชื่อสินค้า"],
        ["sale_product_type", "Product Type", "Select", "Nvarchar(100)", "V", "1-0.6mm", "1-0.6mm หรือ 2-0.8mm"],
        ["sale_quantity", "Quantity", "Number", "Int / Decimal", "V", "5000", "ปริมาณคำสั่งซื้อ"],
        ["sale_quantity_unit", "Unit", "Select", "Nvarchar(20)", "V", "MT", "MT, kg, Ton/KK"],
        ["sale_delivery_date", "Delivery Date", "Date", "Date", "V", "", "วันที่กำหนดส่งมอบสินค้า"],
        ["sale_ship_to", "Ship-to Location", "Text", "Nvarchar(150)", "V", "", "ท่าเรือ / สถานที่ส่งมอบ"],
        ["sale_certificate_req", "Certificate Req", "Multi-Select", "Nvarchar(100)", "V", "SBP, GGL", "SBP, GGL, FSC-100%"],
        ["sale_customer_req", "Customer Requirement", "JSON/Text", "Nvarchar(MAX)", "V", "", "เก็บรายละเอียด 11 สเปก"],
        ["sale_special_req", "Special Requirement", "JSON/Text", "Nvarchar(MAX)", "V", "", "เก็บ 9 ข้อกำหนดพิเศษ"]
    ]

    for r_idx, row in enumerate(tbl_m.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 60, 60, 80, 80)
            if r_idx == 0:
                set_cell_background(cell, "166534")
                format_cell_text(cell, m_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, m_data[r_idx][c_idx], bold=(c_idx==0), font_size=8.5, align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 2.2 S-Table-Schema for Planning
    p_s_title = doc.add_paragraph()
    r_st = p_s_title.add_run("2.2 S-Table-Schema (Step 3: Production Woods Planning Fields)")
    r_st.bold = True
    r_st.font.size = Pt(11)
    r_st.font.color.rgb = RGBColor(30, 41, 59)

    tbl_s = doc.add_table(rows=10, cols=7)
    tbl_s.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_s, "94A3B8")
    for row in tbl_s.rows:
        for idx, w in enumerate(m_col_w):
            row.cells[idx].width = w

    s_data = [
        ["Field Name", "Description", "Control", "Data Type", "Req", "Default", "Data Source / Remark"],
        ["prod_pi_no", "PI No.", "Text", "Nvarchar(50)", "V", "", "เชื่อมกับ sale_pi_no"],
        ["prod_mo_no", "MO No.", "Text", "Nvarchar(50)", "V", "", "เลขที่คำสั่งผลิต MP202600XX"],
        ["prod_startDate", "Plan Date Start", "Date", "Date", "V", "", "วันที่เริ่มแผนการผลิต"],
        ["prod_finishDate", "Plan Date Finish", "Date", "Date", "V", "", "วันที่สิ้นสุดแผนการผลิต"],
        ["prod_batch_code", "Production Batch", "Text", "Nvarchar(100)", "V", "", "รหัส Batch เช่น SBP-xx-YY-02-3003"],
        ["prod_description", "Production Desc", "Text", "Nvarchar(255)", "V", "", "Rubber wood pellets"],
        ["prod_planned_qty", "Planned Quantity", "Number", "Nvarchar(50)", "V", "5000", "ปริมาณตามแผน (MT / Ton)"],
        ["prod_planned_unit", "Planned Unit", "Select", "Nvarchar(10)", "V", "MT", "MT, kg, Ton/KK"],
        ["prod_rawMaterial_req", "Raw Material Req", "Multi-Select", "Nvarchar(100)", "V", "", "Table: grh_V_combo (Hammer, Flaker)"]
    ]

    for r_idx, row in enumerate(tbl_s.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 60, 60, 80, 80)
            if r_idx == 0:
                set_cell_background(cell, "0F172A")
                format_cell_text(cell, s_data[r_idx][c_idx], bold=True, color_rgb=(255, 255, 255), font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
                format_cell_text(cell, s_data[r_idx][c_idx], bold=(c_idx==0), font_size=8.5, align=align)

    # ----------------------------------------------------
    # SECTION 5: SIGN-OFF & APPROVAL CONFIRMATION
    # ----------------------------------------------------
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    h5 = doc.add_paragraph()
    r_h5 = h5.add_run("3. Requirement Specification Document Authorization")
    r_h5.bold = True
    r_h5.font.size = Pt(11)
    r_h5.font.color.rgb = RGBColor(30, 41, 59)

    tbl_sign = doc.add_table(rows=3, cols=2)
    tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sign, "94A3B8")
    tbl_sign.rows[0].cells[0].width = Inches(3.3)
    tbl_sign.rows[0].cells[1].width = Inches(3.4)
    tbl_sign.rows[1].cells[0].width = Inches(3.3)
    tbl_sign.rows[1].cells[1].width = Inches(3.4)
    tbl_sign.rows[2].cells[0].width = Inches(3.3)
    tbl_sign.rows[2].cells[1].width = Inches(3.4)

    sign_data = [
        ("SA Confirm Ver: V0.3 (Draft for Approval)", "Date Provided: 2026/10/22"),
        ("Prepared By: Pa & System Architecture Team", "Reviewed By: Business Process Management (BPM) Lead"),
        ("Authorization Status: [  ] Approved    [  ] Pending Revision", "Authorization Date: ________________________")
    ]

    for r_idx, (c0_txt, c1_txt) in enumerate(sign_data):
        c0 = tbl_sign.cell(r_idx, 0)
        c1 = tbl_sign.cell(r_idx, 1)
        set_cell_margins(c0, 90, 90, 120, 120)
        set_cell_margins(c1, 90, 90, 120, 120)
        bg = "F1F5F9" if r_idx == 0 else "FFFFFF"
        set_cell_background(c0, bg)
        set_cell_background(c1, bg)
        format_cell_text(c0, c0_txt, bold=(r_idx==0))
        format_cell_text(c1, c1_txt, bold=(r_idx==0))

    # Save to workspace
    out_path = r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005\WoodPellets_Sales_Planning_Spec_V3.docx"
    doc.save(out_path)
    print(f"Successfully generated Word document at: {out_path}")

    # Also copy to IIS path if directory exists
    iis_path = r"D:\Inetpub\WWWRoot\BPM\wood_pellets\WoodPellets_Sales_Planning_Spec_V3.docx"
    try:
        doc.save(iis_path)
        print(f"Successfully copied to IIS path: {iis_path}")
    except Exception as e:
        print(f"Note on IIS copy: {e}")

if __name__ == "__main__":
    create_document()
