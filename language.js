const translations = {
  th: {
    header_title: "Green River Panels — Wood Pellets Operations Dashboard",
    header_subtitle: "ระบบติดตามขั้นตอนการผลิตและจัดส่งสินค้าแบบ Real-time",
    sys_live: "System Live",

    // Navigation
    nav_dashboard: "ภาพรวม Dashboard",
    nav_query: "สืบค้นคำสั่งซื้อ (Order Query)",
    nav_map: "แผนที่พิกัดรวม (GIS Map)",

    // KPI
    kpi_active: "ยอดรวมคำสั่งซื้อ",
    kpi_active_sub: "+12% จากเดือนที่แล้ว",

    kpi_prod: "ความคืบหน้าการผลิต",

    kpi_ship: "จัดส่งแล้ว",
    kpi_ship_sub: "2026/10/29",

    kpi_qa: "รายการเบี่ยงเบนด้านคุณภาพ",
    kpi_qa_cases: "รายการ",
    kpi_qa_sub: "ผ่านเกณฑ์มาตรฐาน ISO 9001",

    // Pipeline
    pipeline_title: "ภาพรวมสถานะขั้นตอนการทำงาน (7-Step Pipeline)",
    step1_name: "ฝ่ายขาย",
    step2_name: "ฝ่ายกำกับดูแล (RA)",
    approved_badge: "อนุมัติแล้ว",
    step3_name: "การผลิต — การวางแผนวัสดุสำหรับงานไม้",
    step3_status: "สถานะ: เปิดดำเนินการ",
    step4_name: "ตรวจสอบคุณภาพ",
    step4_val: "ไม่พบข้อเบี่ยงเบน",
    step4_sub: "สร้าง COA แล้ว",
    step5_name: "คลังสินค้า",
    step5_sub: "พร้อมจัดเตรียมสินค้า",
    step6_name: "จัดส่ง",

    // Production & QC
    prod_section_title: "สรุปการผลิตและการทำงาน",
    prod_planned: "ยอดตามแผน",
    prod_actual: "ผลิตจริง",
    raw_material_title: "สถานะเครื่องจักรหลัก",
    schedule_title: "กำหนดการผลิต",
    start_date: "เริ่มต้น",
    end_date: "สิ้นสุด",
    wood_pellets_qc_title: "พารามิเตอร์คุณภาพ (Pelletizing QC)",
    pellet_diameter: "ขนาดเม็ดไม้ (Diameter)",
    pellet_moisture: "ความชื้นเครื่องอัด (Moisture)",
    cooling_moisture: "ความชื้นหลังระบายความร้อน (Cooling)",
    total_downtime: "เวลารวมเครื่องหยุด (Downtime)",
    yield_qty: "ปริมาณ Yield รวม",
    stock_movement: "การเคลื่อนไหวสต็อก (Warehouse 1)",
    btn_view_bpm: "ดูแบบฟอร์ม BPM ฉบับเต็ม (Full BPM Form)",

    // Shipment
    shipment_section_title: "รายการจัดส่งและกำหนดการสำคัญ",
    view_all: "ดูทั้งหมด &rarr;",

    // Table
    th_no: "ลำดับ",
    th_sa: "SA Number / Customer",
    th_pod: "Destination & Shipping Line",
    th_status: "สถานะ",
    th_etd: "ETD",
    th_eta: "ETA",

    // Query Page
    query_title: "สืบค้นรายการคำสั่งซื้อทั้งหมด (Order Master Query)",
    query_subtitle: "ค้นหา กรองข้อมูล และส่งออกรายงาน (20 แถว/หน้า)",
    search_mo_order_placeholder: "ค้นหาด้วย Order No, MO No, PO No, ชื่อลูกค้า, หรือ Destination...",
    filter_step: "เลือกขั้นตอน (Step)",
    filter_status: "เลือกสถานะ",
    all_steps: "ทุกขั้นตอน (All Steps)",
    all_statuses: "ทุกสถานะ (All Statuses)",
    rows_per_page: "แถวต่อหน้า",
    pagination_info: "แสดง {start}-{end} จากทั้งหมด {total} รายการ",
    th_mo_no: "MO No.",
    th_po_no: "PO No.",
    th_product: "สินค้า & สเปก",
    th_step: "ขั้นตอนปัจจุบัน",
    th_progress: "ความคืบหน้า",
    th_actions: "การจัดการ",
    btn_view_in_dashboard: "เปิดใน Dashboard",

    // Status
    status_onschedule: "ตามกำหนดการ",
    status_inproduction: "อยู่ระหว่างการผลิต",

    // Location
    rayong_loc: "ระยอง, ประเทศไทย",

    // Regulatory
    reg_title: "แจ้งเตือนใบอนุญาตและมาตรการควบคุม",
    reg_desc:
      "ใบอนุญาตส่งออกและขนส่งมีกำหนดหมดอายุวันที่ <strong>2027-03-31</strong> (ต้องดำเนินการต่ออายุล่วงหน้า 30 วันก่อนวันหมดอายุ)",

    // Search
    result_count: "แสดง {count} รายการ",
    no_data: "ไม่พบข้อมูลที่ค้นหา",
    search_placeholder: "ค้นหาด้วย Order No, ชื่อลูกค้า, หรือ POD...",

    // Common
    etd_label: "ETD",
    no_order_data: "ไม่พบข้อมูลคำสั่งซื้อ",
    no_production_data: "ไม่มีข้อมูลการผลิต",
    btn_gps_map: "พิกัด GPS",
    map_modal_title: "พิกัดแปลงปลูกไม้และโรงงาน (EUDR Geolocation)",
    open_google_maps: "เปิดดูใน Google Maps",
  },

  en: {
    header_title: "Green River Panels — Wood Pellets Operations Dashboard",
    header_subtitle: "Real-time production and shipment tracking system",
    sys_live: "System Live",

    // Navigation
    nav_dashboard: "Dashboard Overview",
    nav_query: "Order Query & Reports",
    nav_map: "GIS Map Overview",

    // KPI
    kpi_active: "Total Orders",
    kpi_active_sub: "+12% from last month",

    kpi_prod: "Production Progress",

    kpi_ship: "Shipped",
    kpi_ship_sub: "2026/10/29",

    kpi_qa: "Quality Deviations",
    kpi_qa_cases: "Cases",
    kpi_qa_sub: "Passed ISO 9001 standard",

    // Pipeline
    pipeline_title: "Workflow Status Overview (7-Step Pipeline)",
    step1_name: "Sales Department",
    step2_name: "Regulatory (RA)",
    approved_badge: "APPROVED",
    step3_name: "Production — Woods material planning",
    step3_status: "Status: Open (In Progress)",
    step4_name: "QA Inspection",
    step4_val: "Zero Deviation",
    step4_sub: "COA Generated",
    step5_name: "Warehouse",
    step5_sub: "Ready for Pick",
    step6_name: "Shipment",

    // Production & QC
    prod_section_title: "Production & Machinery Operations",
    prod_planned: "Planned Quantity",
    prod_actual: "Actual Quantity",
    raw_material_title: "Primary Machinery Status",
    schedule_title: "Production Schedule",
    start_date: "Start",
    end_date: "End",
    wood_pellets_qc_title: "Quality Parameters (Pelletizing QC)",
    pellet_diameter: "Pellet Diameter",
    pellet_moisture: "Machine Moisture",
    cooling_moisture: "Cooling Moisture",
    total_downtime: "Total Downtime",
    yield_qty: "Total Yield",
    stock_movement: "Stock Movement (Warehouse 1)",
    btn_view_bpm: "View Full BPM Form",

    // Shipment
    shipment_section_title: "Shipment & Key Schedule",
    view_all: "View All &rarr;",

    // Table
    th_no: "No.",
    th_sa: "SA Number / Customer",
    th_pod: "Destination & Shipping Line",
    th_status: "Status",
    th_etd: "ETD",
    th_eta: "ETA",

    // Query Page
    query_title: "Order Master Query & Search",
    query_subtitle: "Search, filter, and export customized data reports (20 rows/page)",
    search_mo_order_placeholder: "Search by Order No, MO No, PO No, Customer, Destination...",
    filter_step: "Select Step",
    filter_status: "Select Status",
    all_steps: "All Steps",
    all_statuses: "All Statuses",
    rows_per_page: "Rows per page",
    pagination_info: "Showing {start}-{end} of {total} records",
    th_mo_no: "MO No.",
    th_po_no: "PO No.",
    th_product: "Product & Spec",
    th_step: "Current Step",
    th_progress: "Progress",
    th_actions: "Actions",
    btn_view_in_dashboard: "Open in Dashboard",

    // Status
    status_onschedule: "On Schedule",
    status_inproduction: "In Production",

    // Location
    rayong_loc: "Rayong, Thailand",

    // Regulatory
    reg_title: "Regulatory Expiry Notice",
    reg_desc:
      "Export and transport licenses are set to expire on <strong>2027-03-31</strong> (Renewal required 30 days prior to expiration)",

    // Search
    result_count: "Showing {count} items",
    no_data: "No data found",
    search_placeholder: "Search by Order No, Customer, or POD...",

    // Common
    etd_label: "ETD",
    no_order_data: "No order data found",
    no_production_data: "No production data",
    btn_gps_map: "GPS Coordinates",
    map_modal_title: "Plantation & Plant Coordinates (EUDR Geolocation)",
    open_google_maps: "Open in Google Maps",
  },
};

let currentLang = "th";