/**
 * Cadastral Upload & Filter Controller: File Uploads, De-duplication, MO Linkage & 3 Real-time Filters
 * File size target: < 400 lines (Strictly verified)
 */

let pendingUploadFile = null;

// สแกนหารหัส MO จากข้อความ
function detectMoFromText(text) {
  if (!text) return null;
  const match = text.match(/MO-\d{6}-\d{2,4}/i) || text.match(/MO-\d+/i);
  return match ? match[0].toUpperCase() : null;
}

// อัปเดตการผูกคำสั่งซื้อ MO ให้แปลงปัจจุบัน
function updatePlotLinkedMo(moNo) {
  const plot = (window.cadastralPlots || []).find(p => p.id === window.activeCadastralPlotId);
  if (!plot) return;

  plot.linkedMoNo = moNo ? moNo.trim() : null;
  if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();
  renderCadastralView();

  if (moNo) {
    showSwalSuccess("Plot Linked", `Successfully linked parcel "${plot.name}" to Manufacturing Order ${moNo}.`);
  } else {
    showSwalAlert("Plot Unlinked", `Unlinked Manufacturing Order from parcel "${plot.name}".`, "info");
  }
}

function viewOrderInDashboard(moNo) {
  if (!moNo) return;
  currentSelectedOrderNo = moNo;
  switchView("dashboard");
}

function isPlotDuplicate(newPlot, existingPlot) {
  if (!newPlot || !existingPlot) return false;
  if (newPlot.name && existingPlot.name) {
    if (newPlot.name.trim().toLowerCase() === existingPlot.name.trim().toLowerCase()) {
      return true;
    }
  }
  if (newPlot.centroid && existingPlot.centroid) {
    const latDiff = Math.abs(newPlot.centroid[0] - existingPlot.centroid[0]);
    const lngDiff = Math.abs(newPlot.centroid[1] - existingPlot.centroid[1]);
    if (latDiff < 0.00015 && lngDiff < 0.00015) {
      return true;
    }
  }
  return false;
}

function cleanDuplicateCadastralPlots() {
  if (!window.cadastralPlots || window.cadastralPlots.length <= 1) {
    showSwalAlert("Duplicate Check", "No duplicate plots found in the system.", "info");
    return;
  }
  const initialCount = window.cadastralPlots.length;
  const uniquePlots = [];
  window.cadastralPlots.forEach(plot => {
    const isDup = uniquePlots.some(u => isPlotDuplicate(plot, u));
    if (!isDup) uniquePlots.push(plot);
  });
  const removedCount = initialCount - uniquePlots.length;
  if (removedCount > 0) {
    window.cadastralPlots = uniquePlots;
    if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();
    if (!window.cadastralPlots.some(p => p.id === window.activeCadastralPlotId)) {
      window.activeCadastralPlotId = window.cadastralPlots[0].id;
    }
    renderCadastralView();
    showSwalSuccess("Duplicate Check Completed", `Scan finished: Cleaned ${removedCount} duplicate plot(s). Total unique plots: ${uniquePlots.length}`);
  } else {
    showSwalSuccess("Duplicate Check Passed", "No duplicate plots found. All active parcels have unique boundaries and names (100% Verified).");
  }
}

function loadDemoCadastralPlots() {
  if (typeof resetCadastralPlotsStorage === "function") resetCadastralPlotsStorage();
  window.cadastralPlots = [];
  ensureCadastralPlotsInitialized();
  renderCadastralView();
  showSwalSuccess("Demo Plots Loaded", "Loaded 4 preloaded EUDR rubberwood plantation plots (including multi-plot MO example) successfully!");
}

function copyActivePlotCoordinates() {
  const plot = (window.cadastralPlots || []).find(p => p.id === window.activeCadastralPlotId);
  if (!plot || !plot.vertices) {
    showSwalWarning("No Plot Selected", "Unable to find vertex coordinates for the selected parcel.");
    return;
  }
  let coordText = `=== Parcel Boundary Coordinates: ${plot.name} ===\n`;
  if (plot.linkedMoNo) coordText += `Linked Manufacturing Order (MO No.): ${plot.linkedMoNo}\n`;
  coordText += `Calculated Area: ${plot.thaiArea.rai} Rai ${plot.thaiArea.ngan} Ngan ${plot.thaiArea.sqWah} Sq.Wah (${plot.thaiArea.sqMeters} sq.m)\n\n`;
  coordText += `No.\tLatitude\tLongitude\n`;
  plot.vertices.forEach(v => {
    coordText += `${v.no}\t${v.lat.toFixed(6)}\t${v.lng.toFixed(6)}\n`;
  });

  navigator.clipboard.writeText(coordText).then(() => {
    showSwalSuccess("Coordinates Copied", "All corner coordinates have been copied to clipboard in table format for Excel / EUDR due diligence documentation.");
  }).catch(() => {
    prompt("Copy coordinates manually:", coordText);
  });
}

// Modal อัปโหลด KML/GeoJSON
function openCadastralImportModal() {
  pendingUploadFile = null;
  $("#modalFileNameDisplay").text("คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่");
  $("#modalCadastralFileInput").val("");

  const $select = $("#modalTargetMoNo");
  $select.empty();
  $select.append(`<option value="AUTO">🔍 ตรวจจับอัตโนมัติจากชื่อไฟล์ / ชื่อแปลง (Auto-Detect)</option>`);
  $select.append(`<option value="NONE">-- แปลงทั่วไป (ยังไม่ผูกกับ MO) --</option>`);

  if (typeof globalData !== "undefined" && Array.isArray(globalData)) {
    globalData.forEach(item => {
      $select.append(`<option value="${item.moNo}">${item.moNo} — ${item.customerName || item.customer || 'Customer'} (${item.location?.placeName || ''})</option>`);
    });
  }

  $("#cadastralImportModal").removeClass("hidden");
}

function closeCadastralImportModal() {
  $("#cadastralImportModal").addClass("hidden");
  pendingUploadFile = null;
}

function onModalFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  pendingUploadFile = file;
  $("#modalFileNameDisplay").html(`
    <span class="text-emerald-700 font-bold text-sm block">📄 ${file.name}</span>
    <span class="text-[10px] text-slate-500 mt-1 inline-block bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md font-medium">
      ขนาดไฟล์: ${(file.size / 1024).toFixed(1)} KB (พร้อมนำเข้า)
    </span>
  `);

  const autoMo = detectMoFromText(file.name);
  if (autoMo) {
    const $select = $("#modalTargetMoNo");
    if ($select.find(`option[value='${autoMo}']`).length > 0) {
      $select.val(autoMo);
    }
  }

  $("#btnConfirmModalImport")
    .addClass("ring-4 ring-emerald-400/50 scale-105")
    .html(`<i class="fa-solid fa-cloud-arrow-up mr-1.5 animate-bounce"></i> เริ่มนำเข้า "${file.name}" ทันที`);
}

function submitCadastralImportModal() {
  if (!pendingUploadFile) {
    showSwalWarning("File Required", "Please select a .KML or .GeoJSON file before proceeding.");
    return;
  }
  const selectedMoOption = $("#modalTargetMoNo").val();
  const shouldCheckDuplicate = $("#modalCheckDuplicate").is(":checked");
  closeCadastralImportModal();
  processUploadedCadastralFile(pendingUploadFile, "cadastral", selectedMoOption, shouldCheckDuplicate);
}

// อัปโหลดไฟล์โดยตรง 1 คลิก (เชื่อมต่อ MO ทันที)
function handleDirectCadastralFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const selectedMo = $("#cadastralUploadTargetMo").val() || "AUTO";
  processUploadedCadastralFile(file, "cadastral", selectedMo, true);
  event.target.value = "";
}

function handleKmlGeoJsonPointFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  processUploadedCadastralFile(file, "point", "AUTO", true);
  event.target.value = "";
}

function triggerKmlGeoJsonUploadFromPointMap() {
  openCadastralImportModal();
}

// ประมวลผลไฟล์ที่นำเข้า
function processUploadedCadastralFile(file, sourceView, targetMoChoice, checkDuplicate) {
  if (!file) {
    showSwalError("File Not Found", "No file selected. Please try again.");
    return;
  }
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "kmz") {
    showSwalWarning("KMZ Format Detected", `File "${file.name}" is a .KMZ file (zipped Google Earth package).\n\nTo import into EUDR Cadastral View:\n1. In Google Earth, right-click the parcel -> "Save Place As..." and select ".KML" format.\n2. Or rename file to .zip, extract it, and upload the "doc.kml" file inside.`);
    return;
  }

  if (ext !== "kml" && ext !== "geojson" && ext !== "json") {
    showSwalWarning("Unsupported File Type", `The system supports .kml, .geojson, or .json files only.\n(Selected file extension: .${ext})`);
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    let newPlots = [];

    if (ext === "kml") {
      newPlots = parseKmlFileText(content, file.name);
    } else if (ext === "geojson" || ext === "json") {
      newPlots = parseGeoJsonFileText(content, file.name);
    }

    if (newPlots && newPlots.length > 0) {
      window.cadastralPlots = window.cadastralPlots || [];

      const autoFileMo = detectMoFromText(file.name);
      newPlots.forEach(p => {
        if (targetMoChoice && targetMoChoice !== "AUTO" && targetMoChoice !== "NONE") {
          p.linkedMoNo = targetMoChoice;
        } else if (targetMoChoice === "NONE") {
          p.linkedMoNo = null;
        } else {
          p.linkedMoNo = p.linkedMoNo || detectMoFromText(p.name) || autoFileMo || null;
        }
      });

      let updatedCount = 0;
      let insertedCount = 0;

      if (checkDuplicate !== false) {
        newPlots.forEach(newP => {
          const dupIndex = window.cadastralPlots.findIndex(existingP => isPlotDuplicate(newP, existingP));
          if (dupIndex !== -1) {
            newP.id = window.cadastralPlots[dupIndex].id;
            if (!newP.linkedMoNo && window.cadastralPlots[dupIndex].linkedMoNo) {
              newP.linkedMoNo = window.cadastralPlots[dupIndex].linkedMoNo;
            }
            window.cadastralPlots[dupIndex] = newP;
            updatedCount++;
          } else {
            window.cadastralPlots.unshift(newP);
            insertedCount++;
          }
        });
      } else {
        window.cadastralPlots = [...newPlots, ...window.cadastralPlots];
        insertedCount = newPlots.length;
      }

      window.activeCadastralPlotId = newPlots[0].id;
      if (typeof saveCadastralPlotsToStorage === "function") saveCadastralPlotsToStorage();

      let msg = `Parcel boundaries imported successfully from "${file.name}"!\n\n`;
      if (insertedCount > 0) msg += `• New Parcels Added: ${insertedCount}\n`;
      if (updatedCount > 0) msg += `• Existing Parcels Updated: ${updatedCount}\n`;
      msg += `• Active Parcel: "${newPlots[0].name}"\n`;
      msg += `• Calculated Area: ${newPlots[0].thaiArea.rai} Rai ${newPlots[0].thaiArea.ngan} Ngan (${newPlots[0].thaiArea.sqMeters} sq.m)\n`;
      msg += `• Boundary Corners: ${newPlots[0].vertices ? newPlots[0].vertices.length : 0} vertices (EUDR Ready)\n`;
      if (newPlots[0].linkedMoNo) {
        msg += `• Linked Manufacturing Order: ${newPlots[0].linkedMoNo}\n`;
      } else {
        msg += `• Order Linkage: General Parcel (can be linked via side panel)\n`;
      }

      showSwalSuccess("Import Successful", msg);

      if (sourceView === "point") {
        renderMapOverview();
      } else {
        renderCadastralView();
        setTimeout(() => {
          if (window.cadastralMapInstance) {
            window.cadastralMapInstance.invalidateSize();
            fitCadastralBounds();
          }
        }, 150);
      }
    } else {
      showSwalWarning("No Parcel Geometry Found", `No valid parcel boundaries found in "${file.name}".\n\nPossible reasons:\n1. File does not contain Polygon or LineString geometry.\n2. File contains single placemark points without closed boundary lines.`);
    }
  };

  reader.onerror = function () {
    showSwalError("File Read Error", `Failed to read file "${file.name}" from your local device.`);
  };

  reader.readAsText(file);
}

// Drag & Drop บนแผนที่ Cadastral
function setupCadastralDragAndDrop() {
  const mapContainer = document.getElementById("cadastralLeafletMap");
  const overlay = document.getElementById("cadastralDropZoneOverlay");
  if (!mapContainer || !overlay) return;

  ["dragenter", "dragover"].forEach(eventName => {
    mapContainer.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.remove("hidden");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    mapContainer.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.add("hidden");
    });
  });

  mapContainer.addEventListener("drop", e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      const selectedMo = $("#cadastralUploadTargetMo").val() || "AUTO";
      processUploadedCadastralFile(files[0], "cadastral", selectedMo, true);
    }
  });
}

// =========================================================================
// ข้อ 3: ระบบกรองตัวเลือกแบบ Real-time (Filter Functions ทั้ง 3 จุด)
// =========================================================================

// จุดที่ 1: กรองตัวเลือกใน Dropdown "ผูก MO ทันที:" บน Toolbar
function filterUploadMoSelect(keyword) {
  keyword = (keyword || "").trim().toLowerCase();
  const $select = $("#cadastralUploadTargetMo");
  $select.find("option").each(function () {
    const val = $(this).val();
    const text = $(this).text().toLowerCase();
    if (val === "AUTO" || val === "NONE") {
      $(this).show();
    } else {
      if (text.includes(keyword) || val.toLowerCase().includes(keyword)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  });
}

// จุดที่ 2: กรองตัวเลือกใน Dropdown "เลือกแปลง:"
function filterCadastralPlotSelect(keyword) {
  keyword = (keyword || "").trim().toLowerCase();
  const $select = $("#cadastralPlotSelect");
  $select.find("option").each(function () {
    const text = $(this).text().toLowerCase();
    if (text.includes(keyword)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

// จุดที่ 3: กรองตัวเลือกใน Dropdown "คำสั่งซื้อที่ผูกไว้ (Linked MO No.):" ใต้แผนที่
function filterActivePlotMoSelect(keyword) {
  keyword = (keyword || "").trim().toLowerCase();
  const $select = $("#activePlotMoSelect");
  $select.find("option").each(function () {
    const val = $(this).val();
    const text = $(this).text().toLowerCase();
    if (!val) {
      $(this).show();
    } else {
      if (text.includes(keyword) || val.toLowerCase().includes(keyword)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  });
}
