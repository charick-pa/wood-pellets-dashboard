const _dNow = new Date();
const _dYear = _dNow.getFullYear();
const _mEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][_dNow.getMonth()];
const _mTh = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][_dNow.getMonth()];

const translations = {
  th: {
    header_title: "Green River Panels — Wood Pellets Operations Dashboard",
    header_subtitle: "ระบบติดตามขั้นตอนการผลิตและจัดส่งสินค้าแบบ Real-time",
    sys_live: "System Live",

    // Navigation
    // Nav Tabs (Clean & Compact เพื่อป้องกัน Navbar ล้น)
    nav_dashboard: "แดชบอร์ด",
    nav_query: "สืบค้นออเดอร์",
    nav_map: "แผนที่จุด GIS",
    nav_cadastral: "รูปแปลงที่ดิน",

    // KPI
    kpi_active: "ยอดรวมคำสั่งซื้อ",
    kpi_active_sub: "+12% จากเดือนที่แล้ว",

    kpi_prod: "ความคืบหน้าการผลิต",

    kpi_ship: "จัดส่งแล้ว",
    kpi_ship_sub: "2026/10/29",

    kpi_qa: "รายการเบี่ยงเบนด้านคุณภาพ",
    kpi_qa_cases: "รายการ",
    kpi_qa_sub: "ผ่านเกณฑ์มาตรฐาน ISO 9001",
    kpi_moisture: "ควบคุมความชื้นเฉลี่ย",
    kpi_moisture_sub: "ได้มาตรฐาน ENplus A1 / ISO 17225-2",
    kpi_eudr: "การรับรองมาตรฐาน EUDR",
    kpi_eudr_sub: "เอกสาร DDS ตรวจสอบย้อนกลับสมบูรณ์",

    // Pipeline (8-Step Full Lifecycle: Sale->RA->Production->QC->QA->Storage->RA Verification->Shipment)
    pipeline_title: "ภาพรวมสถานะขั้นตอนการทำงาน (8 ขั้นตอน)",
    step1_name: "ฝ่ายขาย",
    step2_name: "ฝ่ายกำกับดูแล",
    approved_badge: "อนุมัติแล้ว",
    step3_name: "ฝ่ายผลิต",
    step3_status: "สถานะ: กำลังผลิต",
    step4_name: "ควบคุมคุณภาพหน้างาน",
    step4_val: "ไม่พบข้อเบี่ยงเบน",
    step4_sub: "ผ่านเกณฑ์ 5 จุดตรวจ",
    step5_name: "ประกันคุณภาพ",
    step5_sub: "สร้าง COA เรียบร้อย",
    step6_name: "คลังสินค้า",
    step6_sub: "พร้อมจัดเตรียมสินค้า",
    step7_name: "ตรวจสอบเอกสาร",
    step7_sub: "เอกสารส่งออกครบถ้วน",
    step8_name: "จัดส่งสินค้า",

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
    btn_view_bpm: "ดูแบบฟอร์ม BPM ฉบับเต็ม",

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
    search_mo_order_placeholder: "ค้นหา Order No, MO, PO, ลูกค้า, เลขที่โฉนด (Land Title No.), แปลง...",
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

    // Time Range Filters
    time_range_all: `ทั้งปี ${_dYear}`,
    time_range_month: `เดือนนี้ (${_mTh})`,
    time_range_week: "สัปดาห์นี้",
    time_range_today: "วันนี้",
    btn_print_cert: "พิมพ์ใบรับรอง EUDR",
    // Search
    result_count: "แสดง {count} รายการ",
    no_data: "ไม่พบข้อมูลที่ค้นหา",
    search_placeholder: "ค้นหา Order No, ลูกค้า, MO, เลขที่โฉนด (Land Title), หรือ POD...",

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

    // Navigation (Clean & Compact)
    nav_dashboard: "Dashboard",
    nav_query: "Order Query",
    nav_map: "GIS Map",
    nav_cadastral: "Cadastral",

    // KPI
    kpi_active: "Total Orders",
    kpi_active_sub: "+12% from last month",

    kpi_prod: "Production Progress",

    kpi_ship: "Shipped",
    kpi_ship_sub: "2026/10/29",

    kpi_qa: "Quality Deviations",
    kpi_qa_cases: "Cases",
    kpi_qa_sub: "Passed ISO 9001 standard",
    kpi_moisture: "Avg Moisture Control",
    kpi_moisture_sub: "Compliant with ENplus A1 / ISO 17225-2",
    kpi_eudr: "EUDR Compliance Rate",
    kpi_eudr_sub: "DDS Traceability Verified",

    // Pipeline (8-Step Full Lifecycle)
    pipeline_title: "8-Step Lifecycle Workflow Overview",
    step1_name: "Sale",
    step2_name: "RA",
    approved_badge: "Approved",
    step3_name: "Production",
    step3_status: "Status: In Progress",
    step4_name: "QC In-line",
    step4_val: "Zero Deviation",
    step4_sub: "5 Checkpoints Passed",
    step5_name: "QA Lab",
    step5_sub: "COA Ready",
    step6_name: "Storage",
    step6_sub: "Ready for Pick",
    step7_name: "RA Verification",
    step7_sub: "GGL / SBP / EUDR Verified",
    step8_name: "Shipment",

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
    search_mo_order_placeholder: "Search Order No, MO, PO, Customer, Land Title No., Plot...",
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

    // Time Range Filters
    time_range_all: `All ${_dYear}`,
    time_range_month: `${_mEn} ${_dYear}`,
    time_range_week: "This Week",
    time_range_today: "Today",
    btn_print_cert: "Print EUDR Certificate",
    // Search
    result_count: "Showing {count} items",
    no_data: "No data found",
    search_placeholder: "Search Order No, Customer, MO, Land Title No., or POD...",

    // Common
    etd_label: "ETD",
    no_order_data: "No order data found",
    no_production_data: "No production data",
    btn_gps_map: "GPS Coordinates",
    map_modal_title: "Plantation & Plant Coordinates (EUDR Geolocation)",
    open_google_maps: "Open in Google Maps",
  },
};

let currentLang = "en";
try {
  const savedLang = localStorage.getItem("dashboard_lang");
  if (savedLang === "th" || savedLang === "en") currentLang = savedLang;
  else currentLang = "en";
} catch (e) {
  currentLang = "en";
}

function applyLanguage(lang) {
  currentLang = lang || currentLang || "en";
  try { localStorage.setItem("dashboard_lang", currentLang); } catch (e) {}
  // สลับป้ายแสดงบนปุ่ม: ถ้าหน้าเว็บเป็นภาษาอังกฤษ ให้ปุ่มแสดง "TH", ถ้าหน้าเว็บเป็นภาษาไทย ให้ปุ่มแสดง "EN"
  const targetLabel = currentLang === "en" ? "TH" : "EN";
  $("#lang-label").text(targetLabel);
  $("#lang-toggle-btn").attr("title", currentLang === "en" ? "Switch to Thai (เปลี่ยนเป็นภาษาไทย)" : "Switch to English (เปลี่ยนเป็นภาษาอังกฤษ)");

  $("[data-i18n]").each(function () {
    const key = $(this).attr("data-i18n");
    if (translations[currentLang] && translations[currentLang][key]) {
      $(this).html(translations[currentLang][key]);
    }
  });

  $("[data-i18n-placeholder]").each(function () {
    const key = $(this).attr("data-i18n-placeholder");
    if (translations[currentLang] && translations[currentLang][key]) {
      $(this).attr("placeholder", translations[currentLang][key]);
    }
  });

  $("html").attr("lang", currentLang);

  // รีเฟรชตัวเลือกใน Dropdown Filters ให้เป็นภาษาที่เลือกพร้อมยอดนับจริง
  if (typeof populateQueryFilters === "function") {
    populateQueryFilters();
  }

  const view = typeof currentView !== "undefined" ? currentView : "dashboard";
  if (view === "dashboard" && typeof renderDashboard === "function" && typeof globalData !== "undefined") {
    renderDashboard(typeof dashboardFilteredData !== "undefined" && dashboardFilteredData.length > 0 ? dashboardFilteredData : globalData);
  } else if (view === "query") {
    if (typeof filterQueryTable === "function") {
      filterQueryTable();
    } else if (typeof renderOrderQueryView === "function") {
      renderOrderQueryView();
    }
  } else if (view === "cadastral" && typeof renderCadastralView === "function") {
    renderCadastralView();
  } else if (view === "map" && typeof renderMapOverview === "function") {
    renderMapOverview();
  }
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "th" : "en";
  applyLanguage(currentLang);
}