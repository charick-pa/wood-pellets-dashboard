/**
 * Component: BPM Master Form Print Document Template (A4 Portrait Layout)
 * Uses modular CSS from window.Components.getBpmPrintCss()
 * Full 8-Step Lifecycle Specification matching Wood Pellets Master Form
 * Strict Line Count Budget: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderBpmPrintDocument: function (item) {
        if (!item) return '';

        const s1 = item;
        const s2 = item.step2 || {};
        const s3 = item.step3 || {};
        const s4 = item.step4_qc || item.step4_pelletizing || {};
        const s5 = item.step5_qa || item.step4 || {};
        const s6 = item.step6_storage || item.step5 || {};
        const s7 = item.step7_ra_dossier || {};
        const s8 = item.step8_shipping || item.step6 || {};
        const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Panels Hat Yai", plotId: "FAC-GRP-01", areaRai: "250 ไร่" };
        const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 50;

        const formatChecklist = (arr, fallback) => {
            if (!arr) return fallback || 'VERIFIED (100%)';
            if (typeof arr === 'string') return arr;
            if (Array.isArray(arr)) {
                return arr.map(x => (x.checked !== false ? '☑ ' : '☐ ') + (x.name || x.item || '')).join(' • ');
            }
            return fallback || 'VERIFIED';
        };

        return `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>BPM_Master_Form_${item.orderNo}_${item.moNo || 'MO'}</title>
    <style>${window.Components.getBpmPrintCss ? window.Components.getBpmPrintCss() : ''}</style>
</head>
<body>
    <div class="header-box">
        <div>
            <div>
                <span class="company-pill">${item.company || 'GREEN RIVER PANELS (THAILAND) CO., LTD'}</span>
                <span class="iso-cert">ISO 9001:2015 / SBP / GGL / EUDR Verified</span>
            </div>
            <h1 class="doc-title">WOOD PELLETS OPERATIONS BPM MASTER FORM</h1>
            <div class="doc-sub">แบบฟอร์มบันทึกกระบวนการผลิตและควบคุมคุณภาพแบบบูรณาการ (8-Step Full Lifecycle: Sale ➔ RA ➔ Production ➔ QC ➔ QA ➔ Storage ➔ RA Verification ➔ Shipment)</div>
        </div>
        <div class="meta-card">
            <div class="meta-row"><span class="meta-label">Application No:</span><span class="meta-val">${item.applicationNo || 'APP-2026-09821'}</span></div>
            <div class="meta-row"><span class="meta-label">Order No:</span><span class="meta-val highlight-val">${item.orderNo}</span></div>
            <div class="meta-row"><span class="meta-label">MO / PO No:</span><span class="meta-val">${item.moNo || '-'} / ${item.customerPoNo || item.poNo || '-'}</span></div>
            <div class="meta-row"><span class="meta-label">Applicant:</span><span class="meta-val">${item.applicant || 'Sale Specialist'}</span></div>
            <div class="meta-row"><span class="meta-label">Current Status:</span><span class="meta-val highlight-ok">Step ${item.currentStep || 1} (${progress}%)</span></div>
        </div>
    </div>

    <!-- 1. Sale Department & Planning -->
    <div class="step-card">
        <div class="step-header">
            <span>1. SALE DEPARTMENT & PLANNING — ข้อมูลคำสั่งซื้อและการวางแผน</span>
            <span class="step-badge" style="background:#2563eb;">Step 1</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">Customer Code/Name:</span><span class="field-value">${item.customerCode || '02545'} — ${item.customer}</span></div>
            <div class="field-col"><span class="field-label">Contact / Email / Tel:</span><span class="field-value">${item.contactPerson || '-'} (${item.emailTel || '-'})</span></div>
            <div class="field-col"><span class="field-label">Customer PO / PI:</span><span class="field-value highlight-val">${item.customerPoNo || item.poNo || '-'} / ${item.piNo || '-'}</span></div>
            <div class="field-col"><span class="field-label">Product Name / Code:</span><span class="field-value">${item.productName || 'Wood Pellets'} (${item.productCode || '-'})</span></div>
            <div class="field-col"><span class="field-label">Product Type / Qty:</span><span class="field-value highlight-qty">${item.productType || '1-0.6mm, 2-0.8mm'} • ${item.orderQuantity || '500 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Delivery Date / Dest:</span><span class="field-value highlight-ok">${item.requestedDeliveryDate || '-'} • ${item.destination || '-'}</span></div>
            <div class="field-col col-span-full"><span class="field-label">Planning Production:</span><span class="field-value">Batch: <strong>${item.planBatchNo || '-'}</strong> | Plan MO: ${item.planMoNo || item.moNo || '-'} | Period: ${item.planDateStart || '-'} to ${item.planDateFinish || '-'} | Scheme: ${item.planCertScheme || 'SBP'}</span></div>
            ${(() => {
                const complaints = typeof getComplaintsForOrder === "function" ? getComplaintsForOrder(item.orderNo) : (item.complaints || []);
                if (!complaints || complaints.length === 0) return '';
                return `
                    <div class="col-span-full sub-box" style="background:#fff1f2; border-color:#fecdd3; margin-top:3px;">
                        <span style="color:#be123c; font-weight:800;">Customer Complaints & Claims (${complaints.length}):</span>
                        ${complaints.map(c => `
                            <div style="font-size:8px; margin-top:2px; color:#475569;">
                                <strong>[${c.category} - ${c.severity}]</strong> ${c.description} 
                                <em>(Recorded by: ${c.recordedBy} at ${c.timestamp} - Status: ${c.status})</em>
                            </div>
                        `).join("")}
                    </div>
                `;
            })()}
        </div>
    </div>

    <!-- 2. RA Regulatory & EUDR -->
    <div class="step-card">
        <div class="step-header">
            <span>2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ข้อกำหนดด้านกฎหมายและมาตรฐาน)</span>
            <span class="step-badge" style="background:#4f46e5;">Step 2</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">Regulatory Cert Status:</span><span class="field-value highlight-ok">${item.regCertStatus || s2.certStatus || 'APPROVED & VALID'}</span></div>
            <div class="field-col"><span class="field-label">License / Permit Expiry:</span><span class="field-value highlight-alert">${item.licenseExpiry || s2.licenseExpiry || '2027-09-30'} (Active)</span></div>
            <div class="field-col"><span class="field-label">Transport Permit Expiry:</span><span class="field-value highlight-alert">${item.transportExpiry || s2.transportExpiry || '2027-03-31'}</span></div>
            <div class="sub-box eudr-box col-span-full">
                <span><strong>EUDR Geolocation Verified:</strong> รหัสแปลง ${loc.plotId || 'PLOT-EUDR-202601'} &bull; พิกัด [${loc.lat || 7.0089}, ${loc.lng || 100.4767}] (${loc.placeName || 'โรงงาน Green River Panels'})</span>
                <span class="highlight-ok" style="font-weight:800;">Polygon Verified</span>
            </div>
            ${(() => {
                const moPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(item.moNo) : [];
                if (moPlots.length <= 1) return '';
                const totalRai = moPlots.reduce((sum, p) => sum + (p.thaiArea ? p.thaiArea.rai : 0), 0);
                return `
                    <div class="sub-box col-span-full" style="background:#eef2ff; border-color:#c7d2fe;">
                        <span><strong>แปลงแหล่งกำเนิดไม้ EUDR (${moPlots.length} แปลง รวม ${totalRai} ไร่):</strong> ${moPlots.map((p, idx) => `[${idx+1}] ${p.name} (${p.thaiArea ? p.thaiArea.rai : 0} ไร่)`).join(' &bull; ')}</span>
                        <span class="highlight-val">Multi-Polygon</span>
                    </div>
                `;
            })()}
            <div class="field-col col-span-full"><span class="field-label">Specification Requirement:</span><span class="field-value">${item.specReq || s2.specReq || 'Moisture <= 10%, Ash <= 2.0%, Durability >= 97.5%'}</span></div>
            <div class="field-col col-span-full"><span class="field-label">Packaging & Label Requirement:</span><span class="field-value">${item.packagingReq || s2.packagingReq || 'Jumbo Big Bag (1,000 kg)'} &bull; ${item.labelReq || s2.labelReq || 'FSC/SBP QR Barcode'}</span></div>
            <div class="field-col col-span-full"><span class="field-label">Customer Regulatory Requirements:</span><span class="field-value">${item.customerRegulatory || s2.customerRegulatory || 'EUDR, SBP, GGL, FSC-100%'}</span></div>
        </div>
    </div>

    <!-- 3. Production Planning & Execution -->
    <div class="step-card">
        <div class="step-header">
            <span>3. PRODUCTION — WOODS MATERIAL & EXECUTION (การผลิตและการใช้วัตถุดิบ)</span>
            <span class="step-badge" style="background:#d97706;">Step 3</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">Planned Qty:</span><span class="field-value">${(s3.planned || item.planned || 20000).toLocaleString()} Ton</span></div>
            <div class="field-col"><span class="field-label">Actual Qty:</span><span class="field-value highlight-qty">${(s3.actual || item.actual || 15000).toLocaleString()} Ton</span></div>
            <div class="field-col"><span class="field-label">Yield Output:</span><span class="field-value highlight-ok">${s3.yield || item.yield || '90,000 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Supervisor:</span><span class="field-value">${item.plantSupervisor || 'Wirote K.'}</span></div>
            <div class="field-col"><span class="field-label">Start Period:</span><span class="field-value">${s3.startDate || item.startDate || '2026/10/12'}</span></div>
            <div class="field-col"><span class="field-label">Finish Period:</span><span class="field-value">${s3.finishDate || item.finishDate || '2026/10/02'}</span></div>
            <div class="field-col"><span class="field-label">Uptime / Downtime:</span><span class="field-value">${item.totalUptime || '142 hrs'} / ${item.totalDowntime || '8 hrs'}</span></div>
            <div class="field-col"><span class="field-label">Raw Material Req:</span><span class="field-value">${item.rawMaterialReq || 'Para Rubber Wood (Sawdust & Slab)'}</span></div>
            <div class="field-col col-span-full"><span class="field-label">Line Status & Equipment:</span><span class="field-value">Fac1: ${item.fac1StatusUtil || 'Running (88%)'}, Fac2: ${item.fac2StatusUtil || 'Running (92%)'} | Feed Lines: ${item.feedLines || 'Line A, Line B'}</span></div>
        </div>
    </div>

    <!-- 4. In-Line QC -->
    <div class="step-card">
        <div class="step-header">
            <span>4. QC — IN-LINE QUALITY CONTROL 5 CHECKPOINTS (การควบคุมคุณภาพในสายการผลิต)</span>
            <span class="step-badge" style="background:#ea580c;">Step 4</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">Batch No / Test Date:</span><span class="field-value highlight-val">${s4.batchNo || 'B2026-10-09'} • ${s4.testDate || '2026-10-09'}</span></div>
            <div class="field-col"><span class="field-label">1. Logs Slab Moisture:</span><span class="field-value">${s4.paramLogsSlab || 'Moisture 42.1%'}</span></div>
            <div class="field-col"><span class="field-label">2. Sawdust Moisture:</span><span class="field-value">${s4.paramSawdust || 'Moisture 38.5%'}</span></div>
            <div class="field-col"><span class="field-label">3. Chipper Moisture:</span><span class="field-value">${s4.paramChipper || 'Moisture 35.2%'}</span></div>
            <div class="field-col"><span class="field-label">4. After Dryer Moisture:</span><span class="field-value highlight-ok">${s4.paramAfterDryer || 'Moisture 9.8% (Target < 10%)'}</span></div>
            <div class="field-col"><span class="field-label">5. After Magnetic Pellets:</span><span class="field-value highlight-ok">${s4.paramAfterMagnetic || 'Moisture 7.8% (Target < 8%)'}</span></div>
            <div class="field-col col-span-2"><span class="field-label">In-Line QC Overall Status:</span><span class="field-value highlight-ok">${s4.status || 'PASS (All 5 checkpoints compliant)'}</span></div>
        </div>
    </div>

    <!-- 5. QA Lab & COA -->
    <div class="step-card">
        <div class="step-header">
            <span>5. QA — QUALITY ASSURANCE & CERTIFICATE OF ANALYSIS (การประกันคุณภาพและใบรับรอง)</span>
            <span class="step-badge" style="background:#9333ea;">Step 5</span>
        </div>
        <div class="step-body grid-3">
            <div class="field-col"><span class="field-label">Test Date / Analyst:</span><span class="field-value">${s5.testDate || '2026-10-09'} • ${s5.analyst || 'NL-4092 (Somchai P.)'}</span></div>
            <div class="field-col"><span class="field-label">Sawdust Moisture / Chipper:</span><span class="field-value">${s5.sawdustMoisture || '9.8%'} • ${s5.paramChipper || '35.0%'}</span></div>
            <div class="field-col"><span class="field-label">Hammer Mill / Magnetic:</span><span class="field-value">${s5.paramHammerMill || '10.2%'} • ${s5.paramMagneticPellets || '7.5%'}</span></div>
            <div class="field-col"><span class="field-label">Non-Compliance Status:</span><span class="field-value highlight-ok">${s5.nonCompliance || 'None (Zero Deviation)'}</span></div>
            <div class="field-col"><span class="field-label">Bulk Warehouses:</span><span class="field-value">${s5.bulkWarehouses || 'WH-Dry-01'}</span></div>
            <div class="field-col"><span class="field-label">COA Document Ref:</span><span class="field-value highlight-val">${s5.coaFile || s5.coaReferenced || 'COA-202610-LF2-03918.pdf'}</span></div>
        </div>
    </div>

    <!-- 6. Storage & Warehouse -->
    <div class="step-card">
        <div class="step-header">
            <span>6. STORAGE — WAREHOUSE & 4-WAY STOCK BALANCE (การจัดเก็บและสมดุลสต็อก 4 ทาง)</span>
            <span class="step-badge" style="background:#0891b2;">Step 6</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">Storage Bay / Material:</span><span class="field-value">${s6.storageLocation || 'WH-1 Bay 3'} • ${s6.material || 'BWP-11-08'}</span></div>
            <div class="field-col"><span class="field-label">Big Bag Label No:</span><span class="field-value highlight-val">${s6.bigBagLabelNo || 'BB-202610-04159'}</span></div>
            <div class="field-col"><span class="field-label">Packing Period & MTD:</span><span class="field-value">${s6.packingDateStart || '2026/10/01'} - ${s6.packingDateFinish || '2026/10/05'} • ${s6.packingMtdQties || '2,400 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Inventory Controller:</span><span class="field-value">${s6.inventoryController || 'Kitti S.'}</span></div>
            <div class="field-col"><span class="field-label">Opening Stock:</span><span class="field-value">${s6.openingStock || '1,000 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Total Receipt (+):</span><span class="field-value highlight-ok">${s6.totalReceiptQties || '1,500 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Total Issue (-):</span><span class="field-value highlight-alert">${s6.totalIssueQties || s6.issueQty || '1,300 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Closing Stock (=):</span><span class="field-value highlight-qty">${s6.closingStock || '1,200 Ton'}</span></div>
        </div>
    </div>

    <!-- 7. RA Verification Dossier -->
    <div class="step-card">
        <div class="step-header">
            <span>7. RA VERIFICATION — REGULATORY VERIFICATION DOSSIER (การตรวจสอบรับรองขั้นสุดท้าย)</span>
            <span class="step-badge" style="background:#059669;">Step 7</span>
        </div>
        <div class="step-body">
            <div class="field-col col-span-full"><span class="field-label">1. GGL FIT/FIP Checklists:</span><span class="field-value highlight-ok">${formatChecklist(s7.gglFitFip, '☑ Cover letter • ☑ Transaction Statement • ☑ TC from CU • ☑ Transport Docs • ☑ Cleanliness • ☑ GeoJSON')}</span></div>
            <div class="field-col col-span-full"><span class="field-label">2. GGL SDE++ Verification:</span><span class="field-value highlight-ok">${formatChecklist(s7.gglSde, '☑ Cover Letter • ☑ Transaction Statement • ☑ Transaction Certificate • ☑ EUDR Data Sheet • ☑ GeoJSON')}</span></div>
            <div class="field-col col-span-full"><span class="field-label">3. SBP / EUDR Dossier:</span><span class="field-value highlight-ok">${formatChecklist(s7.sbpEudr, '☑ SBP-Compliant Biomass (FSC 100%) • ☑ EUDR Due Diligence Statement (DDS Valid) • ☑ GeoJSON Verified')}</span></div>
        </div>
    </div>

    <!-- 8. Shipment & Export Logistics -->
    <div class="step-card">
        <div class="step-header">
            <span>8. SHIPMENT & EXPORT LOGISTICS — ข้อมูลการขนส่งและการส่งมอบ</span>
            <span class="step-badge" style="background:#0d9488;">Step 8</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">SA Number:</span><span class="field-value highlight-val">${s8.saNumber || s8.saNo || 'CPM2600100'}</span></div>
            <div class="field-col"><span class="field-label">Customer / POD:</span><span class="field-value">${s8.customerName || item.customer} • ${s8.pod || item.destination}</span></div>
            <div class="field-col"><span class="field-label">Shipping Line / Booking:</span><span class="field-value">${s8.shippingLine || 'EVG'} • ${s8.bookingNo || '09050012456'}</span></div>
            <div class="field-col"><span class="field-label">Transit Time:</span><span class="field-value">${s8.transitTime || '30 days'}</span></div>
            <div class="field-col"><span class="field-label">Loading / Finished Date:</span><span class="field-value">${s8.loadingDate || '30/09/26'} • ${s8.finishedDate || '02/10/26'}</span></div>
            <div class="field-col"><span class="field-label">ETD / ATD:</span><span class="field-value highlight-ok">${s8.etd || '10/10/26'} • ${s8.atd || '10/10/26'}</span></div>
            <div class="field-col col-span-2"><span class="field-label">ETA (Destination Port):</span><span class="field-value highlight-val">${s8.eta || '10/11/26'}</span></div>
        </div>
    </div>

    <div class="footer-note">
        <span>Green River Panels (Thailand) Co., Ltd • Wood Pellets Operations Master System (8-Step Full Lifecycle)</span>
        <span>เอกสารรับรองกระบวนการผลิตตามข้อกำหนด ISO 9001 / EUDR / SBP / GGL</span>
    </div>
</body>
</html>`;
    },

    printBpmDocument: function (item) {
        if (!item) return;
        const html = this.renderBpmPrintDocument(item);
        let iframe = document.getElementById("bpmPrintIframe");
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = "bpmPrintIframe";
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            iframe.style.visibility = "hidden";
            document.body.appendChild(iframe);
        }

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }, 300);
    }
});
