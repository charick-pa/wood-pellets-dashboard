# -*- coding: utf-8 -*-
"""
Generate Wood Pellets Sales Document Specification Word File
Matching EXACT User Image Style:
- Yellow Label / Header Cells: #FFFECC
- White Input Cells: #FFFFFF
- Green User Input Date/Selection Cells: #CFFFCE
- Black single border lines #000000
- MO No in Red #FF0000
Destination: D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\WoodPellets_Sales_Document_Spec_20261021.docx
"""

import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_sales_spec_document():
    doc = docx.Document()

    # Page Margins A4
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(0.6)
        s.bottom_margin = Inches(0.6)
        s.left_margin = Inches(0.6)
        s.right_margin = Inches(0.6)

    # Color Constants from User's uploaded screenshot
    COLOR_YELLOW = "FFFECC" # Exact sampled hex from label cells
    COLOR_GREEN  = "CFFFCE" # Exact sampled hex from date/input cells
    COLOR_WHITE  = "FFFFFF" # White input cells
    COLOR_BORDER = "000000" # Black borders

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
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

    def add_cell_content(cell, text, bold=False, color_rgb=(0,0,0), font_size=9.5, align=WD_ALIGN_PARAGRAPH.LEFT, is_star_red=True):
        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.15

        # Handle asterisk red coloring if label has '*'
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
                    r_star.font.color.rgb = RGBColor(220, 38, 38) # Red asterisk
        else:
            r = p.add_run(text)
            r.bold = bold
            r.font.name = "Times New Roman"
            r.font.size = Pt(font_size)
            r.font.color.rgb = RGBColor(*color_rgb)

        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # -----------------------------------------------------------------
    # Document Header / Revision
    # -----------------------------------------------------------------
    p_comp = doc.add_paragraph()
    r_c = p_comp.add_run("Greenriverholding.com\nWood Pellets Form\nSpec Document")
    r_c.bold = True
    r_c.font.name = "Times New Roman"
    r_c.font.size = Pt(12)
    p_comp.paragraph_format.space_after = Pt(2)

    p_docmod = doc.add_paragraph()
    r_dm = p_docmod.add_run("Document version and modification remarks.")
    r_dm.font.name = "Times New Roman"
    r_dm.font.size = Pt(10)
    p_docmod.paragraph_format.space_after = Pt(2)

    tbl_ver = doc.add_table(rows=3, cols=4)
    set_table_borders(tbl_ver, COLOR_BORDER)
    tbl_ver.alignment = WD_TABLE_ALIGNMENT.CENTER
    ver_w = [Inches(1.0), Inches(1.5), Inches(1.5), Inches(3.0)]
    for r in tbl_ver.rows:
        for idx, w in enumerate(ver_w):
            r.cells[idx].width = w

    v_data = [
        ["Ver.", "Date", "Author", "Modified remark"],
        ["0.1", "2026/09/28", "Pa", "Initial"],
        ["0.2", "2026/10/21", "Pa", "Sales Document & Toolkits Database Integration"]
    ]
    for r_idx, row in enumerate(tbl_ver.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 60, 60, 80, 80)
            set_cell_background(cell, COLOR_YELLOW if r_idx == 0 else COLOR_WHITE)
            add_cell_content(cell, v_data[r_idx][c_idx], bold=(r_idx==0), align=WD_ALIGN_PARAGRAPH.LEFT if c_idx==3 else WD_ALIGN_PARAGRAPH.CENTER)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -----------------------------------------------------------------
    # Header BPM Table (Company & Application Info)
    # -----------------------------------------------------------------
    p_hdr_title = doc.add_paragraph()
    r_ht = p_hdr_title.add_run("Wood pellets Form\nUI BPM")
    r_ht.bold = True
    r_ht.font.name = "Times New Roman"
    r_ht.font.size = Pt(11)
    p_hdr_title.paragraph_format.space_after = Pt(2)

    tbl_head = doc.add_table(rows=5, cols=4)
    set_table_borders(tbl_head, COLOR_BORDER)
    tbl_head.alignment = WD_TABLE_ALIGNMENT.CENTER
    std_w = [Inches(1.6), Inches(1.9), Inches(1.6), Inches(2.0)]
    for r in tbl_head.rows:
        for idx, w in enumerate(std_w):
            r.cells[idx].width = w

    # Row 0: Banner
    c_banner = tbl_head.cell(0, 0)
    for i in range(1, 4):
        c_banner.merge(tbl_head.cell(0, i))
    set_cell_background(c_banner, COLOR_YELLOW)
    set_cell_margins(c_banner, 80, 80, 100, 100)
    add_cell_content(c_banner, "Green River Panels (Thailand) Co., Ltd   Wood pellets Form", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    head_rows = [
        [("Application No.", COLOR_YELLOW, True), ("Identify after submit", COLOR_WHITE, False), ("Application Date.", COLOR_YELLOW, True), ("Default today", COLOR_GREEN, False)],
        [("Applicant", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False), ("Applicant Department", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False)],
        [("Requestor", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False), ("Requestor Department", COLOR_YELLOW, True), ("XXXXXXX▼", COLOR_WHITE, False)],
        [("Company", COLOR_YELLOW, True), ("XXX▼", COLOR_WHITE, False), ("", COLOR_WHITE, False), ("", COLOR_WHITE, False)]
    ]
    # merge last 3 cells of row 4 for Company
    c_comp = tbl_head.cell(4, 1)
    c_comp.merge(tbl_head.cell(4, 2))
    c_comp.merge(tbl_head.cell(4, 3))

    for r_idx, r_data in enumerate(head_rows, start=1):
        for c_idx in range(4):
            if r_idx == 4 and c_idx > 1:
                continue
            cell = tbl_head.cell(r_idx, c_idx)
            set_cell_margins(cell, 60, 60, 80, 80)
            txt, bg_color, is_b = r_data[c_idx]
            set_cell_background(cell, bg_color)
            add_cell_content(cell, txt, bold=is_b)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -----------------------------------------------------------------
    # STEP 1: SALE DEPARTMENT (EXACT LAYOUT AS USER'S IMAGE)
    # -----------------------------------------------------------------
    p_step1_lbl = doc.add_paragraph()
    r_s1l = p_step1_lbl.add_run("1.Sale Department - Step")
    r_s1l.bold = True
    r_s1l.italic = True
    r_s1l.font.name = "Times New Roman"
    r_s1l.font.size = Pt(11)
    p_step1_lbl.paragraph_format.space_after = Pt(2)

    # 13 Rows, 4 Columns
    tbl_sale = doc.add_table(rows=14, cols=4)
    set_table_borders(tbl_sale, COLOR_BORDER)
    tbl_sale.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_sale.rows:
        for idx, w in enumerate(std_w):
            r.cells[idx].width = w

    # Row 0: Section Header "Sale Department" (Yellow)
    c_s0 = tbl_sale.cell(0, 0)
    for i in range(1, 4):
        c_s0.merge(tbl_sale.cell(0, i))
    set_cell_background(c_s0, COLOR_YELLOW)
    set_cell_margins(c_s0, 80, 80, 100, 100)
    add_cell_content(c_s0, "Sale Department", bold=True, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 1: Customer Code | 02545 | Customer Name | Acme Global Trading Co., Ltd.
    tbl_sale.cell(1, 0).text = ""; set_cell_background(tbl_sale.cell(1, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(1, 0), "Customer Code *", bold=False)
    tbl_sale.cell(1, 1).text = ""; set_cell_background(tbl_sale.cell(1, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(1, 1), "02545", bold=False)
    tbl_sale.cell(1, 2).text = ""; set_cell_background(tbl_sale.cell(1, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(1, 2), "Customer Name *", bold=False)
    tbl_sale.cell(1, 3).text = ""; set_cell_background(tbl_sale.cell(1, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(1, 3), "Acme Global Trading Co., Ltd.", bold=False)

    # Row 2: Customer Country | Japan | Address | Tokyo, Japan
    tbl_sale.cell(2, 0).text = ""; set_cell_background(tbl_sale.cell(2, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(2, 0), "Country", bold=False)
    tbl_sale.cell(2, 1).text = ""; set_cell_background(tbl_sale.cell(2, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(2, 1), "Japan", bold=False)
    tbl_sale.cell(2, 2).text = ""; set_cell_background(tbl_sale.cell(2, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(2, 2), "Address", bold=False)
    tbl_sale.cell(2, 3).text = ""; set_cell_background(tbl_sale.cell(2, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(2, 3), "1-8-2 Marunouchi, Chiyoda-ku, Tokyo", bold=False)

    # Row 3: Contact Person | Thomason | Email / Telephone | XXXXXXXXX
    tbl_sale.cell(3, 0).text = ""; set_cell_background(tbl_sale.cell(3, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(3, 0), "Contact Person", bold=False)
    tbl_sale.cell(3, 1).text = ""; set_cell_background(tbl_sale.cell(3, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(3, 1), "Thomason (ไม่บังคับ)", bold=False)
    tbl_sale.cell(3, 2).text = ""; set_cell_background(tbl_sale.cell(3, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(3, 2), "Email / Telephone", bold=False)
    tbl_sale.cell(3, 3).text = ""; set_cell_background(tbl_sale.cell(3, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(3, 3), "thomason@abc-biomass.jp / XXXXXXXXX", bold=False)

    # Row 4: PO No. * | PO-2026-09821 | Order No. * | ORD-2026-04159
    tbl_sale.cell(4, 0).text = ""; set_cell_background(tbl_sale.cell(4, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(4, 0), "PO No. *", bold=False)
    tbl_sale.cell(4, 1).text = ""; set_cell_background(tbl_sale.cell(4, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(4, 1), "PO-2026-09821 (PO-ABC-2026-001)", bold=False)
    tbl_sale.cell(4, 2).text = ""; set_cell_background(tbl_sale.cell(4, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(4, 2), "Order No. *", bold=False)
    tbl_sale.cell(4, 3).text = ""; set_cell_background(tbl_sale.cell(4, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(4, 3), "ORD-2026-04159", bold=False)

    # Row 5: PI NO. | PO-ABC-2026-001 | MO No (RED) | a346534534 (RED)
    tbl_sale.cell(5, 0).text = ""; set_cell_background(tbl_sale.cell(5, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(5, 0), "PI NO. *", bold=False)
    tbl_sale.cell(5, 1).text = ""; set_cell_background(tbl_sale.cell(5, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(5, 1), "PO-ABC-2026-001", bold=False)
    tbl_sale.cell(5, 2).text = ""; set_cell_background(tbl_sale.cell(5, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(5, 2), "MO No", bold=False, color_rgb=(220, 38, 38)) # Red Label
    tbl_sale.cell(5, 3).text = ""; set_cell_background(tbl_sale.cell(5, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(5, 3), "a346534534", bold=False, color_rgb=(220, 38, 38)) # Red text

    # Row 6: Product Code * | PRD-88204-X | Product Name* | Industrial Hydraulic Valve Model-X (Wood Pellets)
    tbl_sale.cell(6, 0).text = ""; set_cell_background(tbl_sale.cell(6, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(6, 0), "Product Code *", bold=False)
    tbl_sale.cell(6, 1).text = ""; set_cell_background(tbl_sale.cell(6, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(6, 1), "PRD-88204-X / WP-001", bold=False)
    tbl_sale.cell(6, 2).text = ""; set_cell_background(tbl_sale.cell(6, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(6, 2), "Product Name*", bold=False)
    tbl_sale.cell(6, 3).text = ""; set_cell_background(tbl_sale.cell(6, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(6, 3), "Wood Pellets (Industrial Hydraulic Valve Model-X)", bold=False)

    # Row 7: Product Type* | 1-0.6mm, 2-0.8mm | Quantity * | 500 Ton / 5,000 MT
    tbl_sale.cell(7, 0).text = ""; set_cell_background(tbl_sale.cell(7, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(7, 0), "Product Type*", bold=False)
    tbl_sale.cell(7, 1).text = ""; set_cell_background(tbl_sale.cell(7, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(7, 1), "1. 0.6mm± 1 mm, 2. 0.8mm ± 1 mm", bold=False)
    tbl_sale.cell(7, 2).text = ""; set_cell_background(tbl_sale.cell(7, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(7, 2), "Quantity *", bold=False)
    tbl_sale.cell(7, 3).text = ""; set_cell_background(tbl_sale.cell(7, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(7, 3), "5,000 MT (500 Ton)  [Unit: MT / kg / Ton/KK]", bold=False)

    # Row 8: Certificate Requirement * | SPB, GGL
    tbl_sale.cell(8, 0).text = ""; set_cell_background(tbl_sale.cell(8, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(8, 0), "Certificate Requirement *", bold=False)
    c_cert = tbl_sale.cell(8, 1)
    c_cert.merge(tbl_sale.cell(8, 2))
    c_cert.merge(tbl_sale.cell(8, 3))
    set_cell_background(c_cert, COLOR_WHITE)
    add_cell_content(c_cert, "SPB, GGL (ทำเป็นตัวเลือกให้เลือกได้ 2 อันขึ้นไป)", bold=False)

    # Row 9: Customer Requirement* (Spans across cols 1-3)
    tbl_sale.cell(9, 0).text = ""; set_cell_background(tbl_sale.cell(9, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(9, 0), "Customer Requirement*", bold=False)
    c_creq = tbl_sale.cell(9, 1)
    c_creq.merge(tbl_sale.cell(9, 2))
    c_creq.merge(tbl_sale.cell(9, 3))
    set_cell_background(c_creq, COLOR_WHITE)
    add_cell_content(c_creq, "High precision pressure resistance up to 350 bar with rust-proof coating (ดูตารางสเปกด้านล่าง)", bold=False)

    # Row 10: Special Requirement* (Spans across cols 1-3)
    tbl_sale.cell(10, 0).text = ""; set_cell_background(tbl_sale.cell(10, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(10, 0), "Special Requirement*", bold=False)
    c_sreq = tbl_sale.cell(10, 1)
    c_sreq.merge(tbl_sale.cell(10, 2))
    c_sreq.merge(tbl_sale.cell(10, 3))
    set_cell_background(c_sreq, COLOR_WHITE)
    add_cell_content(c_sreq, "Must pass ISO 9001:2015 inspection with full Certificate of Analysis (CoA) and mill test report attached. (ดูตาราง 9 ข้อด้านล่าง)", bold=False)

    # Row 11: Production Planning (Sub-header in Yellow)
    c_plh = tbl_sale.cell(11, 0)
    for i in range(1, 4):
        c_plh.merge(tbl_sale.cell(11, i))
    set_cell_background(c_plh, COLOR_YELLOW)
    set_cell_margins(c_plh, 80, 80, 100, 100)
    add_cell_content(c_plh, "Production Planning", bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 12: Start Date* (Yellow) | 2026/09/30 (GREEN) | End Date* (Yellow) | 2026/10/30 (GREEN)
    tbl_sale.cell(12, 0).text = ""; set_cell_background(tbl_sale.cell(12, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(12, 0), "Start Date*", bold=False)
    tbl_sale.cell(12, 1).text = ""; set_cell_background(tbl_sale.cell(12, 1), COLOR_GREEN);  add_cell_content(tbl_sale.cell(12, 1), "2026/09/30", bold=False)
    tbl_sale.cell(12, 2).text = ""; set_cell_background(tbl_sale.cell(12, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(12, 2), "End Date*", bold=False)
    tbl_sale.cell(12, 3).text = ""; set_cell_background(tbl_sale.cell(12, 3), COLOR_GREEN);  add_cell_content(tbl_sale.cell(12, 3), "2026/10/30", bold=False)

    # Row 13: Requested Delivery Date* (Yellow) | 2026/12/15 (GREEN) | Ship-to Location * (Yellow) | Eastern Seaboard Industrial Estate, Rayong (WHITE)
    tbl_sale.cell(13, 0).text = ""; set_cell_background(tbl_sale.cell(13, 0), COLOR_YELLOW); add_cell_content(tbl_sale.cell(13, 0), "Requested Delivery Date*", bold=False)
    tbl_sale.cell(13, 1).text = ""; set_cell_background(tbl_sale.cell(13, 1), COLOR_GREEN);  add_cell_content(tbl_sale.cell(13, 1), "2026/12/15 (30/11/2026)", bold=False)
    tbl_sale.cell(13, 2).text = ""; set_cell_background(tbl_sale.cell(13, 2), COLOR_YELLOW); add_cell_content(tbl_sale.cell(13, 2), "Ship-to Location *", bold=False)
    tbl_sale.cell(13, 3).text = ""; set_cell_background(tbl_sale.cell(13, 3), COLOR_WHITE);  add_cell_content(tbl_sale.cell(13, 3), "Port of Japan / Eastern Seaboard Industrial Estate, Rayong", bold=False)

    # Set cell margins for all cells in tbl_sale
    for r in tbl_sale.rows:
        for c in r.cells:
            set_cell_margins(c, 60, 60, 80, 80)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -----------------------------------------------------------------
    # CUSTOMER REQUIREMENT TABLE (MATCHING YELLOW-WHITE-GREEN THEME)
    # -----------------------------------------------------------------
    p_cr_h = doc.add_paragraph()
    r_crh = p_cr_h.add_run("Customer Requirement: ตัวอย่าง (สเปกเม็ดไม้ชีวมวล 11 รายการ)")
    r_crh.bold = True
    r_crh.font.name = "Times New Roman"
    r_crh.font.size = Pt(10.5)
    p_cr_h.paragraph_format.space_after = Pt(2)

    tbl_creq = doc.add_table(rows=12, cols=3)
    set_table_borders(tbl_creq, COLOR_BORDER)
    tbl_creq.alignment = WD_TABLE_ALIGNMENT.CENTER
    creq_w = [Inches(0.6), Inches(2.6), Inches(3.9)]
    for r in tbl_creq.rows:
        for idx, w in enumerate(creq_w):
            r.cells[idx].width = w

    creq_items = [
        ["No.", "Topic", "Detail"],
        ["1", "Raw Material", "Rubberwood"],
        ["2", "Pellet Diameter", "0.6mm± 1 mm"],
        ["3", "Moisture Content", "≤ 10%"],
        ["4", "Ash Content", "≤ 3%"],
        ["5", "Net Calorific Value", "≥ 4,000 kcal/kg"],
        ["6", "Bulk Density", "≥ 600 kg/m³"],
        ["7", "Fines Content", "≤ 1%"],
        ["8", "Packaging", "Bulk Shipment"],
        ["9", "Quality Certificate", "Certificate of Analysis (COA)"],
        ["10", "Inspection", "Pre-shipment Inspection"],
        ["11", "Required Documents", "Commercial Invoice, Packing List, COA, Bill of Lading"]
    ]

    for r_idx, row in enumerate(tbl_creq.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 50, 50, 70, 70)
            if r_idx == 0:
                set_cell_background(cell, COLOR_YELLOW)
                add_cell_content(cell, creq_items[r_idx][c_idx], bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                set_cell_background(cell, COLOR_YELLOW if c_idx == 1 else COLOR_WHITE)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(cell, creq_items[r_idx][c_idx], bold=(c_idx==1), align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -----------------------------------------------------------------
    # SPECIAL REQUIREMENT TABLE (9 ITEMS)
    # -----------------------------------------------------------------
    p_sr_h = doc.add_paragraph()
    r_srh = p_sr_h.add_run("Special Requirement: ตัวอย่าง ต้องแจ้งลูกค้าหากคุณภาพของสินค้าไม่เป็นไปตามข้อกำหนด")
    r_srh.bold = True
    r_srh.font.name = "Times New Roman"
    r_srh.font.size = Pt(10.5)
    p_sr_h.paragraph_format.space_after = Pt(2)

    tbl_sreq = doc.add_table(rows=10, cols=3)
    set_table_borders(tbl_sreq, COLOR_BORDER)
    tbl_sreq.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_sreq.rows:
        for idx, w in enumerate(creq_w):
            r.cells[idx].width = w

    sreq_items = [
        ["No.", "Special Requirement", "รายละเอียดข้อกำหนด"],
        ["1", "Moisture Control", "ความชื้นต้องไม่เกิน 8%"],
        ["2", "Quality Inspection", "ต้องตรวจสอบคุณภาพทุก Batch"],
        ["3", "COA Approval", "ต้องส่ง COA ให้ลูกค้าตรวจสอบก่อนโหลดสินค้า"],
        ["4", "Raw Material Control", "ใช้วัตถุดิบตามแหล่งและประเภทที่ลูกค้าอนุมัติ"],
        ["5", "Product Contamination", "ต้องไม่มีสิ่งแปลกปลอมที่ไม่เป็นไปตามข้อกำหนด"],
        ["6", "Pellet Durability", "ต้องมีความทนทานของเม็ดตามค่าที่ลูกค้ากำหนด"],
        ["7", "Shipment Inspection", "ต้องตรวจสอบสินค้าก่อนเริ่มโหลดขึ้นเรือ"],
        ["8", "Weather Protection", "ต้องป้องกันสินค้าเปียกฝนระหว่างการจัดเก็บและขนส่ง"],
        ["9", "Shipment Documents", "ต้องส่งเอกสารตามรายการที่ลูกค้ากำหนด"]
    ]

    for r_idx, row in enumerate(tbl_sreq.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 50, 50, 70, 70)
            if r_idx == 0:
                set_cell_background(cell, COLOR_YELLOW)
                add_cell_content(cell, sreq_items[r_idx][c_idx], bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                set_cell_background(cell, COLOR_YELLOW if c_idx == 1 else COLOR_WHITE)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(cell, sreq_items[r_idx][c_idx], bold=(c_idx==1), align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -----------------------------------------------------------------
    # OTHER SPECIAL REQUIREMENT & COMPLAINT SECTION
    # -----------------------------------------------------------------
    tbl_comp = doc.add_table(rows=3, cols=2)
    set_table_borders(tbl_comp, COLOR_BORDER)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_comp.rows[0].cells[0].width = Inches(2.3)
    tbl_comp.rows[0].cells[1].width = Inches(4.8)
    tbl_comp.rows[1].cells[0].width = Inches(2.3)
    tbl_comp.rows[1].cells[1].width = Inches(4.8)
    tbl_comp.rows[2].cells[0].width = Inches(2.3)
    tbl_comp.rows[2].cells[1].width = Inches(4.8)

    tbl_comp.cell(0, 0).text = ""; set_cell_background(tbl_comp.cell(0, 0), COLOR_YELLOW); add_cell_content(tbl_comp.cell(0, 0), "Other Special Requirement", bold=True)
    tbl_comp.cell(0, 1).text = ""; set_cell_background(tbl_comp.cell(0, 1), COLOR_WHITE);  add_cell_content(tbl_sale.cell(0, 1), "XXXXXXX", bold=False)

    tbl_comp.cell(1, 0).text = ""; set_cell_background(tbl_comp.cell(1, 0), COLOR_YELLOW); add_cell_content(tbl_comp.cell(1, 0), "Customer complain", bold=True)
    tbl_comp.cell(1, 1).text = ""; set_cell_background(tbl_comp.cell(1, 1), COLOR_WHITE);  add_cell_content(tbl_comp.cell(1, 1), "XXXXXXX", bold=False)

    tbl_comp.cell(2, 0).text = ""; set_cell_background(tbl_comp.cell(2, 0), COLOR_YELLOW); add_cell_content(tbl_comp.cell(2, 0), "Status Customer complain", bold=True)
    tbl_comp.cell(2, 1).text = ""; set_cell_background(tbl_comp.cell(2, 1), COLOR_GREEN);  add_cell_content(tbl_comp.cell(2, 1), "open or close\n****(sale สามารถเปลี่ยนแปลงข้อมูลได้ทุก vender ระหว่างการผลิต) ****", bold=False)

    for r in tbl_comp.rows:
        for c in r.cells:
            set_cell_margins(c, 60, 60, 80, 80)

    doc.add_page_break()

    # -----------------------------------------------------------------
    # STEP 2: PLANNING (WOODS MATERIAL PLANNING)
    # -----------------------------------------------------------------
    p_step2_lbl = doc.add_paragraph()
    r_s2l = p_step2_lbl.add_run("2. Planning — Production Woods material planning - Step")
    r_s2l.bold = True
    r_s2l.italic = True
    r_s2l.font.name = "Times New Roman"
    r_s2l.font.size = Pt(11)
    p_step2_lbl.paragraph_format.space_after = Pt(2)

    tbl_plan = doc.add_table(rows=7, cols=4)
    set_table_borders(tbl_plan, COLOR_BORDER)
    tbl_plan.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in tbl_plan.rows:
        for idx, w in enumerate(std_w):
            r.cells[idx].width = w

    # Row 0: Section Header
    c_p0 = tbl_plan.cell(0, 0)
    for i in range(1, 4):
        c_p0.merge(tbl_plan.cell(0, i))
    set_cell_background(c_p0, COLOR_YELLOW)
    set_cell_margins(c_p0, 80, 80, 100, 100)
    add_cell_content(c_p0, "Production — Woods material planning", bold=True, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Row 1: *PI NO. | PO-ABC-2026-001 | *MO No. | MP202600XX
    tbl_plan.cell(1, 0).text = ""; set_cell_background(tbl_plan.cell(1, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(1, 0), "*PI NO.:", bold=False)
    tbl_plan.cell(1, 1).text = ""; set_cell_background(tbl_plan.cell(1, 1), COLOR_WHITE);  add_cell_content(tbl_plan.cell(1, 1), "PO-ABC-2026-001", bold=False)
    tbl_plan.cell(1, 2).text = ""; set_cell_background(tbl_plan.cell(1, 2), COLOR_YELLOW); add_cell_content(tbl_plan.cell(1, 2), "*MO No.:", bold=False, color_rgb=(220, 38, 38))
    tbl_plan.cell(1, 3).text = ""; set_cell_background(tbl_plan.cell(1, 3), COLOR_WHITE);  add_cell_content(tbl_plan.cell(1, 3), "MP202600XX", bold=False, color_rgb=(220, 38, 38))

    # Row 2: *Plan Date start (GREEN) | 2026/09/28 | *Plan Date Finish (GREEN) | 2026/09/30
    tbl_plan.cell(2, 0).text = ""; set_cell_background(tbl_plan.cell(2, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(2, 0), "*Plan Date start", bold=False)
    tbl_plan.cell(2, 1).text = ""; set_cell_background(tbl_plan.cell(2, 1), COLOR_GREEN);  add_cell_content(tbl_plan.cell(2, 1), "2026/09/28", bold=False)
    tbl_plan.cell(2, 2).text = ""; set_cell_background(tbl_plan.cell(2, 2), COLOR_YELLOW); add_cell_content(tbl_plan.cell(2, 2), "*Plan Date Finish", bold=False)
    tbl_plan.cell(2, 3).text = ""; set_cell_background(tbl_plan.cell(2, 3), COLOR_GREEN);  add_cell_content(tbl_plan.cell(2, 3), "2026/09/30", bold=False)

    # Row 3: *Production Batch | SBP-xx-YY-02-3003 | *Production Description | Rubber wood pellets
    tbl_plan.cell(3, 0).text = ""; set_cell_background(tbl_plan.cell(3, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(3, 0), "*Production Batch:", bold=False)
    tbl_plan.cell(3, 1).text = ""; set_cell_background(tbl_plan.cell(3, 1), COLOR_WHITE);  add_cell_content(tbl_plan.cell(3, 1), "SBP-xx-YY-02-3003", bold=False)
    tbl_plan.cell(3, 2).text = ""; set_cell_background(tbl_plan.cell(3, 2), COLOR_YELLOW); add_cell_content(tbl_plan.cell(3, 2), "*Production Description:", bold=False)
    tbl_plan.cell(3, 3).text = ""; set_cell_background(tbl_plan.cell(3, 3), COLOR_WHITE);  add_cell_content(tbl_plan.cell(3, 3), "Rubber wood pellets", bold=False)

    # Row 4: *Certificate Scheme | SPB, GGL | *Product Code | Bwp.12-08
    tbl_plan.cell(4, 0).text = ""; set_cell_background(tbl_plan.cell(4, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(4, 0), "*Certificate Scheme:", bold=False)
    tbl_plan.cell(4, 1).text = ""; set_cell_background(tbl_plan.cell(4, 1), COLOR_WHITE);  add_cell_content(tbl_plan.cell(4, 1), "SPB, GGL (ทำเป็นตัวเลือกให้เลือกได้ 2 อันขึ้นไป)", bold=False)
    tbl_plan.cell(4, 2).text = ""; set_cell_background(tbl_plan.cell(4, 2), COLOR_YELLOW); add_cell_content(tbl_plan.cell(4, 2), "* Product Code :", bold=False)
    tbl_plan.cell(4, 3).text = ""; set_cell_background(tbl_plan.cell(4, 3), COLOR_WHITE);  add_cell_content(tbl_plan.cell(4, 3), "Bwp.12-08", bold=False)

    # Row 5: *Volume / Planned Quantity | 5,000 MT / 20,00 Ton/KK | *Unit | MT (metric tons ), kg.
    tbl_plan.cell(5, 0).text = ""; set_cell_background(tbl_plan.cell(5, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(5, 0), "*Volume / Planned Quantity*", bold=False)
    tbl_plan.cell(5, 1).text = ""; set_cell_background(tbl_plan.cell(5, 1), COLOR_WHITE);  add_cell_content(tbl_plan.cell(5, 1), "5,000 MT (20,00 Ton/KK) | Actual: 15,000 Ton/KK", bold=False)
    tbl_plan.cell(5, 2).text = ""; set_cell_background(tbl_plan.cell(5, 2), COLOR_YELLOW); add_cell_content(tbl_plan.cell(5, 2), "*Unit :", bold=False)
    tbl_plan.cell(5, 3).text = ""; set_cell_background(tbl_plan.cell(5, 3), COLOR_WHITE);  add_cell_content(tbl_plan.cell(5, 3), "MT (metric tons ), kg.", bold=False)

    # Row 6: Raw Material Requirement* (Hammer mill, Flaker 3, Flaker 4)
    tbl_plan.cell(6, 0).text = ""; set_cell_background(tbl_plan.cell(6, 0), COLOR_YELLOW); add_cell_content(tbl_plan.cell(6, 0), "Raw Material Requirement*", bold=False)
    c_raw = tbl_plan.cell(6, 1)
    c_raw.merge(tbl_plan.cell(6, 2))
    c_raw.merge(tbl_plan.cell(6, 3))
    set_cell_background(c_raw, COLOR_WHITE)
    add_cell_content(c_raw, "[ ■ ] Hummer mill       [ ■ ] Flaker 3       [ ■ ] Flaker 4\n(Table: grh_V_combo Multi-select)", bold=False)

    for r in tbl_plan.rows:
        for c in r.cells:
            set_cell_margins(c, 60, 60, 80, 80)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -----------------------------------------------------------------
    # 2. FILL FORM FIELDS (M-TABLE-SCHEMA & S-TABLE-SCHEMA)
    # -----------------------------------------------------------------
    p_m_lbl = doc.add_paragraph()
    r_ml = p_m_lbl.add_run("2. Fill form fields\n2.1 M-Table-Schema (Master Sales Form Fields)")
    r_ml.bold = True
    r_ml.font.name = "Times New Roman"
    r_ml.font.size = Pt(11)
    p_m_lbl.paragraph_format.space_after = Pt(2)

    tbl_mschema = doc.add_table(rows=17, cols=8)
    set_table_borders(tbl_mschema, COLOR_BORDER)
    tbl_mschema.alignment = WD_TABLE_ALIGNMENT.CENTER
    m_widths = [Inches(1.3), Inches(1.2), Inches(0.7), Inches(0.8), Inches(0.4), Inches(0.6), Inches(0.8), Inches(1.3)]
    for r in tbl_mschema.rows:
        for idx, w in enumerate(m_widths):
            r.cells[idx].width = w

    mschema_data = [
        ["Field Name", "Description", "Type", "Data Type", "Req", "Default", "Data Source", "remark"],
        ["sale_customer_code", "Customer Code", "", "Nvarchar(20)", "V", "", "", ""],
        ["sale_customer_name", "Customer Name", "", "Nvarchar(255)", "V", "", "", ""],
        ["sale_po_no", "PO No.", "", "Nvarchar(20)", "V", "", "", ""],
        ["sale_order_no", "Order No.", "", "Nvarchar(100)", "v", "", "", ""],
        ["sale_product_code", "Product Code", "", "Nvarchar(150)", "V", "", "", ""],
        ["sale_product_name", "Product Name", "", "Navarchar(255)", "v", "", "", ""],
        ["sale_product_type", "Product Type", "", "Nvarchar(100)", "v", "", "", ""],
        ["sale_quantity", "Quantity", "", "int", "v", "", "", ""],
        ["sale_quantity_unit", "Unit", "", "Nvarchar(20)", "v", "", "", ""],
        ["sale_customer_req", "Customer Requirement", "", "Nvarchar(255)", "v", "", "", ""],
        ["sale_special_req", "Special Requirement", "", "Nvarchar(255)", "v", "", "", ""],
        ["sale_certificate_Req", "Certificate Requirement", "", "Nvarchar(20)", "v", "", "", ""],
        ["sale_delivery_date", "Delivery date", "", "date", "v", "", "", ""],
        ["sale_ship_to", "Ship-to Location", "", "Nvarchar(150)", "v", "", "", ""],
        ["prod_rawMaterail_reg", "Raw Material Requirement", "Multi select", "Nvarchar(100)", "v", "", "Table : grh_V_combo", "Filter / Display / Value"],
        ["prod_planned_qty", "Planned Quantity", "", "Nvarchar(50)", "v", "", "", ""]
    ]

    for r_idx, row in enumerate(tbl_mschema.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 50, 50, 60, 60)
            if r_idx == 0:
                set_cell_background(cell, COLOR_YELLOW)
                add_cell_content(cell, mschema_data[r_idx][c_idx], bold=True, font_size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                set_cell_background(cell, COLOR_YELLOW if c_idx == 1 else COLOR_WHITE)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [2, 3, 4] else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(cell, mschema_data[r_idx][c_idx], bold=(c_idx==0), font_size=8.5, align=align)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -----------------------------------------------------------------
    # APPROVAL PROCESS & LIFECYCLE
    # -----------------------------------------------------------------
    p_app_lbl = doc.add_paragraph()
    r_al = p_app_lbl.add_run("4. Approval Process\n4.2 Explanation of approval steps")
    r_al.bold = True
    r_al.font.name = "Times New Roman"
    r_al.font.size = Pt(11)
    p_app_lbl.paragraph_format.space_after = Pt(2)

    tbl_app = doc.add_table(rows=8, cols=3)
    set_table_borders(tbl_app, COLOR_BORDER)
    tbl_app.alignment = WD_TABLE_ALIGNMENT.CENTER
    app_w = [Inches(2.2), Inches(2.3), Inches(2.6)]
    for r in tbl_app.rows:
        for idx, w in enumerate(app_w):
            r.cells[idx].width = w

    app_data = [
        ["Step Name", "Function", "Step Remark"],
        ["1.Start -Sale", "- Submit\n- withdraw", ""],
        ["2.RA", "- Agree 🡺Next\n- Rejected 🡺Complete\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request\n(2) attachment required"],
        ["3.Production Woods material planning", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request"],
        ["4.Production Pelletizing(QC)", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request"],
        ["5.QA", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request"],
        ["6.Warehouse/Store", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request"],
        ["7.Shipping", "- Agree 🡺Next\n- Rejected 🡺Return\n- Other/QueryOpinion,Waiting", "(1).Get email – Approval Request"]
    ]

    for r_idx, row in enumerate(tbl_app.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_margins(cell, 50, 50, 70, 70)
            if r_idx == 0:
                set_cell_background(cell, COLOR_YELLOW)
                add_cell_content(cell, app_data[r_idx][c_idx], bold=True, font_size=9, align=WD_ALIGN_PARAGRAPH.CENTER)
            else:
                set_cell_background(cell, COLOR_YELLOW if c_idx == 0 else COLOR_WHITE)
                align = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 1 else WD_ALIGN_PARAGRAPH.LEFT
                add_cell_content(cell, app_data[r_idx][c_idx], bold=(c_idx==0), font_size=9, align=align)

    p_rem = doc.add_paragraph()
    r_rem = p_rem.add_run("Remark:\n- During the approval process, form fields cannot be modified.\nIf any adjustments are required, the form will be rejected and returned to the requester for data modification.\nRequirement specification document\nIf there are any change requirements, a change request will be raised and handled separately.")
    r_rem.font.name = "Times New Roman"
    r_rem.font.size = Pt(9)
    r_rem.font.italic = True
    p_rem.paragraph_format.space_before = Pt(4)

    # -----------------------------------------------------------------
    # Save target paths
    # -----------------------------------------------------------------
    dest_folder = r"D:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets"
    filename = "WoodPellets_Sales_Document_Spec_20261021.docx"
    dest_path = os.path.join(dest_folder, filename)

    # 1. Save directly to requested folder
    doc.save(dest_path)
    print(f"Saved directly to requested path: {dest_path}")

    # 2. Also save to current workspace
    ws_path = os.path.join(r"d:\ALL_DATAs__(PA)\VSCode_Files_MyPC\BPM\_Working On\_Wood_Pellets\Dashboard_20261005", filename)
    doc.save(ws_path)
    print(f"Saved copy to workspace: {ws_path}")

    # 3. Also copy to IIS path
    iis_path = os.path.join(r"D:\Inetpub\WWWRoot\BPM\wood_pellets", filename)
    try:
        doc.save(iis_path)
        print(f"Saved copy to IIS path: {iis_path}")
    except Exception as e:
        print(f"IIS copy note: {e}")

if __name__ == "__main__":
    create_sales_spec_document()
