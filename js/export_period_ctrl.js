/**
 * Export Period Controller: Periodic Export (Monthly/Yearly), PDF Generation & Print Reports
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */

// เปิด/ปิด Dropdown เมนูส่งออกงวด (หน้า Order Query)
function toggleExportPeriodDropdown() {
  $("#exportPeriodDropdown").toggleClass("hidden");
}

// เปิด/ปิด Dropdown เมนูส่งออกงวด (หน้า Dashboard)
function toggleDashExportPeriodDropdown() {
  $("#dashExportPeriodDropdown").toggleClass("hidden");
}

// ปิด Dropdown เมื่อคลิกบริเวณอื่นนอกเมนู
$(document).on("click", function (e) {
  if (!$(e.target).closest("#btnExportPeriodMenu, #exportPeriodDropdown").length) {
    $("#exportPeriodDropdown").addClass("hidden");
  }
  if (!$(e.target).closest("#btnDashExportPeriodMenu, #dashExportPeriodDropdown").length) {
    $("#dashExportPeriodDropdown").addClass("hidden");
  }
});

// ฟังก์ชันส่งออก Excel แบ่งตามงวด: รายเดือน (Monthly) หรือ รายปี (Yearly)
function exportByPeriod(periodType) {
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();
  const selectedYear = yearFilter && yearFilter !== "ALL" ? yearFilter : "2026";

  const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
  };

  const dataset = typeof globalData !== "undefined" ? globalData : [];
  let periodData = [];
  let sheetName = "";
  let filename = "";

  if (periodType === "month") {
    const selectedMonth = monthFilter && monthFilter !== "ALL" ? monthFilter : "10";
    const monthName = monthNamesThai[selectedMonth] || selectedMonth;

    periodData = dataset.filter((item) => {
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
    // รายปี (Yearly)
    periodData = dataset.filter((item) => {
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

  // สร้างแถวข้อมูล Excel
  const excelRows = periodData.map((item, idx) => ({
    "ลำดับ (No)": idx + 1,
    "วันที่ออกคำสั่ง (Date)": item.orderDate || "2026-10-15",
    "Order No": item.orderNo,
    "MO No": item.moNo || "-",
    "PO No": item.poNo || "-",
    "ชื่อลูกค้า (Customer)": item.customer,
    "รหัสสินค้า (Product Code)": item.productCode || "-",
    "ปริมาณสั่งซื้อ (Quantity)": item.orderQuantity || "-",
    "ปลายทาง/ท่าเรือ (Destination)": item.destination,
    "สายการเดินเรือ (Shipping Line)": item.step6?.shippingLine || "-",
    "Booking No": item.step6?.bookingNo || "-",
    "ขั้นตอนปัจจุบัน (Step)": `Step ${item.currentStep || 1}`,
    "ความคืบหน้า (%)": (typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0) + "%",
    "ETD": item.step6?.etd || "-",
    "ETA": item.step6?.eta || "-",
    "สถานะ (Status)": item.statusBadge,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  if (periodType === "year") {
    // เพิ่ม Sheet สรุปราย 12 เดือนสำหรับรายงานรายปี
    const monthlySummary = {};
    for (let m = 1; m <= 12; m++) {
      const mStr = String(m).padStart(2, '0');
      monthlySummary[mStr] = {
        "เดือน (Month)": `${monthNamesThai[mStr]} (${mStr})`,
        "ยอดคำสั่งซื้อ (Orders)": 0,
        "ผลิตเสร็จสิ้น (Completed)": 0,
        "อยู่ระหว่างดำเนินงาน (In Progress)": 0,
      };
    }

    periodData.forEach((item) => {
      const d = item.orderDate || "2026-10-15";
      const m = d.substring(5, 7);
      if (monthlySummary[m]) {
        monthlySummary[m]["ยอดคำสั่งซื้อ (Orders)"] += 1;
        if (item.currentStep >= 7) {
          monthlySummary[m]["ผลิตเสร็จสิ้น (Completed)"] += 1;
        } else {
          monthlySummary[m]["อยู่ระหว่างดำเนินงาน (In Progress)"] += 1;
        }
      }
    });

    const summarySheet = XLSX.utils.json_to_sheet(Object.values(monthlySummary));
    XLSX.utils.book_append_sheet(workbook, summarySheet, `Monthly_Breakdown_${selectedYear}`);
  }

  XLSX.writeFile(workbook, filename);
}

// พิมพ์รายงานสรุปงวดแบบ Full List A4 แนวนอน
function printPeriodicReport(periodType) {
  const yearFilter = $("#queryYearFilter").val();
  const monthFilter = $("#queryMonthFilter").val();
  const selectedYear = yearFilter && yearFilter !== "ALL" ? yearFilter : "2026";

  const monthNamesThai = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
  };

  const dataset = typeof globalData !== "undefined" ? globalData : [];
  let periodData = [];
  let periodTitle = "";

  if (periodType === "month") {
    const selectedMonth = monthFilter && monthFilter !== "ALL" ? monthFilter : "10";
    const monthName = monthNamesThai[selectedMonth] || selectedMonth;
    periodData = dataset.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(`${selectedYear}-${selectedMonth}`);
    });
    periodTitle = `รายงานคำสั่งซื้อและการจัดส่ง ประจำเดือน ${monthName} ปี ${selectedYear} (${periodData.length} รายการ)`;
  } else {
    periodData = dataset.filter((item) => {
      const d = item.orderDate || item.requestedDeliveryDate || "2026-10-15";
      return d.startsWith(selectedYear);
    });
    periodTitle = `รายงานสรุปยอดคำสั่งซื้อและการผลิต ประจำปี ${selectedYear} (${periodData.length} รายการ)`;
  }

  if (periodData.length === 0) {
    showSwalWarning("No Data Found", "No data available to generate printable report for the selected period.");
    return;
  }

  openPrintLandscapeWindow(periodTitle, periodData);
}

// ส่งออก PDF จากหน้า Order Query (ดาวน์โหลดไฟล์ .pdf โดยตรง)
function exportQueryToPDF() {
  const dataToExport = typeof filteredQueryData !== "undefined" && filteredQueryData.length > 0 
    ? filteredQueryData 
    : (typeof globalData !== "undefined" ? globalData : []);

  if (!dataToExport || dataToExport.length === 0) {
    showSwalWarning("No Data for PDF", "No table data available to export as PDF.");
    return;
  }

  const keyword = ($("#querySearchInput").val() || "").trim();
  const stepVal = $("#queryStepFilter").val();
  const title = `รายงานการสืบค้นคำสั่งซื้อ Wood Pellets ${keyword ? `(คำค้น: ${keyword})` : ''} ${stepVal && stepVal !== 'ALL' ? `(Step ${stepVal})` : ''} (${dataToExport.length} รายการ)`;

  openPrintLandscapeWindow(title, dataToExport);
}

function printQueryReport() {
  exportQueryToPDF();
}

// ฟังก์ชันสร้างและพิมพ์/ส่งออกเอกสาร PDF แนวนอน (A4 Landscape) — ภาษาไทยคมชัด 100% สระไม่ลอย
function openPrintLandscapeWindow(title, items) {
  const rowsHtml = items.map((item, idx) => {
    const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 0;
    const ship = item.step6 || {};
    return `
      <tr>
        <td style="padding: 5px; text-align: center; font-weight: bold; color: #475569;">${idx + 1}</td>
        <td style="padding: 5px; font-weight: bold; color: #0f172a;">${item.orderNo}<br><span style="font-size: 8.5px; color: #64748b;">${item.customer}</span></td>
        <td style="padding: 5px; font-family: monospace; color: #334155;">${item.moNo || '-'}<br><span style="color:#6366f1;">${item.poNo || '-'}</span></td>
        <td style="padding: 5px; color: #1e293b;">${item.orderQuantity || '-'}<br><span style="font-size: 8.5px; color: #64748b;">${item.productCode || '-'}</span></td>
        <td style="padding: 5px; color: #334155;">${item.destination}<br><span style="font-size: 8.5px; color: #64748b;">${ship.shippingLine || '-'}</span></td>
        <td style="padding: 5px; text-align: center;"><span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8.5px; font-weight: bold; background: #e0e7ff; color: #3730a3;">Step ${item.currentStep || 1} (${progress}%)</span></td>
        <td style="padding: 5px; color: #059669; font-weight: bold;">${ship.etd || '-'}</td>
        <td style="padding: 5px; color: #475569;">${ship.eta || '-'}</td>
        <td style="padding: 5px; text-align: center;"><span style="display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 8.5px; font-weight: bold; ${item.statusBadge === 'On Schedule' ? 'background:#d1fae5; color:#065f46;' : 'background:#fef3c7; color:#92400e;'}">${item.statusBadge || '-'}</span></td>
      </tr>
    `;
  }).join("");

  const today = new Date().toLocaleDateString("th-TH");
  const fullHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Leelawadee UI', 'Tahoma', 'Sarabun', 'Segoe UI', sans-serif; background: #fff; padding: 4px; color: #0f172a; font-size: 9.5px; }
    .header { border-bottom: 2px solid #312e81; padding-bottom: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-end; }
    .comp { font-size: 11px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
    .title { font-size: 14px; font-weight: 900; color: #0f172a; margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 6px; font-size: 8.5px; vertical-align: middle; }
    th { background: #f1f5f9; font-weight: 700; color: #1e293b; text-align: left; }
    tr:nth-child(even) { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="comp">Green River Panels (Thailand) Co., Ltd</div>
      <div class="title">${title}</div>
    </div>
    <div style="text-align: right; font-size: 9px; color: #64748b;">
      <div>วันที่ออกรายงาน: ${today}</div>
      <div>ระบบ BPM Operations Dashboard</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">#</th>
        <th style="width: 140px;">Order No / ลูกค้า</th>
        <th style="width: 110px;">MO / PO No</th>
        <th style="width: 85px;">ปริมาณ</th>
        <th>ปลายทาง / สายเรือ</th>
        <th style="width: 90px; text-align: center;">Step / %</th>
        <th style="width: 75px;">ETD</th>
        <th style="width: 75px;">ETA</th>
        <th style="width: 85px; text-align: center;">สถานะ</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`;

  // ส่งข้อมูลเข้า Hidden Iframe สำหรับสั่งพิมพ์/บันทึก PDF ทันทีด้วย Native Vector Print (ภาษาไทย 100% ไม่เพี้ยน)
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

  const doc = printIframe.contentWindow.document;
  doc.open();
  doc.write(fullHtml);
  doc.close();
  setTimeout(() => {
    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();
  }, 300);
}
