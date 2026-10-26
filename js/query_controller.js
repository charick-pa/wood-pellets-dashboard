/**
 * Query Controller: Order Query, Multi-criteria Filtering, Pagination, Excel/PDF/Print Exports
 * File size target: < 400 lines
 */

let currentQueryPage = 1;
let queryPageSize = 20;
let filteredQueryData = [];

// เติมตัวเลือกใน Dropdown Filters หน้าสืบค้นออเดอร์ แบบไดนามิกจากชุดข้อมูล (mockdata หรือ ฐานข้อมูลจริง)
function populateQueryFilters(data) {
  const dataset = data || (typeof globalData !== "undefined" && Array.isArray(globalData) ? globalData : []);
  if (!Array.isArray(dataset) || dataset.length === 0) return;
  const isTh = (typeof currentLang !== "undefined" && currentLang === "th");

  // 1. ดึง Years จากชุดข้อมูล พร้อมเพิ่ม 2027, 2028 และจัดเรียงจากน้อยไปมาก (Sort by ASC)
  const yearsSet = new Set(["2025", "2026", "2027", "2028"]);
  dataset.forEach((item) => {
    const d = item.orderDate || item.requestedDeliveryDate || item.step6?.etd || "";
    const m = d.match(/20\d{2}/);
    if (m) yearsSet.add(m[0]);
  });
  const sortedYears = Array.from(yearsSet).sort((a, b) => parseInt(a) - parseInt(b));
  const prevYear = $("#queryYearFilter").val() || "ALL";
  let yearHtml = `<option value="ALL">${isTh ? '-- ทุกปี (All Years) --' : '-- All Years --'}</option>`;
  sortedYears.forEach((y) => {
    const count = dataset.filter((item) => (item.orderDate || item.requestedDeliveryDate || item.step6?.etd || "").includes(y)).length;
    const selected = prevYear === y ? "selected" : "";
    yearHtml += `<option value="${y}" ${selected}>${isTh ? 'ปี ' + y : 'Year ' + y} (${count})</option>`;
  });
  $("#queryYearFilter").html(yearHtml);

  // 2. ดึง Months จากชุดข้อมูล
  const monthNames = isTh 
    ? { "01": "01: ม.ค.", "02": "02: ก.พ.", "03": "03: มี.ค.", "04": "04: เม.ย.", "05": "05: พ.ค.", "06": "06: มิ.ย.", "07": "07: ก.ค.", "08": "08: ส.ค.", "09": "09: ก.ย.", "10": "10: ต.ค.", "11": "11: พ.ย.", "12": "12: ธ.ค." }
    : { "01": "01: Jan", "02": "02: Feb", "03": "03: Mar", "04": "04: Apr", "05": "05: May", "06": "06: Jun", "07": "07: Jul", "08": "08: Aug", "09": "09: Sep", "10": "10: Oct", "11": "11: Nov", "12": "12: Dec" };
  const prevMonth = $("#queryMonthFilter").val() || "ALL";
  let monthHtml = `<option value="ALL">${isTh ? '-- ทุกเดือน (All Months) --' : '-- All Months --'}</option>`;
  const orderedMonthKeys = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  orderedMonthKeys.forEach((m) => {
    const count = dataset.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || item.step6?.etd || "";
      return d.includes(`-${m}-`) || d.includes(`/${m}/`) || d.endsWith(`-${m}`) || d.endsWith(`/${m}`);
    }).length;
    const selected = prevMonth === m ? "selected" : "";
    const countSuffix = count > 0 ? ` (${count})` : "";
    monthHtml += `<option value="${m}" ${selected}>${monthNames[m]}${countSuffix}</option>`;
  });
  $("#queryMonthFilter").html(monthHtml);

  // 3. ดึง Steps (Step 1-8) จากชุดข้อมูล
  const stepLabels = {
    1: isTh ? "1. ฝ่ายขาย" : "Step 1: Sale",
    2: isTh ? "2. ฝ่ายกำกับดูแล" : "Step 2: RA",
    3: isTh ? "3. ฝ่ายผลิต" : "Step 3: Production",
    4: isTh ? "4. ควบคุมคุณภาพ QC" : "Step 4: QC",
    5: isTh ? "5. ประกันคุณภาพ QA" : "Step 5: QA",
    6: isTh ? "6. คลังสินค้า" : "Step 6: Storage",
    7: isTh ? "7. ตรวจสอบเอกสาร" : "Step 7: RA Verification",
    8: isTh ? "8. จัดส่งสินค้า" : "Step 8: Shipment"
  };
  const prevStep = $("#queryStepFilter").val() || "ALL";
  let stepHtml = `<option value="ALL">${isTh ? '-- ทุกขั้นตอน (All Steps) --' : '-- All Steps --'}</option>`;
  for (let s = 1; s <= 8; s++) {
    const count = dataset.filter((item) => Number(item.currentStep) === s).length;
    const selected = prevStep === String(s) ? "selected" : "";
    stepHtml += `<option value="${s}" ${selected}>${stepLabels[s]} (${count})</option>`;
  }
  $("#queryStepFilter").html(stepHtml);

  // 4. ดึง Status Badges จากชุดข้อมูลไดนามิก
  const statusSet = new Set();
  dataset.forEach((item) => { if (item.statusBadge) statusSet.add(item.statusBadge); });
  const prevStatus = $("#queryStatusFilter").val() || "ALL";
  let statusHtml = `<option value="ALL">${isTh ? '-- ทุกสถานะ (All Statuses) --' : '-- All Statuses --'}</option>`;
  Array.from(statusSet).sort().forEach((st) => {
    const count = dataset.filter((item) => item.statusBadge === st).length;
    const stDisplay = (st === "On Schedule" && isTh) ? "ตามกำหนดการ" : ((st === "In Production" && isTh) ? "อยู่ระหว่างการผลิต" : st);
    const selected = prevStatus === st ? "selected" : "";
    statusHtml += `<option value="${st}" ${selected}>${stDisplay} (${count})</option>`;
  });
  $("#queryStatusFilter").html(statusHtml);

  // อัปเดตป้ายบอกแหล่งที่มาข้อมูล
  const isDb = window.OrderDataService && window.OrderDataService.source === "database";
  $("#queryDataSourceBadge").html(
    isDb ? '<i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i>Live Database'
         : '<i class="fa-solid fa-cube text-amber-500 mr-1"></i>Mock Data'
  ).attr("class", isDb ? "ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                       : "ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200");
}

// Data Service สำหรับสลับระหว่าง Mock Data (ปัจจุบัน) และ Database API (ในอนาคต)
window.OrderDataService = {
  source: "mock",
  apiEndpoint: "/api/wood_pellets/orders",

  getData: function () {
    return typeof globalData !== "undefined" && Array.isArray(globalData) ? globalData : [];
  },

  // เชื่อมต่อดึงข้อมูลสดจากฐานข้อมูล (REST API) เมื่อพร้อม
  fetchFromDatabase: async function (endpoint) {
    const url = endpoint || this.apiEndpoint;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        this.source = "database";
        globalData = data;
        this.syncAllViews(data);
        return { success: true, count: data.length, source: "database" };
      }
    } catch (err) {
      console.warn("[OrderDataService] Failed to load from DB, maintaining mock data:", err);
      this.syncAllViews(this.getData());
      return { success: false, error: err.message, source: "mock" };
    }
  },

  // ซิงค์ชุดข้อมูลไปยังทุกส่วนของระบบ (Filters, Dashboard, Query, Cadastral, Map)
  syncAllViews: function (data) {
    populateQueryFilters(data);
    if (typeof filterQueryTable === "function") filterQueryTable();
    if (typeof renderDashboard === "function") renderDashboard(data);
    if (typeof updateCadastralMoOptions === "function") updateCadastralMoOptions(data);
  }
};

// เรนเดอร์หน้าค้นหาคำสั่งซื้อ (Order Query View)
function renderOrderQueryView() {
  currentQueryPage = 1;
  populateQueryFilters(typeof globalData !== "undefined" ? globalData : []);
  filterQueryTable();
}

// กรองตาราง Order Query แบบ Real-time ตามเงื่อนไขหลายตัวกรอง
function filterQueryTable() {
  if (typeof globalData === "undefined" || !Array.isArray(globalData)) return;

  const keyword = ($("#querySearchInput").val() || "").trim().toLowerCase();
  const stepFilter = $("#queryStepFilter").val();
  const statusFilter = $("#queryStatusFilter").val();
  const destinationFilter = $("#queryDestFilter").val();
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();

  filteredQueryData = globalData.filter((item) => {
    // 1. ตรวจสอบ Keyword
    if (keyword) {
      const matchOrder = (item.orderNo || "").toLowerCase().includes(keyword);
      const matchMo = (item.moNo || "").toLowerCase().includes(keyword);
      const matchCustomer = (item.customer || "").toLowerCase().includes(keyword);
      const matchDest = (item.destination || "").toLowerCase().includes(keyword);
      const matchProduct = (item.productName || item.productCode || "").toLowerCase().includes(keyword);
      if (!matchOrder && !matchMo && !matchCustomer && !matchDest && !matchProduct) {
        return false;
      }
    }

    // 2. ตรวจสอบขั้นตอน (Step 1-8)
    if (stepFilter && stepFilter !== "ALL") {
      if (String(item.currentStep) !== String(stepFilter)) return false;
    }

    // 3. ตรวจสอบสถานะการดำเนินงาน (On Schedule / In Production)
    if (statusFilter && statusFilter !== "ALL") {
      if (item.statusBadge !== statusFilter) return false;
    }

    // 4. ตรวจสอบเมืองปลายทาง
    if (destinationFilter && destinationFilter !== "ALL") {
      if (!item.destination.includes(destinationFilter)) return false;
    }

    // 5. ตรวจสอบปี (Year)
    const itemDate = item.orderDate || item.requestedDeliveryDate || item.step6?.etd || "2026-10-15";
    if (yearFilter && yearFilter !== "ALL") {
      if (!itemDate.includes(yearFilter)) return false;
    }

    // 6. ตรวจสอบเดือน (Month)
    if (monthFilter && monthFilter !== "ALL") {
      const itemMonth = itemDate.substring(5, 7);
      if (itemMonth !== monthFilter) return false;
    }

    return true;
  });

  renderQueryTable();
}

// เรนเดอร์ตาราง Order Query ตามหน้าที่เลือก
function renderQueryTable() {
  const totalItems = filteredQueryData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / queryPageSize));
  currentQueryPage = Math.min(Math.max(1, currentQueryPage), totalPages);

  const startIndex = (currentQueryPage - 1) * queryPageSize;
  const endIndex = Math.min(startIndex + queryPageSize, totalItems);
  const pageItems = filteredQueryData.slice(startIndex, endIndex);

  $("#queryTotalCount").text(totalItems);
  $("#queryTotalBadge").text(`พบ ${totalItems} รายการ`);

  if (pageItems.length === 0) {
    $("#queryTableBody").html(`
      <tr>
        <td colspan="11" class="py-12 text-center text-slate-400">
          <i class="fa-solid fa-magnifying-glass text-3xl mb-2 text-slate-300"></i>
          <p class="font-medium text-xs">ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา</p>
        </td>
      </tr>
    `);
    $("#queryPaginationContainer").html("");
    return;
  }

  const rowsHtml = pageItems.map((item, idx) => {
    const rowNo = startIndex + idx + 1;
    if (window.Components && typeof window.Components.renderQueryRow === "function") {
      return window.Components.renderQueryRow(item, rowNo);
    }
    return "";
  }).join("");

  $("#queryTableBody").html(rowsHtml);

  // เรนเดอร์ Pagination Controls ด้านล่างตาราง
  if (window.Components && typeof window.Components.renderPaginationControls === "function") {
    $("#queryPaginationContainer").html(
      window.Components.renderPaginationControls(currentQueryPage, totalPages, totalItems, queryPageSize)
    );
  }
}

// Event Handler เมื่อมีการเปลี่ยนค่าใน Search Box หรือ Dropdown Filters
function handleQuerySearch() {
  currentQueryPage = 1;
  filterQueryTable();
}

// Event Handler เมื่อมีการเปลี่ยนจำนวนแถวต่อหน้า (Page Size)
function handlePageSizeChange() {
  queryPageSize = parseInt($("#queryPageSizeSelect").val()) || 20;
  currentQueryPage = 1;
  renderQueryTable();
}

// ฟังก์ชันเปลี่ยนหน้าสำหรับ Pagination Bar
function goToQueryPage(page) {
  const totalPages = Math.max(1, Math.ceil(filteredQueryData.length / queryPageSize));
  if (page < 1 || page > totalPages) return;
  currentQueryPage = page;
  renderQueryTable();
}

// ลิงก์ตรงจาก Order Query ไปยัง Dashboard หน้านั้นๆ
function jumpToDashboardOrder(orderNo) {
  if (typeof handleSelectOrder === "function") {
    handleSelectOrder(orderNo);
  }
  if (typeof switchView === "function") {
    switchView("dashboard");
  }
}

// ส่งออก Excel จากผลการกรองหน้า Order Query
function exportQueryToExcel() {
  const dataToExport = filteredQueryData.length > 0 ? filteredQueryData : globalData;
  if (!dataToExport || dataToExport.length === 0) {
    showSwalWarning("No Data to Export", "There is no order data available to export to Excel.");
    return;
  }

  const excelRows = dataToExport.map((item, idx) => ({
    "ลำดับ (No)": idx + 1,
    "Order No": item.orderNo,
    "MO No": item.moNo || "-",
    "PO No": item.poNo || "-",
    Customer: item.customer,
    "Product Code": item.productCode || "-",
    "Quantity": item.orderQuantity || "-",
    Destination: item.destination,
    "Shipping Line": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-",
    "Current Step": `Step ${item.currentStep || 1}`,
    "Progress (%)": (typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0) + "%",
    "ETD": item.step6?.etd || "-",
    "ETA": item.step6?.eta || "-",
    Status: item.statusBadge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Orders");

  const keyword = ($("#querySearchInput").val() || "").trim();
  const filename = keyword
    ? `Wood_Pellets_Query_${keyword}_${new Date().toISOString().slice(0, 10)}.xlsx`
    : `Wood_Pellets_Query_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

// ส่งออกรายงานแบบแบ่งช่วงเวลา (รายเดือน/รายปี)
function exportShipmentSummaryExcel(periodType) {
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();
  const selectedYear = yearFilter !== "ALL" ? yearFilter : "2026";
  const selectedMonth = monthFilter !== "ALL" ? monthFilter : "10";

  const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม",
  };
  const monthName = monthNamesThai[selectedMonth] || selectedMonth;

  let periodData = [];
  let sheetName = "";
  let filename = "";

  if (periodType === "month") {
    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(`${selectedYear}-${selectedMonth}`);
    });
    if (periodData.length === 0) {
      showSwalWarning("No Data Found", `No order data found for ${monthName} ${selectedYear}.`);
      return;
    }
    sheetName = `Monthly_${selectedYear}_${selectedMonth}`;
    filename = `Wood_Pellets_Monthly_Report_${selectedYear}_${selectedMonth}.xlsx`;
  } else {
    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(selectedYear);
    });
    if (periodData.length === 0) {
      showSwalWarning("No Data Found", `No order data found for year ${selectedYear}.`);
      return;
    }
    sheetName = `Yearly_${selectedYear}`;
    filename = `Wood_Pellets_Yearly_Summary_${selectedYear}.xlsx`;
  }

  const excelRows = periodData.map((item, idx) => ({
    "ลำดับ (No)": idx + 1,
    "Order No": item.orderNo,
    "MO No": item.moNo || "-",
    "PO No": item.poNo || "-",
    "ชื่อลูกค้า (Customer)": item.customer,
    "รหัสสินค้า (Product Code)": item.productCode || "-",
    "ปริมาณ (Quantity)": item.orderQuantity || "-",
    "ปลายทาง (Destination)": item.destination,
    "สายการเดินเรือ": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-",
    "ขั้นตอนปัจจุบัน": `Step ${item.currentStep || 1}`,
    "ความคืบหน้า (%)": (typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0) + "%",
    "ETD": item.step6?.etd || "-",
    "ETA": item.step6?.eta || "-",
    "สถานะ (Status)": item.statusBadge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
