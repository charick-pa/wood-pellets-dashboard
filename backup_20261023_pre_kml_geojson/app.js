// PATCH: Wood Pellets Operations Dashboard & Order Master Query System

let currentSelectedOrderNo = null;
let currentView = "dashboard"; // 'dashboard' | 'query'

// State สำหรับตาราง Shipment ในหน้า Dashboard (ค่าเริ่มต้น 10 แถว/หน้า)
let dashboardTablePage = 1;
let dashboardTablePageSize = 10;
let dashboardFilteredData = [];

// State สำหรับหน้า Order Query (ค่าเริ่มต้น 20 แถว/หน้า)
let currentQueryPage = 1;
let queryPageSize = 20;
let filteredQueryData = [];

// ฟังก์ชันสลับมุมมองหน้าจอระหว่าง Dashboard, Order Query, และ GIS Map Overview (พร้อมแอนิเมชัน Fade-in Slide-up นุ่มนวล)
function switchView(viewName) {
  currentView = viewName;

  // ซ่อนทุกวิว และลบคลาสแอนิเมชันเก่า
  $("#dashboardView, #queryView, #mapView")
    .addClass("hidden")
    .removeClass("page-fade-in");

  // รีเซ็ตสไตล์ปุ่ม Nav
  $("#navDashboardBtn, #navQueryBtn, #navMapBtn")
    .removeClass("bg-white text-indigo-700 shadow-sm font-bold")
    .addClass("text-slate-600 font-semibold");
  $("#navDashboardBtn i").removeClass("text-indigo-600");
  $("#navMapBtn i").removeClass("text-rose-600").addClass("text-rose-500");

  if (viewName === "dashboard") {
    $("#dashboardView")
      .removeClass("hidden")
      .addClass("page-fade-in");
    $("#navDashboardBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    $("#navDashboardBtn i").addClass("text-indigo-600");
    renderDashboard(globalData);
  } else if (viewName === "query") {
    $("#queryView")
      .removeClass("hidden")
      .addClass("page-fade-in");
    $("#navQueryBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    currentQueryPage = 1;
    renderQueryView();
  } else if (viewName === "map") {
    $("#mapView")
      .removeClass("hidden")
      .addClass("page-fade-in");
    $("#navMapBtn")
      .addClass("bg-white text-indigo-700 shadow-sm font-bold")
      .removeClass("text-slate-600 font-semibold");
    $("#navMapBtn i").removeClass("text-rose-500").addClass("text-rose-600");
    renderMapOverview();
  }
}

// ฟังก์ชันเรนเดอร์แดชบอร์ดหลัก (Dashboard View)
function renderDashboard(data) {
  dashboardFilteredData = data || [];

  let activeItem = null;
  if (data && data.length > 0) {
    activeItem = data.find((item) => item.orderNo === currentSelectedOrderNo) || data[0];
    currentSelectedOrderNo = activeItem.orderNo;
  }

  // ส่ง activeItem ไปยัง renderKPICards เพื่อคำนวณ % ความคืบหน้าของ Order นั้น
  if (window.Components && typeof window.Components.renderKPICards === "function") {
    $("#kpiCardsContainer").html(window.Components.renderKPICards(globalSummary, activeItem));
  }

  if (window.Components && typeof window.Components.renderPipeline === "function") {
    $("#pipelineContainer").html(window.Components.renderPipeline(activeItem));
  }

  // แสดงแถบ Wood Pellets Quick Summary Bar (พารามิเตอร์เฉพาะทาง)
  if (window.Components && typeof window.Components.renderWoodPelletsQuickBar === "function") {
    $("#woodPelletsQuickBarContainer").html(window.Components.renderWoodPelletsQuickBar(activeItem));
  }

  // แสดงส่วนสรุปการผลิตและการทำงาน (Full Width 3 Columns)
  if (window.Components && typeof window.Components.renderProduction === "function") {
    $("#prodSection").html(window.Components.renderProduction(activeItem));
  }

  // เรนเดอร์ตารางรายการจัดส่งด้านล่างสุด พร้อมการแบ่งหน้า (10 แถว/หน้า)
  renderDashboardTable();
}

// ฟังก์ชันเรนเดอร์ตารางรายการจัดส่งในหน้า Dashboard พร้อม Pagination
function renderDashboardTable() {
  const t = translations[currentLang];
  const totalRecords = dashboardFilteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / dashboardTablePageSize));

  if (dashboardTablePage > totalPages) {
    dashboardTablePage = 1;
  }

  const startIndex = (dashboardTablePage - 1) * dashboardTablePageSize;
  const pageItems = dashboardFilteredData.slice(startIndex, startIndex + dashboardTablePageSize);

  const $tableBody = $("#orderTableBody");

  if (pageItems && pageItems.length > 0) {
    const rowsHtml = pageItems
      .map((item, idx) => {
        const rowNumber = startIndex + idx + 1;
        if (window.Components && typeof window.Components.renderTableRow === "function") {
          return window.Components.renderTableRow(item, item.orderNo === currentSelectedOrderNo, rowNumber);
        }
        return "";
      })
      .join("");

    $tableBody.html(rowsHtml);
    $("#searchResultCount").text(t.result_count.replace("{count}", totalRecords));
  } else {
    $tableBody.html(`
      <tr>
        <td colspan="6" class="py-6 text-center text-slate-400 text-xs">
          ${t.no_data}
        </td>
      </tr>
    `);
    $("#searchResultCount").text(t.no_data);
  }

  // เรนเดอร์ Pagination ด้านล่างตาราง Dashboard
  if (window.Components && typeof window.Components.renderDashboardPaginationControls === "function") {
    $("#dashboardTablePaginationContainer").html(
      window.Components.renderDashboardPaginationControls(
        dashboardTablePage,
        totalPages,
        totalRecords,
        dashboardTablePageSize
      )
    );
  }
}

// เปลี่ยนหน้าในตาราง Dashboard
function goToDashboardPage(page) {
  const totalPages = Math.max(1, Math.ceil(dashboardFilteredData.length / dashboardTablePageSize));
  if (page < 1 || page > totalPages) return;
  dashboardTablePage = page;
  renderDashboardTable();
}

// เปลี่ยนจำนวนแถวที่แสดงในตาราง Dashboard (10, 20, 50, 100)
function handleDashboardPageSizeChange() {
  dashboardTablePageSize = parseInt($("#dashboardPageSizeSelect").val()) || 10;
  dashboardTablePage = 1;
  renderDashboardTable();
}

// ฟังก์ชันค้นหาในหน้า Dashboard
function filterDashboard() {
  const val = $("#searchInput").val().toLowerCase().trim();

  const filtered = globalData.filter(
    (item) =>
      item.orderNo.toLowerCase().includes(val) ||
      (item.customer && item.customer.toLowerCase().includes(val)) ||
      (item.moNo && item.moNo.toLowerCase().includes(val))
  );

  dashboardTablePage = 1;
  renderDashboard(filtered);
}

// ==========================================
// ส่วนฟังก์ชันระบบสืบค้นคำสั่งซื้อ (Order Query)
// ==========================================

function renderQueryView() {
  const keyword = ($("#querySearchInput").val() || "").toLowerCase().trim();
  const yearFilter = $("#queryYearFilter").val() || "ALL";
  const monthFilter = $("#queryMonthFilter").val() || "ALL";
  const stepFilter = $("#queryStepFilter").val() || "ALL";
  const statusFilter = $("#queryStatusFilter").val() || "ALL";

  // กรองข้อมูลตามเงื่อนไขการค้นหาจริง
  filteredQueryData = globalData.filter((item) => {
    // 1. ค้นหาคำสำคัญ (Order No, MO No, PO No, Customer, Destination, Product)
    const matchesKeyword =
      !keyword ||
      (item.orderNo && item.orderNo.toLowerCase().includes(keyword)) ||
      (item.moNo && item.moNo.toLowerCase().includes(keyword)) ||
      (item.poNo && item.poNo.toLowerCase().includes(keyword)) ||
      (item.customer && item.customer.toLowerCase().includes(keyword)) ||
      (item.destination && item.destination.toLowerCase().includes(keyword)) ||
      (item.productName && item.productName.toLowerCase().includes(keyword));

    // 2. กรองตามปี (Year)
    const itemDate = item.orderDate || item.requestedDeliveryDate || item.planStartDate || "2026-10-15";
    const itemYear = itemDate.substring(0, 4);
    const matchesYear = yearFilter === "ALL" || itemYear === yearFilter;

    // 3. กรองตามเดือน (Month)
    const itemMonth = itemDate.substring(5, 7);
    const matchesMonth = monthFilter === "ALL" || itemMonth === monthFilter;

    // 4. กรองตาม Step
    const matchesStep =
      stepFilter === "ALL" || String(item.currentStep) === String(stepFilter);

    // 5. กรองตาม Status
    const matchesStatus =
      statusFilter === "ALL" || item.statusBadge === statusFilter;

    return matchesKeyword && matchesYear && matchesMonth && matchesStep && matchesStatus;
  });

  const totalRecords = filteredQueryData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / queryPageSize));

  if (currentQueryPage > totalPages) {
    currentQueryPage = 1;
  }

  // อัปเดตตัวเลขจำนวนผลลัพธ์
  $("#queryTotalCount").text(totalRecords);

  // ตัดข้อมูลเฉพาะหน้าปัจจุบัน (Pagination Slice)
  const startIndex = (currentQueryPage - 1) * queryPageSize;
  const pageItems = filteredQueryData.slice(startIndex, startIndex + queryPageSize);

  const $tbody = $("#queryTableBody");
  if (pageItems.length > 0) {
    const rowsHtml = pageItems.map((item, idx) => {
      if (window.Components && typeof window.Components.renderQueryRow === "function") {
        return window.Components.renderQueryRow(item, startIndex + idx + 1);
      }
      return "";
    }).join("");
    $tbody.html(rowsHtml);
  } else {
    $tbody.html(`
      <tr>
        <td colspan="11" class="py-12 text-center text-slate-400 text-xs">
          <i class="fa-solid fa-magnifying-glass text-2xl mb-2 text-slate-300 block"></i>
          ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
        </td>
      </tr>
    `);
  }

  // เรนเดอร์แถบควบคุมการแบ่งหน้า (Pagination)
  if (window.Components && typeof window.Components.renderPaginationControls === "function") {
    $("#queryPaginationContainer").html(
      window.Components.renderPaginationControls(currentQueryPage, totalPages, totalRecords, queryPageSize)
    );
  }
}

// ควบคุมการพิมพ์ค้นหาในหน้า Query
function handleQuerySearch() {
  currentQueryPage = 1;
  renderQueryView();
}

// เปลี่ยนจำนวนแถวที่แสดงต่อหน้า (10, 20, 50, 100)
function handlePageSizeChange() {
  queryPageSize = parseInt($("#queryPageSizeSelect").val()) || 20;
  currentQueryPage = 1;
  renderQueryView();
}

// เปลี่ยนหน้า Pagination
function goToQueryPage(page) {
  const totalPages = Math.max(1, Math.ceil(filteredQueryData.length / queryPageSize));
  if (page < 1 || page > totalPages) return;
  currentQueryPage = page;
  renderQueryView();

  // เลื่อนกลับไปด้านบนของตาราง
  const element = document.getElementById("queryExportableArea");
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// กระโดดไปยังหน้า Dashboard พร้อมเลือก Order นั้น
function jumpToDashboardOrder(orderNo) {
  switchView("dashboard");
  handleSelectOrder(orderNo);
}

// เมนูควบคุม Dropdown สำหรับการ Export ประจำงวด (หน้า Query)
function toggleExportPeriodDropdown() {
  $("#exportPeriodDropdown").toggleClass("hidden");
}

// เมนูควบคุม Dropdown สำหรับการ Export ประจำงวด (หน้า Dashboard)
function toggleDashExportPeriodDropdown() {
  $("#dashExportPeriodDropdown").toggleClass("hidden");
}

// ปิด Dropdown เมื่อคลิกที่อื่น
$(document).on("click", function (e) {
  if (!$(e.target).closest("#btnExportPeriodMenu, #exportPeriodDropdown").length) {
    $("#exportPeriodDropdown").addClass("hidden");
  }
  if (!$(e.target).closest("#btnDashExportPeriodMenu, #dashExportPeriodDropdown").length) {
    $("#dashExportPeriodDropdown").addClass("hidden");
  }
});

// ฟังก์ชัน Export ข้อมูล รายเดือน (Monthly) และ รายปี (Yearly)
function exportByPeriod(periodType) {
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();
  const selectedYear = yearFilter !== "ALL" ? yearFilter : "2026";

  const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
  };

  let periodData = [];
  let reportTitle = "";
  let sheetName = "";
  let filename = "";

  if (periodType === "month") {
    const selectedMonth = monthFilter !== "ALL" ? monthFilter : "10";
    const monthName = monthNamesThai[selectedMonth] || selectedMonth;

    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(`${selectedYear}-${selectedMonth}`);
    });

    if (periodData.length === 0) {
      alert(`ไม่พบข้อมูลคำสั่งซื้อในเดือน ${monthName} ${selectedYear}`);
      return;
    }

    reportTitle = `รายงานคำสั่งซื้อประจำเดือน ${monthName} ปี ${selectedYear}`;
    sheetName = `Monthly_${selectedYear}_${selectedMonth}`;
    filename = `Wood_Pellets_Monthly_Report_${selectedYear}_${selectedMonth}.xlsx`;
  } else {
    // รายปี (Yearly)
    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(selectedYear);
    });

    if (periodData.length === 0) {
      alert(`ไม่พบข้อมูลคำสั่งซื้อในปี ${selectedYear}`);
      return;
    }

    reportTitle = `รายงานสรุปภาพรวมคำสั่งซื้อและการผลิตประจำปี ${selectedYear}`;
    sheetName = `Yearly_${selectedYear}`;
    filename = `Wood_Pellets_Yearly_Summary_${selectedYear}.xlsx`;
  }

  // แปลงข้อมูลเป็นรูปแบบตาราง Excel สวยงาม
  const excelRows = periodData.map((item, idx) => ({
    "ลำดับ (No)": idx + 1,
    "วันที่บันทึก (Date)": item.orderDate || "2026-10-15",
    "Order No": item.orderNo,
    "MO No": item.moNo || "-",
    "PO No": item.poNo || "-",
    "ชื่อลูกค้า (Customer)": item.customer,
    "รหัสสินค้า (Product Code)": item.productCode || "-",
    "ปริมาณตามสั่ง (Quantity)": item.orderQuantity || "-",
    "ท่าเรือ/ปลายทาง (Destination)": item.destination,
    "สายการเดินเรือ (Shipping Line)": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-",
    "ขั้นตอนปัจจุบัน (Step)": `Step ${item.currentStep || 1}`,
    "ความคืบหน้า (%)": calculateProductionProgress(item) + "%",
    "ETD": item.step6?.etd || "-",
    "ETA": item.step6?.eta || "-",
    "สถานะ (Status)": item.statusBadge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // สรุปยอดรวมท้ายรายงาน (Summary Sheet สำหรับรายปี)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  if (periodType === "year") {
    // สร้าง Sheet ที่ 2 สรุปยอดรวมแยกตามเดือนและลูกค้า
    const monthlySummary = {};
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      monthlySummary[mStr] = {
        "เดือน (Month)": `${monthNamesThai[mStr]} (${mStr})`,
        "จำนวนคำสั่งซื้อ (Orders)": 0,
        "ปริมาณผลิตเสร็จสิ้น (Completed)": 0,
        "อยู่ระหว่างดำเนินการ (In Progress)": 0,
      };
    }

    periodData.forEach((item) => {
      const d = item.orderDate || "2026-10-15";
      const m = d.substring(5, 7);
      if (monthlySummary[m]) {
        monthlySummary[m]["จำนวนคำสั่งซื้อ (Orders)"] += 1;
        if (item.currentStep >= 7) {
          monthlySummary[m]["ปริมาณผลิตเสร็จสิ้น (Completed)"] += 1;
        } else {
          monthlySummary[m]["อยู่ระหว่างดำเนินการ (In Progress)"] += 1;
        }
      }
    });

    const summarySheet = XLSX.utils.json_to_sheet(Object.values(monthlySummary));
    XLSX.utils.book_append_sheet(workbook, summarySheet, `Monthly_Breakdown_${selectedYear}`);
  }

  XLSX.writeFile(workbook, filename);
}

// ส่งออก Excel จากหน้า Query ตามผลการค้นหาจริง
function exportQueryToExcel() {
  const dataToExport = filteredQueryData.length > 0 ? filteredQueryData : globalData;

  if (!dataToExport || dataToExport.length === 0) {
    alert("ไม่มีข้อมูลสำหรับ Export");
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
    "Progress (%)": calculateProductionProgress(item) + "%",
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

// ฟังก์ชันพิมพ์รายงานแบบ Full List ครบทุกแถว (พิมพ์ 100+ แถวต่อเนื่องหลายหน้า A4)
function printPeriodicReport(periodType) {
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();
  const selectedYear = yearFilter !== "ALL" ? yearFilter : "2026";

  const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
  };

  let periodData = [];
  let periodTitle = "";

  if (periodType === "month") {
    const selectedMonth = monthFilter !== "ALL" ? monthFilter : "10";
    const monthName = monthNamesThai[selectedMonth] || selectedMonth;
    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(`${selectedYear}-${selectedMonth}`);
    });
    periodTitle = `รายงานคำสั่งซื้อและการจัดส่ง ประจำเดือน ${monthName} ปี ${selectedYear} (${periodData.length} รายการ)`;
  } else {
    // รายปี (Yearly)
    periodData = globalData.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(selectedYear);
    });
    periodTitle = `รายงานสรุปภาพรวมคำสั่งซื้อและการจัดส่ง ประจำปี ${selectedYear} (${periodData.length} รายการ)`;
  }

  if (periodData.length === 0) {
    alert("ไม่มีข้อมูลสำหรับพิมพ์ตามช่วงเวลาที่เลือก");
    return;
  }

  // สร้างหน้าต่างพิมพ์เฉพาะ (Print Window) เพื่อให้จัดหน้าตารางกว้างเต็ม A4 แนวนอน ไม่ถูกบีบและไม่ติดการแบ่งหน้าจอ
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("กรุณาอนุญาต Pop-up บนเบราว์เซอร์เพื่อเปิดหน้าพิมพ์รายงาน");
    return;
  }

  const rowsHtml = periodData.map((item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 10px; page-break-inside: avoid;">
      <td style="padding: 6px; text-align: center; font-weight: bold; color: #475569;">${idx + 1}</td>
      <td style="padding: 6px; font-weight: bold; color: #0f172a;">
        ${item.orderNo}<br>
        <span style="font-size: 9px; color: #64748b; font-weight: normal;">${item.customer}</span>
      </td>
      <td style="padding: 6px; font-family: monospace; color: #334155;">${item.moNo || '-'}<br><span style="color:#6366f1;">${item.poNo || '-'}</span></td>
      <td style="padding: 6px; color: #1e293b;">${item.orderQuantity || '-'}<br><span style="font-size: 9px; color: #64748b;">${item.productCode || '-'}</span></td>
      <td style="padding: 6px; color: #334155;">${item.destination}<br><span style="font-size: 9px; color: #64748b;">${item.step6?.shippingLine || '-'}</span></td>
      <td style="padding: 6px; text-align: center;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0e7ff; color: #3730a3;">
          Step ${item.currentStep || 1} (${calculateProductionProgress(item)}%)
        </span>
      </td>
      <td style="padding: 6px; color: #059669; font-weight: bold;">${item.step6?.etd || '-'}</td>
      <td style="padding: 6px; color: #475569;">${item.step6?.eta || '-'}</td>
      <td style="padding: 6px; text-align: center;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold; ${item.statusBadge === 'On Schedule' ? 'background:#d1fae5; color:#065f46;' : 'background:#fef3c7; color:#92400e;'}">
          ${item.statusBadge || '-'}
        </span>
      </td>
    </tr>
  `).join("");

  const printDocumentHtml = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>${periodTitle}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 10mm 10mm 12mm 10mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          margin: 0;
          padding: 10px;
          color: #0f172a;
          background: #ffffff;
        }
        .header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title {
          font-size: 16px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }
        .subtitle {
          font-size: 11px;
          color: #475569;
          margin: 2px 0 0 0;
        }
        .meta {
          text-align: right;
          font-size: 10px;
          color: #64748b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 2px solid #cbd5e1;
          padding: 8px 6px;
          text-align: left;
        }
        th.center, td.center {
          text-align: center;
        }
        .footer {
          margin-top: 16px;
          border-top: 1px solid #cbd5e1;
          padding-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div style="font-size: 11px; font-weight: bold; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px;">Green River Panels (Thailand) Co., Ltd</div>
          <h1 class="title">${periodTitle}</h1>
          <p class="subtitle">Wood Pellets Operations — รายงานข้อมูลประจำงวดฉบับเต็ม (ครบทุกรายการ)</p>
        </div>
        <div class="meta">
          <div>วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</div>
          <div>พิมพ์โดยระบบ BPM Operations Dashboard</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="center" style="width: 35px;">#</th>
            <th style="width: 140px;">Order No / ลูกค้า</th>
            <th style="width: 110px;">MO / PO No</th>
            <th style="width: 80px;">ปริมาณ</th>
            <th>ปลายทาง / สายเรือ</th>
            <th class="center" style="width: 95px;">Step / %</th>
            <th style="width: 75px;">ETD</th>
            <th style="width: 75px;">ETA</th>
            <th class="center" style="width: 90px;">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>Green River Panels (Thailand) Co., Ltd &bull; Wood Pellets Master System</span>
        <span>เอกสารทางการสำหรับการตรวจสอบและการผลิต &bull; ทั้งหมด ${periodData.length} รายการ</span>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDocumentHtml);
  printWindow.document.close();
}

// ส่งออก PDF จากหน้า Query ตามตารางที่ค้นหา/กรองอยู่จริง (High-Quality Print to PDF A4 Landscape)
function exportQueryToPDF() {
  const dataToExport = filteredQueryData && filteredQueryData.length > 0 ? filteredQueryData : globalData;

  if (!dataToExport || dataToExport.length === 0) {
    alert("ไม่พบข้อมูลสำหรับส่งออกเป็น PDF");
    return;
  }

  // สร้างหน้าต่างพิมพ์เฉพาะ (Print Window) สำหรับแปลงเป็น PDF ได้ 100% โดยไม่ตกขอบและรองรับหลายหน้า
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("กรุณาอนุญาต Pop-up บนเบราว์เซอร์เพื่อเปิดหน้าพิมพ์เอกสาร PDF");
    return;
  }

  const keyword = ($("#querySearchInput").val() || "").trim();
  const searchNotice = keyword ? `เงื่อนไขค้นหา: "${keyword}" &bull; ` : "";

  const rowsHtml = dataToExport.map((item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 10px; page-break-inside: avoid;">
      <td style="padding: 6px; text-align: center; font-weight: bold; color: #475569;">${idx + 1}</td>
      <td style="padding: 6px; font-weight: bold; color: #0f172a;">
        ${item.orderNo}<br>
        <span style="font-size: 9px; color: #64748b; font-weight: normal;">${item.customer}</span>
      </td>
      <td style="padding: 6px; font-family: monospace; color: #334155;">
        ${item.moNo || '-'}<br>
        <span style="color:#6366f1;">${item.poNo || '-'}</span>
      </td>
      <td style="padding: 6px; color: #1e293b;">
        ${item.orderQuantity || '-'}<br>
        <span style="font-size: 9px; color: #64748b;">${item.productCode || '-'}</span>
      </td>
      <td style="padding: 6px; color: #334155;">
        ${item.destination}<br>
        <span style="font-size: 9px; color: #64748b;">${item.step6?.shippingLine || '-'}</span>
      </td>
      <td style="padding: 6px; text-align: center;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0e7ff; color: #3730a3;">
          Step ${item.currentStep || 1} (${calculateProductionProgress(item)}%)
        </span>
      </td>
      <td style="padding: 6px; color: #059669; font-weight: bold;">${item.step6?.etd || '-'}</td>
      <td style="padding: 6px; color: #475569;">${item.step6?.eta || '-'}</td>
      <td style="padding: 6px; text-align: center;">
        <span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold; ${item.statusBadge === 'On Schedule' ? 'background:#d1fae5; color:#065f46;' : 'background:#fef3c7; color:#92400e;'}">
          ${item.statusBadge || '-'}
        </span>
      </td>
    </tr>
  `).join("");

  const printDocumentHtml = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>Wood_Pellets_Query_Report_${new Date().toISOString().slice(0, 10)}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 10mm 10mm 12mm 10mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          margin: 0;
          padding: 10px;
          color: #0f172a;
          background: #ffffff;
        }
        .header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title {
          font-size: 16px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }
        .subtitle {
          font-size: 11px;
          color: #475569;
          margin: 2px 0 0 0;
        }
        .meta {
          text-align: right;
          font-size: 10px;
          color: #64748b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 2px solid #cbd5e1;
          padding: 8px 6px;
          text-align: left;
        }
        th.center, td.center {
          text-align: center;
        }
        .footer {
          margin-top: 16px;
          border-top: 1px solid #cbd5e1;
          padding-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
        }
        .btn-print-box {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: #4f46e5;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        @media print {
          .btn-print-box { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="btn-print-box" onclick="window.print()">🖨️ บันทึกเป็น PDF / พิมพ์เอกสาร</button>
      <div class="header">
        <div>
          <div style="font-size: 11px; font-weight: bold; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px;">Green River Panels (Thailand) Co., Ltd</div>
          <h1 class="title">รายงานข้อมูลคำสั่งซื้อและการจัดส่ง (Order Query Report)</h1>
          <p class="subtitle">Wood Pellets Operations — ${searchNotice}ทั้งหมด ${dataToExport.length} รายการ</p>
        </div>
        <div class="meta">
          <div>วันที่ออกเอกสาร: ${new Date().toLocaleDateString('th-TH')}</div>
          <div>พิมพ์โดยระบบ BPM Operations Dashboard</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="center" style="width: 35px;">#</th>
            <th style="width: 140px;">Order No / ลูกค้า</th>
            <th style="width: 110px;">MO / PO No</th>
            <th style="width: 80px;">ปริมาณ</th>
            <th>ปลายทาง / สายเรือ</th>
            <th class="center" style="width: 95px;">Step / %</th>
            <th style="width: 75px;">ETD</th>
            <th style="width: 75px;">ETA</th>
            <th class="center" style="width: 90px;">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>Green River Panels (Thailand) Co., Ltd &bull; Wood Pellets Master System</span>
        <span>เอกสารทางการสำหรับการตรวจสอบและการผลิต &bull; ทั้งหมด ${dataToExport.length} รายการ</span>
      </div>

      <script>
        window.onload = function() {
          // สั่งเปิดหน้าต่าง Print ของเบราว์เซอร์ทันที
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDocumentHtml);
  printWindow.document.close();
}

// ==========================================
// การสลับภาษา และ Export ในหน้า Dashboard เดิม
// ==========================================

function toggleLanguage() {
  currentLang = currentLang === "th" ? "en" : "th";

  $("#lang-label").text(currentLang === "th" ? "EN / TH" : "TH / EN");

  $("[data-i18n]").each(function () {
    const key = $(this).attr("data-i18n");
    if (translations[currentLang][key]) {
      $(this).html(translations[currentLang][key]);
    }
  });

  $("[data-i18n-placeholder]").each(function () {
    const key = $(this).attr("data-i18n-placeholder");
    if (translations[currentLang][key]) {
      $(this).attr("placeholder", translations[currentLang][key]);
    }
  });

  $("html").attr("lang", currentLang);

  if (currentView === "dashboard") {
    renderDashboard(globalData);
  } else {
    renderQueryView();
  }
}

function exportToExcel() {
  const dataToExport = dashboardFilteredData.length > 0 ? dashboardFilteredData : globalData;
  if (!dataToExport || dataToExport.length === 0) {
    alert("ไม่มีข้อมูลสำหรับ Export");
    return;
  }

  const excelData = dataToExport.map((item, idx) => ({
    No: idx + 1,
    "Order No": item.orderNo,
    "MO No": item.moNo || "-",
    Customer: item.customer,
    Destination: item.destination,
    "POD Code": item.podCode,
    "Shipping Line": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-",
    "Current Step": `Step ${item.currentStep || 1}`,
    "Progress (%)": calculateProductionProgress(item) + "%",
    ETD: item.step6?.etd || "-",
    ETA: item.step6?.eta || "-",
    Status: item.statusBadge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipment Orders");
  XLSX.writeFile(workbook, `Manufacturing_Shipment_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function exportToPDF() {
  const $element = $("#exportableArea");

  if ($element.length === 0) {
    alert("ไม่พบพื้นที่ข้อมูลสำหรับแปลงเป็น PDF");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("ไม่พบ html2pdf library");
    return;
  }

  const element = $element.get(0);

  const options = {
    margin: 10,
    filename: "Manufacturing_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  };

  html2pdf(element, options);
}

// ฟังก์ชันคำนวณเปอร์เซ็นต์ตามกฎ 7 Step
// Step 1: 5% (Sale)
// Step 2: 15% (RA)
// Step 3: 30% (Woods Planning)
// Step 4: 50% (Pelletizing)
// Step 5: 70% (QA)
// Step 6: 85% (Warehouse)
// Step 7: 100% (Shipment)
function calculateProductionProgress(item) {
  if (!item) return 0;
  const currentStep = Number(item.currentStep) || 1;

  const stepPercentMap = {
    1: 5,
    2: 15,
    3: 30,
    4: 50,
    5: 70,
    6: 85,
    7: 100,
  };

  if (stepPercentMap[currentStep] !== undefined) {
    return stepPercentMap[currentStep];
  }

  return currentStep >= 7 ? 100 : Math.min(100, currentStep * 15);
}

// ฟังก์ชันสั่งอัปเดตตัวเลขเปอร์เซ็นต์และการ์ดด้านบนแบบ Real-time
function updateProductionProgressCard(item) {
  if (!item) return;

  const percent = calculateProductionProgress(item);
  const stepNames = {
    1: "Step 1: Sale",
    2: "Step 2: RA",
    3: "Step 3: Woods Planning",
    4: "Step 4: Pelletizing",
    5: "Step 5: QA",
    6: "Step 6: Warehouse",
    7: "Step 7: Shipment",
  };

  const stepText = stepNames[item.currentStep] || `Step ${item.currentStep || 1}`;

  $("#production-progress-text").text(percent + "%");
  $("#production-progress-sub").text(`${item.orderNo} (${stepText})`);

  const $bar = $("#production-progress-bar");
  $bar.css("width", percent + "%");

  if (percent === 100) {
    $bar.removeClass("bg-amber-500").addClass("bg-emerald-500");
  } else {
    $bar.removeClass("bg-emerald-500").addClass("bg-amber-500");
  }
}

// ฟังก์ชันเมื่อคลิกเลือก Order จากตาราง Dashboard
function handleSelectOrder(orderNo) {
  const selectedItem = globalData.find((x) => x.orderNo === orderNo);
  if (!selectedItem) return;

  currentSelectedOrderNo = orderNo;

  if (window.Components && typeof window.Components.renderPipeline === "function") {
    $("#pipelineContainer").html(window.Components.renderPipeline(selectedItem));
  }
  if (window.Components && typeof window.Components.renderWoodPelletsQuickBar === "function") {
    $("#woodPelletsQuickBarContainer").html(window.Components.renderWoodPelletsQuickBar(selectedItem));
  }
  if (window.Components && typeof window.Components.renderProduction === "function") {
    $("#prodSection").html(window.Components.renderProduction(selectedItem));
  }
  updateProductionProgressCard(selectedItem);

  $("#orderTableBody tr").removeClass("bg-indigo-50/80 border-l-4 border-indigo-600 font-semibold");
  $(`#order-row-${orderNo}`).addClass("bg-indigo-50/80 border-l-4 border-indigo-600 font-semibold");
}

let currentBpmModalOrderNo = null;

// ฟังก์ชันเปิดดูแบบฟอร์ม BPM ฉบับเต็ม
function openBpmModal(orderNo) {
  const item = globalData.find((x) => x.orderNo === orderNo) || globalData[0];
  if (!item) return;

  currentBpmModalOrderNo = orderNo;

  $("#bpmModalHeaderTitle").text(`Wood Pellets BPM Form — ${item.orderNo} (${item.customer})`);
  if (window.Components && typeof window.Components.renderBpmModalContent === "function") {
    $("#bpmModalBody").html(window.Components.renderBpmModalContent(item));
  }
  $("#bpmModal").removeClass("hidden");
  $("body").addClass("overflow-hidden has-bpm-open");
}

// ฟังก์ชันปิดแบบฟอร์ม BPM
function closeBpmModal() {
  $("#bpmModal").addClass("hidden");
  $("body").removeClass("overflow-hidden has-bpm-open");
}

// สั่งพิมพ์แบบฟอร์ม BPM ผ่าน Hidden Iframe (ตัดปัญหา about:blank บนหัว/ท้ายกระดาษพิมพ์ 100% พร้อมฟอร์แมต A4 Portrait สะอาดบริสุทธิ์)
function printBpmModal() {
  const targetOrderNo = currentBpmModalOrderNo || currentSelectedOrderNo;
  const item = globalData.find((x) => x.orderNo === targetOrderNo) || globalData[0];
  if (!item) return;

  if (!window.Components || typeof window.Components.renderBpmPrintDocument !== "function") {
    alert("ระบบพิมพ์เอกสารยังไม่พร้อมใช้งาน กรุณารีเฟรชหน้าเว็บ");
    return;
  }

  const printHtml = window.Components.renderBpmPrintDocument(item);

  // ค้นหาหรือสร้าง iframe ที่ซ่อนอยู่ใน DOM
  let printIframe = document.getElementById("bpmPrintIframe");
  if (!printIframe) {
    printIframe = document.createElement("iframe");
    printIframe.id = "bpmPrintIframe";
    printIframe.style.position = "fixed";
    printIframe.style.right = "0";
    printIframe.style.bottom = "0";
    printIframe.style.width = "0";
    printIframe.style.height = "0";
    printIframe.style.border = "0";
    printIframe.style.visibility = "hidden";
    document.body.appendChild(printIframe);
  }

  try {
    const iframeDoc = printIframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(printHtml);
    iframeDoc.close();

    // รอให้สไตล์และฟอนต์โหลดสมบูรณ์แล้วสั่งพิมพ์ผ่าน iframe โดยตรง
    setTimeout(() => {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
    }, 250);
  } catch (err) {
    console.warn("Iframe print fallback triggered:", err);
    // Fallback หากเบราว์เซอร์ติดความปลอดภัย iframe ในบางโหมด
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } else {
      alert("กรุณาอนุญาต Pop-up บนเบราว์เซอร์เพื่อพิมพ์เอกสาร");
    }
  }
}

// ฟังก์ชันเปิดดูแผนที่พิกัด GPS (EUDR Geolocation)
function openMapModal(orderNo) {
  const item = globalData.find((x) => x.orderNo === orderNo) || globalData[0];
  if (!item) return;

  const loc = item.location || {};
  $("#mapModalHeaderTitle").text(`พิกัดแปลง/โรงงาน — ${item.moNo || item.orderNo} (${loc.placeName || 'Green River'})`);
  $("#mapModalHeaderSub").text(`Order: ${item.orderNo} &bull; ลูกค้า: ${item.customer} &bull; EUDR Status: ${loc.eudrStatus || 'Verified'}`);
  if (window.Components && typeof window.Components.renderMapModalContent === "function") {
    $("#mapModalBody").html(window.Components.renderMapModalContent(item));
  }
  $("#mapModal").removeClass("hidden");
  $("body").addClass("overflow-hidden");
}

// ฟังก์ชันปิดหน้าต่างแผนที่
function closeMapModal() {
  $("#mapModal").addClass("hidden");
  $("body").removeClass("overflow-hidden");
  // เคลียร์เนื้อหา iframe เมื่อปิด เพื่อหยุดการโหลดแผนที่ในพื้นหลัง
  $("#mapModalBody").empty();
}

// ปิด Modal หรือออกจากโหมดเต็มจอเมื่อกดปุ่ม Escape หรือคลิกพื้นหลัง
$(document).keydown(function (e) {
  if (e.key === "Escape") {
    if (typeof isMapFullscreen !== "undefined" && isMapFullscreen) {
      toggleMapFullscreen();
      return;
    }
    closeBpmModal();
    closeMapModal();
  }
});

$(document).on("click", "#bpmModal", function (e) {
  if (e.target === this) closeBpmModal();
});

$(document).on("click", "#mapModal", function (e) {
  if (e.target === this) closeMapModal();
});

// ==========================================
// ส่วนฟังก์ชันระบบแผนที่พิกัดรวม (Leaflet GIS Map Engine)
// ==========================================

let leafletMapInstance = null;
let leafletMarkersMap = {}; // orderNo -> { marker, targetLat, targetLng, item }
let currentTileLayer = null;
let currentTileType = "osm"; // 'osm' | 'satellite'
let dispersionAnimFrameId = null;
let isMapFullscreen = false;

// เรนเดอร์หน้าแผนที่พิกัดรวม และเริ่มสร้าง Leaflet Map
function renderMapOverview() {
  if (window.Components && typeof window.Components.renderMapOverviewView === "function") {
    $("#mapViewContainer").html(window.Components.renderMapOverviewView(globalData));
    // รอให้ DOM พร้อมแล้วเริ่มสร้าง Leaflet Map
    setTimeout(() => {
      initLeafletMap();
    }, 100);
  } else {
    console.warn("[BPM Wood Pellets] Components.renderMapOverviewView not available");
    $("#mapViewContainer").html(`
      <div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <i class="fa-solid fa-map-location-dot text-3xl text-indigo-500 mb-2"></i>
        <p class="font-bold">ระบบแผนที่กำลังโหลด...</p>
        <p class="text-xs text-slate-400 mt-1">หากไม่แสดง กรุณากด Ctrl+F5 เพื่อล้างแคชไฟล์ JavaScript</p>
      </div>
    `);
  }
}

// สร้างแผนที่ Leaflet และผูกพิกัดจริงเข้ากับหมุดทุกตัว
function initLeafletMap() {
  const mapElement = document.getElementById("leafletMap");
  if (!mapElement) return;

  // ล้างแผนที่เดิมหากเคยสร้างไว้ เพื่อป้องกัน Memory Leak
  if (leafletMapInstance) {
    leafletMapInstance.remove();
    leafletMapInstance = null;
  }

  // จุดศูนย์กลางภาคใต้: [8.1, 100.2] ระดับซูม 8 (เห็นภาพรวมทั้งภาคใต้ สุราษฎร์ฯ ตรัง นครศรีฯ สงขลา ยะลา)
  leafletMapInstance = L.map("leafletMap", {
    center: [8.1, 100.2],
    zoom: 8,
    minZoom: 6,
    maxZoom: 18,
    zoomControl: true
  });

  // ใส่ Base Tile Layer
  setLeafletTileLayer(currentTileType);

  // จุดศูนย์กลางรวมเริ่มต้น: โรงงาน Green River Panels หาดใหญ่
  const centerLat = 7.0089;
  const centerLng = 100.4767;

  // วาดวงแหวน Radar Wave แสดงจุดศูนย์กลาง Hub (Green River Panels HQ)
  const hubIcon = L.divIcon({
    className: "leaflet-hub-icon",
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span class="w-14 h-14 rounded-full bg-indigo-500/25 border border-indigo-400/50 animate-ping absolute"></span>
        <span class="w-9 h-9 rounded-full bg-indigo-600/40 border border-indigo-400/70 animate-pulse absolute"></span>
        <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl border-2 border-indigo-300 z-10">
          <i class="fa-solid fa-bullseye text-[10px]"></i>
        </div>
      </div>
    `,
    iconSize: [28, 28]
  });
  L.marker([centerLat, centerLng], { icon: hubIcon, zIndexOffset: 50 }).addTo(leafletMapInstance);

  // สร้าง Markers สำหรับทุกคำสั่งซื้อ โดยเริ่มต้นที่จุดศูนย์กลาง
  leafletMarkersMap = {};

  globalData.forEach((item, index) => {
    const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River" };

    // ธีมสีและไอคอนแยกตามประเภทสถานที่
    let bgClass = "bg-emerald-600";
    let borderClass = "border-emerald-400";
    let ringClass = "bg-emerald-400";
    let iconClass = "fa-tree";
    if (loc.placeName.includes("โรงงาน")) {
      bgClass = "bg-indigo-600";
      borderClass = "border-indigo-400";
      ringClass = "bg-indigo-400";
      iconClass = "fa-industry";
    } else if (loc.placeName.includes("ท่าเรือ")) {
      bgClass = "bg-cyan-600";
      borderClass = "border-cyan-400";
      ringClass = "bg-cyan-400";
      iconClass = "fa-ship";
    }

    const customDivIcon = L.divIcon({
      className: `custom-map-pin-icon pin-${item.orderNo}`,
      html: `
        <div id="pin-el-${item.orderNo}" class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <span class="absolute -inset-1 rounded-full ${ringClass} opacity-40 animate-ping group-hover:opacity-80"></span>
          <div class="relative w-8 h-8 rounded-full ${bgClass} text-white flex items-center justify-center shadow-lg border-2 ${borderClass} transition-transform duration-200 group-hover:scale-125">
            <i class="fa-solid ${iconClass} text-xs"></i>
          </div>
          <div class="whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-700 mt-1 pointer-events-none group-hover:scale-110 transition-transform">
            ${item.moNo || item.orderNo}
          </div>
        </div>
      `,
      iconSize: [32, 48]
    });

    // ปัก Marker ลงบนแผนที่ Leaflet (เริ่มต้นที่จุดศูนย์กลางเดียวกัน)
    const marker = L.marker([centerLat, centerLng], { icon: customDivIcon, zIndexOffset: 100 + index });
    marker.addTo(leafletMapInstance);

    // ดักจับการคลิกที่หมุด
    marker.on("click", function () {
      handleMarkerClick(item.orderNo);
    });

    leafletMarkersMap[item.orderNo] = {
      marker: marker,
      startLat: centerLat,
      startLng: centerLng,
      targetLat: loc.lat,
      targetLng: loc.lng,
      item: item,
      index: index
    };
  });

  // หน่วงเวลาเล็กน้อยเพื่อให้แผนที่โหลดกระเบื้องภาพเสร็จ แล้วเริ่มแอนิเมชันกระจายหมุด
  setTimeout(() => {
    leafletMapInstance.invalidateSize();
    triggerMapDispersionAnimation();
  }, 250);
}

// สลับรูปแบบกระเบื้องแผนที่ (OpenStreetMap vs Satellite)
function setLeafletTileLayer(type) {
  currentTileType = type;
  if (!leafletMapInstance) return;

  if (currentTileLayer) {
    leafletMapInstance.removeLayer(currentTileLayer);
  }

  if (type === "satellite") {
    // แผนที่ภาพถ่ายดาวเทียมความละเอียดสูง (ESRI World Imagery)
    currentTileLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 18
    });
  } else {
    // แผนที่ถนนมาตรฐาน OpenStreetMap
    currentTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      maxZoom: 18
    });
  }

  currentTileLayer.addTo(leafletMapInstance);
}

// สลับปุ่มโหมดแผนที่บนแถบเครื่องมือ
function switchLeafletTile(type) {
  setLeafletTileLayer(type);

  if (type === "satellite") {
    $("#btnTileSat").addClass("bg-indigo-600 text-white font-bold").removeClass("text-slate-300 font-medium");
    $("#btnTileOsm").removeClass("bg-indigo-600 text-white font-bold").addClass("text-slate-300 font-medium");
  } else {
    $("#btnTileOsm").addClass("bg-indigo-600 text-white font-bold").removeClass("text-slate-300 font-medium");
    $("#btnTileSat").removeClass("bg-indigo-600 text-white font-bold").addClass("text-slate-300 font-medium");
  }
}

// รีเซ็ตมุมมองแผนที่กลับมาที่ภาพรวมภาคใต้
function resetLeafletMapView() {
  if (!leafletMapInstance) return;
  leafletMapInstance.setView([8.1, 100.2], 8, { animate: true });
}

// เล่นแอนิเมชันรวมหมุดที่ศูนย์กลาง แล้วค่อยๆ กระจายตัวออกไปยังพิกัดจริง
function triggerMapDispersionAnimation() {
  if (dispersionAnimFrameId) cancelAnimationFrame(dispersionAnimFrameId);

  // ปิด Popup เดิมหากเปิดค้างอยู่
  $("#markerDetailPopup").addClass("hidden");

  const orderKeys = Object.keys(leafletMarkersMap);
  if (orderKeys.length === 0) return;

  const centerLat = 7.0089;
  const centerLng = 100.4767;

  // ขั้นที่ 1: ดึงหมุดทุกจุดมารวมที่ศูนย์กลางเดียวกันก่อน
  orderKeys.forEach((key) => {
    const entry = leafletMarkersMap[key];
    entry.marker.setLatLng([centerLat, centerLng]);
  });

  // ขั้นที่ 2: หน่วงเวลาเล็กน้อย แล้วเริ่มกระจายตัวแบบ Smooth Easing
  const animationDuration = 1200; // 1.2 วินาทีต่อหมุด
  const startTime = performance.now() + 200;

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function animateLoop(now) {
    let allFinished = true;

    orderKeys.forEach((key) => {
      const entry = leafletMarkersMap[key];
      const markerDelay = entry.index * 40; // Staggered delay ให้ค่อยๆ เคลื่อนตัวทีละจุด
      const markerStart = startTime + markerDelay;

      if (now < markerStart) {
        entry.marker.setLatLng([centerLat, centerLng]);
        allFinished = false;
      } else {
        const elapsed = now - markerStart;
        const progress = Math.min(1, elapsed / animationDuration);
        const ease = easeOutCubic(progress);

        // คำนวณพิกัดระหว่างทางแบบ Lerp
        const currentLat = entry.startLat + (entry.targetLat - entry.startLat) * ease;
        const currentLng = entry.startLng + (entry.targetLng - entry.startLng) * ease;

        entry.marker.setLatLng([currentLat, currentLng]);

        if (progress < 1) {
          allFinished = false;
        }
      }
    });

    if (!allFinished) {
      dispersionAnimFrameId = requestAnimationFrame(animateLoop);
    }
  }

  dispersionAnimFrameId = requestAnimationFrame(animateLoop);
}

// เมื่อคลิกที่หมุดใดๆ บนแผนที่
function handleMarkerClick(orderNo) {
  const item = globalData.find((x) => x.orderNo === orderNo);
  if (!item) return;

  const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Hat Yai" };
  const googleMapsUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;

  // ซูมและขยับแผนที่ไปยังตำแหน่งหมุดนั้นอย่างนุ่มนวล
  if (leafletMapInstance) {
    leafletMapInstance.panTo([loc.lat, loc.lng], { animate: true, duration: 0.6 });
  }

  // ไฮไลต์การ์ดใน Sidebar ด้านข้าง และเลื่อน scroll ไปหา
  $(".p-3.bg-white").removeClass("ring-2 ring-indigo-500 bg-indigo-50/70");
  const $card = $(`#loc-card-${orderNo}`);
  if ($card.length) {
    $card.addClass("ring-2 ring-indigo-500 bg-indigo-50/70");
    $card[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // เรนเดอร์กล่อง Popup รายละเอียดที่มุมล่างแผนที่
  const popupHtml = `
    <div class="flex items-start justify-between pb-2 mb-2 border-b border-slate-700">
      <div>
        <span class="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 inline-block mb-1">
          <i class="fa-solid fa-tree mr-1"></i> แหล่งกำเนิดไม้ / สวนยางพารา
        </span>
        <h4 class="text-sm font-bold text-white">${loc.placeName}</h4>
        <p class="text-[11px] text-slate-300">รหัสแปลง: <strong class="font-mono text-indigo-300">${loc.plotId}</strong> &bull; พื้นที่: <strong class="text-emerald-400">${loc.areaRai}</strong></p>
      </div>
      <button onclick="closeMarkerPopup()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2 text-xs mb-3 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700">
      <div><span class="text-slate-400 block text-[10px]">Order No.:</span> <strong class="text-white">${item.orderNo}</strong></div>
      <div><span class="text-slate-400 block text-[10px]">MO No.:</span> <strong class="text-indigo-300 font-mono">${item.moNo || '-'}</strong></div>
      <div><span class="text-slate-400 block text-[10px]">ลูกค้า:</span> <span class="text-slate-200 truncate block">${item.customer}</span></div>
      <div><span class="text-slate-400 block text-[10px]">ปริมาณ:</span> <strong class="text-amber-400">${item.orderQuantity || '500 Ton'}</strong></div>
      <div class="col-span-2 pt-1 border-t border-slate-700 flex items-center justify-between text-[11px]">
        <span class="text-emerald-400 font-semibold"><i class="fa-solid fa-shield-halved mr-1"></i> ${loc.eudrStatus}</span>
        <span class="text-slate-300 font-mono">GPS: ${loc.lat}, ${loc.lng}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center">
        <i class="fa-solid fa-map-location-dot mr-1.5 text-xs"></i> Google Maps
      </a>
      <button onclick="openBpmModal('${item.orderNo}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center">
        <i class="fa-solid fa-file-invoice mr-1.5 text-xs"></i> ฟอร์ม BPM
      </button>
      <button onclick="jumpToDashboardOrder('${item.orderNo}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-all">
        ดูใน Dashboard
      </button>
    </div>
  `;

  $("#markerDetailPopupContent").html(popupHtml);
  $("#markerDetailPopup").removeClass("hidden").addClass("animate-in fade-in zoom-in-95 duration-200");
}

// ปิดการ์ด Popup บนแผนที่
function closeMarkerPopup() {
  $("#markerDetailPopup").addClass("hidden");
}

// โฟกัสหมุดเมื่อคลิกการ์ดใน Sidebar
function focusMapMarker(orderNo) {
  handleMarkerClick(orderNo);
}

// ค้นหากรองรายการสถานที่ใน Sidebar
function filterMapSidebar() {
  const keyword = ($("#mapSearchInput").val() || "").toLowerCase().trim();

  globalData.forEach((item) => {
    const loc = item.location || {};
    const match =
      !keyword ||
      item.orderNo.toLowerCase().includes(keyword) ||
      (item.moNo && item.moNo.toLowerCase().includes(keyword)) ||
      (item.customer && item.customer.toLowerCase().includes(keyword)) ||
      (loc.placeName && loc.placeName.toLowerCase().includes(keyword)) ||
      (loc.plotId && loc.plotId.toLowerCase().includes(keyword));

    const $card = $(`#loc-card-${item.orderNo}`);
    const entry = leafletMarkersMap[item.orderNo];

    if (match) {
      $card.removeClass("hidden");
      if (entry && entry.marker && leafletMapInstance) {
        if (!leafletMapInstance.hasLayer(entry.marker)) {
          entry.marker.addTo(leafletMapInstance);
        }
      }
    } else {
      $card.addClass("hidden");
      if (entry && entry.marker && leafletMapInstance) {
        if (leafletMapInstance.hasLayer(entry.marker)) {
          leafletMapInstance.removeLayer(entry.marker);
        }
      }
    }
  });
}

// ==========================================
// ฟังก์ชันโหมดเต็มจอสำหรับแผนที่ (Map Fullscreen Toggle)
// ==========================================

function toggleMapFullscreen() {
  const $wrapper = $("#gisMapBoxWrapper");
  const $viewport = $("#gisMapViewport");
  const wrapperEl = document.getElementById("gisMapBoxWrapper");

  if (!$wrapper.length || !$viewport.length) return;

  isMapFullscreen = !isMapFullscreen;

  if (isMapFullscreen) {
    // 1. ปรับสไตล์ CSS ให้ครอบคลุมทั้งหน้าจอแบบ Fixed Overlay
    $wrapper
      .addClass("fixed inset-0 z-50 w-screen h-screen rounded-none p-4 bg-slate-950 m-0")
      .removeClass("lg:col-span-3 rounded-3xl");
    $viewport
      .removeClass("h-[540px] md:h-[620px]")
      .addClass("flex-1 h-full min-h-[85vh]");

    // 2. ปรับเปลี่ยนข้อความและไอคอนบนปุ่ม
    $("#btnFullscreenText").text("ย่อหน้าจอ");
    $("#btnFullscreenIcon").removeClass("fa-expand text-indigo-400").addClass("fa-compress text-rose-400");
    $("#floatingFullscreenIcon").removeClass("fa-expand text-indigo-300").addClass("fa-compress text-rose-300");
    $("#fullscreenNoticeBadge").removeClass("hidden");
    $("#fullscreenQuickControls").removeClass("hidden");

    // 3. ป้องกันไม่ให้หน้าหลักเบื้องหลัง Scroll
    $("body").addClass("overflow-hidden");

    // 4. เรียก Browser Fullscreen API หากอุปกรณ์/เบราว์เซอร์รองรับ
    if (wrapperEl && wrapperEl.requestFullscreen && !document.fullscreenElement) {
      wrapperEl.requestFullscreen().catch(() => {
        // หากมีข้อจำกัดด้านนโยบายเบราว์เซอร์ ระบบ CSS Overlay ยังคงขยายเต็มจอได้อย่างสมบูรณ์แบบ
      });
    }
  } else {
    // 1. คืนสภาพกลับเป็นกล่องในแดชบอร์ดตามเดิม
    $wrapper
      .removeClass("fixed inset-0 z-50 w-screen h-screen rounded-none p-4 bg-slate-950 m-0")
      .addClass("lg:col-span-3 rounded-3xl");
    $viewport
      .addClass("h-[540px] md:h-[620px]")
      .removeClass("flex-1 h-full min-h-[85vh]");

    // 2. คืนข้อความและไอคอนบนปุ่มกลับเป็นปกติ
    $("#btnFullscreenText").text("ขยายเต็มจอ");
    $("#btnFullscreenIcon").removeClass("fa-compress text-rose-400").addClass("fa-expand text-indigo-400");
    $("#floatingFullscreenIcon").removeClass("fa-compress text-rose-300").addClass("fa-expand text-indigo-300");
    $("#fullscreenNoticeBadge").addClass("hidden");

    // 3. คืนค่า Scroll ของหน้าหลัก
    $("body").removeClass("overflow-hidden");

    // 4. ออกจาก Browser Fullscreen API หากยังเปิดอยู่
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // 5. บังคับให้ Leaflet Engine คำนวณขนาด Viewport ใหม่ทันที เพื่อไม่ให้หมุดหรือกระเบื้องภาพแหว่ง
  if (leafletMapInstance) {
    leafletMapInstance.invalidateSize();
    setTimeout(() => {
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 150);
    setTimeout(() => {
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 450);
  }
}

// ดักจับการเปลี่ยนแปลง Fullscreen ของ Browser (เช่น เมื่อผู้ใช้กดย่อหน้าต่างด้วยปุ่มของเบราว์เซอร์)
document.addEventListener("fullscreenchange", function () {
  if (!document.fullscreenElement && isMapFullscreen) {
    toggleMapFullscreen();
  }
});