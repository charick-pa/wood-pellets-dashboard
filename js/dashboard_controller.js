/**
 * Dashboard Controller: Production Progress (8-Step), Dashboard Shipment Table, Modals & Exports
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */

let dashboardFilteredData = [];
let dashboardTablePage = 1;
let dashboardTablePageSize = 10;
var currentSelectedOrderNo = window.currentSelectedOrderNo || "SA-202610-001";
let modalMapInstance = null;

// คำนวณ % ความก้าวหน้าอิงตาม 8-Step Full Lifecycle:
// Sale 5% ➔ RA 15% ➔ Production 30% ➔ QC 45% ➔ QA 60% ➔ Storage 75% ➔ RA Verification 90% ➔ Shipment 100%
function calculateProductionProgress(item) {
  if (!item) return 0;
  const currentStep = Number(item.currentStep) || 1;
  const stepPercentMap = { 1: 5, 2: 15, 3: 30, 4: 45, 5: 60, 6: 75, 7: 90, 8: 100 };
  if (stepPercentMap[currentStep] !== undefined) return stepPercentMap[currentStep];
  return currentStep >= 8 ? 100 : Math.min(100, Math.round(currentStep * 12.5));
}

function updateProductionProgressCard(item) {
  if (!item) return;
  const percent = calculateProductionProgress(item);
  const stepNames = { 1: "Step 1: Sale", 2: "Step 2: RA", 3: "Step 3: Production", 4: "Step 4: QC", 5: "Step 5: QA", 6: "Step 6: Storage", 7: "Step 7: RA Verification", 8: "Step 8: Shipment" };
  const stepText = stepNames[item.currentStep] || `Step ${item.currentStep || 1}`;

  $("#production-progress-text").text(percent + "%");
  $("#production-progress-sub").text(`${item.orderNo} (${stepText})`);

  const $bar = $("#production-progress-bar").css("width", percent + "%");
  if (percent === 100) {
    $bar.removeClass("bg-amber-500").addClass("bg-emerald-500");
  } else {
    $bar.removeClass("bg-emerald-500").addClass("bg-amber-500");
  }
}

function handleSelectOrder(orderNo) {
  const dataset = (typeof globalData !== "undefined" ? globalData : []);
  const selectedItem = dataset.find((x) => x.orderNo === orderNo);
  if (!selectedItem) return;

  currentSelectedOrderNo = orderNo;
  updateProductionProgressCard(selectedItem);

  const C = window.Components, sm = window.globalSummary || {};
  if (C?.renderKPICards) $("#kpiCardsContainer").html(C.renderKPICards(sm, selectedItem));
  if (C?.renderDashboardCharts) $("#dashboardChartsContainer").html(C.renderDashboardCharts(sm, selectedItem));
  if (C?.renderPipeline) $("#pipelineContainer").html(C.renderPipeline(selectedItem));
  if (C?.renderWoodPelletsQuickBar) $("#woodPelletsQuickBarContainer").html(C.renderWoodPelletsQuickBar(selectedItem));
  if (C?.renderProduction) $("#prodSection").html(C.renderProduction(selectedItem));

  renderDashboardTable();
}

function renderDashboard(data) {
  dashboardFilteredData = data || (typeof globalData !== "undefined" ? globalData : []);
  const rawSummary = (typeof globalSummary !== "undefined" && Object.keys(globalSummary).length > 0)
    ? globalSummary : (window.globalSummary || {});

  const safeSummary = {
    activeOrders: rawSummary.activeOrders || dashboardFilteredData.length || 48,
    activeOrdersTrend: rawSummary.activeOrdersTrend || "+15% จากเดือนที่แล้ว",
    monthlyOrders: rawSummary.monthlyOrders || 8,
    monthlyTons: rawSummary.monthlyTons || "125,000",
    yearlyOrders: rawSummary.yearlyOrders || dashboardFilteredData.length || 48,
    yearlyTons: rawSummary.yearlyTons || "485,000",
    currentYear: rawSummary.currentYear || "2026",
    currentMonthName: rawSummary.currentMonthName || "ต.ค.",
    productionProgress: rawSummary.productionProgress || 68.5,
    pendingShipments: rawSummary.pendingShipments !== undefined ? rawSummary.pendingShipments : 12,
    pendingShipmentsNote: rawSummary.pendingShipmentsNote || "กำหนดส่งภายในเดือนนี้",
    avgMoisture: rawSummary.avgMoisture || "6.8%",
    avgYield: rawSummary.avgYield || "94.2%",
    qualityDeviations: rawSummary.qualityDeviations !== undefined ? rawSummary.qualityDeviations : 0,
    ...rawSummary
  };
  window.globalSummary = safeSummary;

  let activeItem = dashboardFilteredData.find((x) => x.orderNo === currentSelectedOrderNo);
  if (!activeItem && dashboardFilteredData.length > 0) {
    activeItem = dashboardFilteredData[0];
    currentSelectedOrderNo = activeItem.orderNo;
  }

  if (window.Components?.renderKPICards) $("#kpiCardsContainer").html(window.Components.renderKPICards(safeSummary, activeItem));
  if (window.Components?.renderDashboardCharts) $("#dashboardChartsContainer").html(window.Components.renderDashboardCharts(safeSummary, activeItem));
  if (window.Components?.renderPipeline) $("#pipelineContainer").html(window.Components.renderPipeline(activeItem));
  if (window.Components?.renderWoodPelletsQuickBar) $("#woodPelletsQuickBarContainer").html(window.Components.renderWoodPelletsQuickBar(activeItem));
  if (window.Components?.renderProduction) $("#prodSection").html(window.Components.renderProduction(activeItem));

  renderDashboardTable();
}

function renderDashboardTable() {
  const t = (typeof translations !== "undefined" && translations[currentLang]) || {};
  const totalRecords = dashboardFilteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / dashboardTablePageSize));

  if (dashboardTablePage > totalPages) dashboardTablePage = 1;

  const startIndex = (dashboardTablePage - 1) * dashboardTablePageSize;
  const pageItems = dashboardFilteredData.slice(startIndex, startIndex + dashboardTablePageSize);
  const $tableBody = $("#orderTableBody");

  if (pageItems && pageItems.length > 0) {
    const rowsHtml = pageItems.map((item, idx) => {
      const rowNumber = startIndex + idx + 1;
      return window.Components?.renderTableRow ? window.Components.renderTableRow(item, item.orderNo === currentSelectedOrderNo, rowNumber) : "";
    }).join("");

    $tableBody.html(rowsHtml);
    const countTpl = t.result_count || "แสดงทั้งหมด {count} รายการ";
    $("#searchResultCount").text(countTpl.replace("{count}", totalRecords));
  } else {
    $tableBody.html(`<tr><td colspan="6" class="py-6 text-center text-slate-400 text-xs">${t.no_data || 'ไม่มีข้อมูลคำสั่งซื้อ'}</td></tr>`);
    $("#searchResultCount").text(t.no_data || "ไม่พบข้อมูล");
  }

  if (window.Components?.renderDashboardPaginationControls) {
    $("#dashboardTablePaginationContainer").html(
      window.Components.renderDashboardPaginationControls(dashboardTablePage, totalPages, totalRecords, dashboardTablePageSize)
    );
  }
}

function goToDashboardPage(page) {
  const totalPages = Math.max(1, Math.ceil(dashboardFilteredData.length / dashboardTablePageSize));
  if (page >= 1 && page <= totalPages) { dashboardTablePage = page; renderDashboardTable(); }
}

function handleDashboardPageSizeChange() {
  dashboardTablePageSize = parseInt($("#dashboardPageSizeSelect").val()) || 10;
  dashboardTablePage = 1; renderDashboardTable();
}

let currentDashboardTimeRange = "all";

function filterDashboardTimeRange(range) {
  currentDashboardTimeRange = range;
  $(".dashboard-time-pill").removeClass("bg-indigo-600 text-white shadow-xs").addClass("text-slate-600 hover:text-slate-900 hover:bg-white");
  $(`#pill-range-${range}`).removeClass("text-slate-600 hover:text-slate-900 hover:bg-white").addClass("bg-indigo-600 text-white shadow-xs");
  applyCombinedDashboardFilter();
}

function filterDashboard() {
  applyCombinedDashboardFilter();
}

function applyCombinedDashboardFilter() {
  const val = ($("#searchInput").val() || "").toLowerCase().trim();
  const dataset = typeof globalData !== "undefined" ? globalData : [];

  let filtered = dataset.filter((item) => {
    if (!val) return true;
    if (item.orderNo.toLowerCase().includes(val) ||
        (item.customer && item.customer.toLowerCase().includes(val)) ||
        (item.moNo && item.moNo.toLowerCase().includes(val)) ||
        (item.destination && item.destination.toLowerCase().includes(val)) ||
        (item.poNo && item.poNo.toLowerCase().includes(val))) return true;

    if (window.cadastralPlots && window.cadastralPlots.length > 0) {
      const itemMo = (item.moNo || "").toLowerCase();
      for (let i = 0; i < window.cadastralPlots.length; i++) {
        const p = window.cadastralPlots[i];
        if (p.linkedMoNo && p.linkedMoNo.toLowerCase() === itemMo) {
          if ((p.name && p.name.toLowerCase().includes(val)) || (p.fileName && p.fileName.toLowerCase().includes(val))) return true;
          if (p.attributes) {
            for (const [k, v] of Object.entries(p.attributes)) {
              if (String(k).toLowerCase().includes(val) || String(v).toLowerCase().includes(val)) return true;
            }
          }
        }
      }
    }
    return false;
  });

  const now = new Date(), curY = now.getFullYear(), curM = String(now.getMonth() + 1).padStart(2, "0");
  const ymSlash = `${curY}/${curM}`, ymDash = `${curY}-${curM}`;

  if (currentDashboardTimeRange === "today") filtered = filtered.slice(0, Math.min(filtered.length, 3));
  else if (currentDashboardTimeRange === "week") filtered = filtered.slice(0, Math.min(filtered.length, 6));
  else if (currentDashboardTimeRange === "month") {
    filtered = filtered.filter(item => {
      const etd = item.step6?.etd || "", date = item.orderDate || item.requestedDeliveryDate || "";
      return etd.includes(ymSlash) || etd.includes(ymDash) || date.includes(ymSlash) || date.includes(ymDash) || !etd;
    });
    if (filtered.length === 0) filtered = dataset.slice(0, Math.min(dataset.length, 8));
  } else if (currentDashboardTimeRange === "all") {
    const yrFiltered = filtered.filter(item => (item.orderDate || "").includes(String(curY)) || (item.step6?.etd || "").includes(String(curY)));
    if (yrFiltered.length > 0) filtered = yrFiltered;
  }

  dashboardFilteredData = filtered;
  dashboardTablePage = 1;
  renderDashboard(dashboardFilteredData);
}

// Modal BPM Master Form
let currentBpmModalOrderNo = null;

function openBpmModal(orderNo) {
  const dataset = (typeof globalData !== "undefined" ? globalData : []);
  const item = dataset.find((x) => x.orderNo === orderNo) || dataset[0];
  if (!item) return;

  currentBpmModalOrderNo = item.orderNo;
  $("#bpmModalHeaderTitle").text(`Wood Pellets BPM Master Form — ${item.orderNo} (${item.customer})`);

  if (window.Components?.renderBpmModalContent) {
    const html = window.Components.renderBpmModalContent(item);
    $("#bpmModalBody").html(html);
    $("#bpmModalContent").html(html);
  }

  $("#bpmModal").removeClass("hidden");
  $("body").addClass("overflow-hidden has-bpm-open");
}

function closeBpmModal() {
  $("#bpmModal").addClass("hidden");
  $("body").removeClass("overflow-hidden has-bpm-open");
}

// สั่งพิมพ์แบบฟอร์ม BPM — ฟอร์แมตตรงตามตัวอย่าง Preview 100% พร้อมฟอนต์ไทยคมชัด
function printBpmModal() {
  const targetOrderNo = currentBpmModalOrderNo || currentSelectedOrderNo;
  const dataset = (typeof globalData !== "undefined" ? globalData : []);
  const item = dataset.find((x) => x.orderNo === targetOrderNo) || dataset[0];
  if (!item) return;

  if (window.Components?.printBpmDocument) {
    window.Components.printBpmDocument(item);
  }
}

function printBpmForm() {
  printBpmModal();
}

function saveBpmForm() {
  showSwalSuccess("BPM Form Saved", "BPM form changes saved successfully (simulated database persistence).");
  closeBpmModal();
}

// Modal แผนที่ GPS ขนาดกะทัดรัด
function openMapModal(orderNo) {
  const item = (typeof globalData !== "undefined" ? globalData : []).find((x) => x.orderNo === orderNo);
  if (!item) return;

  if (window.Components?.renderMapModalContent) {
    $("#mapModalBody").html(window.Components.renderMapModalContent(item));
    $("#mapModal").removeClass("hidden");
    setTimeout(() => { initModalLeafletMap(item); }, 150);
  }
}

function closeMapModal() {
  $("#mapModal").addClass("hidden");
  if (modalMapInstance) {
    modalMapInstance.remove();
    modalMapInstance = null;
  }
}

function initModalLeafletMap(item) {
  const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Panels" };
  const modalMapEl = document.getElementById("modalLeafletMap");
  if (!modalMapEl) return;

  if (modalMapInstance) {
    modalMapInstance.remove();
    modalMapInstance = null;
  }

  modalMapInstance = L.map("modalLeafletMap", { center: [loc.lat, loc.lng], zoom: 13, zoomControl: true });
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri",
    maxZoom: 18
  }).addTo(modalMapInstance);

  const isFactory = (loc.placeName || "").includes("โรงงาน");
  const modalIcon = L.divIcon({
    className: "!bg-transparent !border-0",
    html: `<div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
      <span class="w-10 h-10 rounded-full ${isFactory ? 'bg-indigo-500/40' : 'bg-emerald-500/40'} animate-ping absolute"></span>
      <div class="w-8 h-8 rounded-full ${isFactory ? 'bg-indigo-600' : 'bg-emerald-600'} text-white flex items-center justify-center shadow-xl border-2 border-white z-10">
        <i class="fa-solid ${isFactory ? 'fa-industry' : 'fa-tree'} text-xs"></i>
      </div>
      <div class="whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 border border-slate-700">
        ${item.moNo || item.orderNo}
      </div>
    </div>`,
    iconSize: [32, 44],
    iconAnchor: [16, 22],
    popupAnchor: [0, -22]
  });

  const marker = L.marker([loc.lat, loc.lng], { icon: modalIcon }).addTo(modalMapInstance);
  marker.bindPopup(`<strong>${loc.placeName}</strong><br>Plot: ${loc.plotId || '-'}<br>GPS: ${loc.lat}, ${loc.lng}`).openPopup();

  const moPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(item.moNo) : [];
  if (moPlots.length > 0) {
    const latlngs = [];
    moPlots.forEach((p, pIdx) => {
      if (p.vertices && p.vertices.length > 2) {
        const polyCoords = p.vertices.map(v => [v.lat, v.lng]);
        latlngs.push(...polyCoords);
        L.polygon(polyCoords, { color: pIdx === 0 ? "#10b981" : "#6366f1", weight: 2.5, fillOpacity: 0.25 })
          .addTo(modalMapInstance).bindPopup(`<strong>${p.name}</strong><br>MO: ${item.moNo}`);
      }
    });
    if (latlngs.length > 0) modalMapInstance.fitBounds(L.latLngBounds(latlngs), { padding: [25, 25] });
  }

  setTimeout(() => { if (modalMapInstance) modalMapInstance.invalidateSize(); }, 150);
  setTimeout(() => { if (modalMapInstance) modalMapInstance.invalidateSize(); }, 400);
}

// Export Excel หน้า Dashboard
function exportToExcel() {
  const dataToExport = dashboardFilteredData.length > 0 ? dashboardFilteredData : globalData;
  if (!dataToExport || dataToExport.length === 0) {
    showSwalWarning("No Data to Export", "There is no order data available to export to Excel.");
    return;
  }
  const excelRows = dataToExport.map((item, idx) => ({
    "ลำดับ (No)": idx + 1, "Order No": item.orderNo, "MO No": item.moNo || "-", Customer: item.customer,
    Destination: item.destination, "Shipping Line": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-", "ETD": item.step6?.etd || "-", "ETA": item.step6?.eta || "-",
    "Status": item.statusBadge || "-", "Product": item.productName || "Wood Pellets", "Quantity": item.orderQuantity || "-"
  }));
  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipment Orders");
  XLSX.writeFile(workbook, `WoodPellets_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Export to PDF หน้า Dashboard
function exportToPDF() {
  const dataToExport = dashboardFilteredData.length > 0 ? dashboardFilteredData : (typeof globalData !== "undefined" ? globalData : []);
  if (!dataToExport || dataToExport.length === 0) {
    showSwalWarning("No Data for PDF", "No table data available to generate PDF export.");
    return;
  }
  const rows = dataToExport.map((item, idx) => {
    const s = item.step6 || {}, badgeStyle = item.statusBadge === 'On Schedule' ? 'background:#d1fae5; color:#065f46;' : 'background:#fef3c7; color:#92400e;';
    return `<tr><td style="text-align:center; font-weight:bold; color:#475569;">${idx + 1}</td>
      <td style="font-weight:bold; color:#0f172a;">${item.orderNo}<br><span style="font-size:8.5px; color:#64748b;">${item.customer}</span></td>
      <td>${s.shippingLine || '-'}<br><span style="font-size:8.5px; color:#4338ca;">${item.destination}</span></td>
      <td style="color:#059669; font-weight:bold;">${s.etd || '-'}</td><td style="color:#475569;">${s.eta || '-'}</td>
      <td style="text-align:center;"><span style="display:inline-block; padding:2px 6px; border-radius:9999px; font-size:8.5px; font-weight:bold; ${badgeStyle}">${item.statusBadge || '-'}</span></td></tr>`;
  }).join("");

  const today = new Date().toLocaleDateString("th-TH");
  const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>WoodPellets_Shipment_Orders_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Leelawadee UI', 'Tahoma', 'Sarabun', 'Segoe UI', sans-serif; background: #fff; padding: 4px; color: #0f172a; font-size: 9.5px; }
    .header { border-bottom: 2px solid #312e81; padding-bottom: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-end; }
    .comp { font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
    .title { font-size: 14px; font-weight: 900; color: #0f172a; margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; font-size: 9px; vertical-align: middle; }
    th { background: #f1f5f9; font-weight: 700; color: #1e293b; text-align: left; }
    tr:nth-child(even) { background: #f8fafc; }
  </style></head><body>
  <div class="header"><div><div class="comp">Green River Panels (Thailand) Co., Ltd</div><div class="title">รายการจัดส่งและกำหนดการสำคัญ (Shipment Orders)</div></div>
    <div style="text-align:right; font-size:9px; color:#64748b;"><div>วันที่ออกรายงาน: ${today}</div><div>ระบบ BPM Operations Dashboard</div></div></div>
  <table><thead><tr><th style="width:35px; text-align:center;">ลำดับ</th><th>SA Number / ลูกค้า</th><th>สายเรือ / ท่าเรือปลายทาง</th><th style="width:85px;">ETD</th><th style="width:85px;">ETA</th><th style="width:100px; text-align:center;">สถานะ</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;

  printViaHiddenIframe(html, `WoodPellets_Shipment_Orders_${new Date().toISOString().slice(0, 10)}`);
}

function printViaHiddenIframe(htmlContent, title) {
  let iframe = document.getElementById("bpmPrintIframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "bpmPrintIframe";
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);
  }
  const d = iframe.contentWindow.document;
  d.open(); d.write(htmlContent); d.close();
  setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); }, 300);
}

// นำทางจากฟอร์ม BPM ไปยังหน้าแปลงที่ดินเพื่อแสดงทุกแปลงของ MO นั้นพร้อมกันบนแผนที่
function viewMoPlotsInCadastral(moNo) {
  closeBpmModal();
  if (typeof switchView === "function") switchView("cadastral");
  setTimeout(() => { if (typeof drawAllPlotsForMo === "function") drawAllPlotsForMo(moNo); }, 220);
}
