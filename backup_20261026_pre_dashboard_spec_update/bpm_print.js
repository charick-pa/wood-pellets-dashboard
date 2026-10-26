/**
 * Component: BPM Master Form Print Document Template (A4 Portrait Layout)
 * Embedded CSS & 8-Step Full Lifecycle Specification Matching Screen Preview
 * Green River Panels Wood Pellets Operations Dashboard
 * File size target: < 400 lines
 */
window.Components = window.Components || {};

Object.assign(window.Components, {
    renderBpmPrintDocument: function (item) {
        if (!item) return '';

        const ra = item.step2 || {};
        const pz = item.step4_pelletizing || {};
        const qa = item.step4 || {};
        const wh = item.step5 || {};
        const ship = item.step6 || {};
        const loc = item.location || { lat: 7.0089, lng: 100.4767, placeName: "Green River Panels Hat Yai", plotId: "FAC-GRP-01", areaRai: "250 ไร่" };
        const progress = typeof calculateProductionProgress === "function" ? calculateProductionProgress(item) : 50;

        return `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>BPM_Master_Form_${item.orderNo}_${item.moNo || 'MO'}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 7mm 9mm 7mm 9mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: 'Leelawadee UI', 'Tahoma', 'Sarabun', 'TH Sarabun New', 'Segoe UI', sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 2px 6px;
            font-size: 9.5px;
            line-height: 1.32;
        }
        .header-box {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 5px;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .company-pill {
            display: inline-block;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 900;
            color: #312e81;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .iso-cert {
            font-size: 8.5px;
            color: #64748b;
            font-family: monospace;
            margin-left: 6px;
        }
        .doc-title {
            font-size: 14px;
            font-weight: 900;
            color: #0f172a;
            margin: 2px 0 1px 0;
            letter-spacing: -0.3px;
        }
        .doc-sub {
            font-size: 8.5px;
            color: #475569;
        }
        .meta-card {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 6px;
            padding: 4px 7px;
            font-size: 8.5px;
            min-width: 220px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5px;
        }
        .meta-label { color: #64748b; font-weight: 600; }
        .meta-val { font-weight: 700; color: #0f172a; text-align: right; }
        .step-card {
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            margin-bottom: 5px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .step-header {
            background: #1e293b;
            color: #ffffff;
            padding: 3px 8px;
            font-size: 9.5px;
            font-weight: 800;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .step-badge {
            color: #ffffff;
            font-size: 8px;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 3px;
        }
        .step-body {
            padding: 4px 8px;
            background: #ffffff;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3px 8px;
            font-size: 9px;
        }
        .step-body.grid-4 { grid-template-columns: repeat(4, 1fr); }
        .step-body.grid-2 { grid-template-columns: repeat(2, 1fr); }
        .field-col { display: flex; flex-direction: column; }
        .col-span-2 { grid-column: span 2; }
        .col-span-3 { grid-column: span 3; }
        .col-span-4 { grid-column: span 4; }
        .field-label { color: #64748b; font-size: 8px; font-weight: 600; margin-bottom: 0.5px; }
        .field-value { color: #0f172a; font-weight: 600; }
        .highlight-val { color: #4338ca; font-weight: 800; }
        .highlight-qty { color: #b45309; font-weight: 800; }
        .highlight-ok { color: #047857; font-weight: 700; }
        .highlight-alert { color: #be123c; font-weight: 700; }
        .sub-box {
            grid-column: span 3;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 3px 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8.5px;
        }
        .eudr-box {
            background: #ecfdf5;
            border-color: #a7f3d0;
        }
        .footer-note {
            margin-top: 4px;
            border-top: 1px solid #e2e8f0;
            padding-top: 2px;
            display: flex;
            justify-content: space-between;
            font-size: 7.5px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="header-box">
        <div>
            <div>
                <span class="company-pill">GREEN RIVER PANELS (THAILAND) CO., LTD</span>
                <span class="iso-cert">ISO 9001:2015 / SBP-Certified</span>
            </div>
            <h1 class="doc-title">WOOD PELLETS OPERATIONS BPM MASTER FORM</h1>
            <div class="doc-sub">ใบติดตามกระบวนการดำเนินงานและควบคุมคุณภาพเม็ดไม้ชีวมวลครบวงจร (8-Step Full Lifecycle: Sale ➔ RA ➔ Production ➔ QC ➔ QA ➔ Storage ➔ RA Verification ➔ Shipment)</div>
        </div>
        <div class="meta-card">
            <div class="meta-row"><span class="meta-label">Application No:</span><span class="meta-val">${item.applicationNo || 'APP-2026-09821'}</span></div>
            <div class="meta-row"><span class="meta-label">Order No:</span><span class="meta-val highlight-val">${item.orderNo}</span></div>
            <div class="meta-row"><span class="meta-label">MO / PO No:</span><span class="meta-val">${item.moNo || '-'} / ${item.poNo || '-'}</span></div>
            <div class="meta-row"><span class="meta-label">Issue Date:</span><span class="meta-val">2026/10/07</span></div>
            <div class="meta-row"><span class="meta-label">Current Status:</span><span class="meta-val highlight-ok">Step ${item.currentStep || 1} (${progress}%)</span></div>
        </div>
    </div>

    <!-- 1. Sale Department -->
    <div class="step-card">
        <div class="step-header">
            <span>1. SALE DEPARTMENT — ข้อมูลคำสั่งซื้อและลูกค้า</span>
            <span class="step-badge" style="background:#2563eb;">Step 1</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">Customer Code:</span><span class="field-value">${item.customerCode || '02545'}</span></div>
            <div class="field-col"><span class="field-label">Customer Name:</span><span class="field-value">${item.customer}</span></div>
            <div class="field-col"><span class="field-label">PO Number:</span><span class="field-value highlight-val">${item.poNo || 'PO-2026-09821'}</span></div>
            <div class="field-col"><span class="field-label">Order No:</span><span class="field-value highlight-val">${item.orderNo}</span></div>
            <div class="field-col"><span class="field-label">MO Number:</span><span class="field-value">${item.moNo || '-'}</span></div>
            <div class="field-col"><span class="field-label">Product Name:</span><span class="field-value">${item.productName || 'Industrial Wood Pellets (Bio-Fuel)'}</span></div>
            <div class="field-col"><span class="field-label">Product Code:</span><span class="field-value">${item.productCode || 'PRD-88204-X'}</span></div>
            <div class="field-col"><span class="field-label">Order Quantity:</span><span class="field-value highlight-qty">${item.orderQuantity || '500 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Product Type:</span><span class="field-value">${item.productType || '1-0.6mm, 2-0.8mm'}</span></div>
            <div class="field-col col-span-3"><span class="field-label">Certificates Required:</span><span class="field-value">${item.certRequirement || 'SBP, GGL, FSC-100%'}</span></div>
            <div class="field-col col-span-3"><span class="field-label">Customer Specification:</span><span class="field-value">${item.customerReq || 'High precision pressure resistance up to 350 bar with rust-proof coating'}</span></div>
            <div class="field-col col-span-3"><span class="field-label">Delivery Schedule & Destination:</span><span class="field-value highlight-ok">${item.requestedDeliveryDate || '2026/12/15'} &bull; ${item.shipToLocation || item.destination}</span></div>
            ${(() => {
                const complaints = typeof getComplaintsForOrder === "function" ? getComplaintsForOrder(item.orderNo) : [];
                if (!complaints || complaints.length === 0) return '';
                return `
                    <div class="col-span-3 sub-box" style="background:#fff1f2; border-color:#fecdd3; margin-top:3px;">
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
            <span>2. RA — REGULATORY & COMPLIANCE REQUIREMENTS (ใบอนุญาตและข้อกำหนด)</span>
            <span class="step-badge" style="background:#4f46e5;">Step 2</span>
        </div>
        <div class="step-body grid-2">
            <div class="field-col"><span class="field-label">Certificate Status:</span><span class="field-value highlight-ok">${ra.certStatus || 'APPROVED & VALID (Through 2028-12-31)'}</span></div>
            <div class="field-col"><span class="field-label">License / Permit Expiry:</span><span class="field-value highlight-alert">${ra.licenseExpiry || '2027-09-30'} (Active)</span></div>
            <div class="sub-box eudr-box col-span-2">
                <span><strong>EUDR Geolocation Verified:</strong> รหัสแปลง ${loc.plotId || 'PLOT-EUDR-202601'} &bull; พิกัด [${loc.lat || 7.0089}, ${loc.lng || 100.4767}] (${loc.placeName || 'โรงงาน Green River Panels'})</span>
                <span class="highlight-ok" style="font-weight:800;">Polygon Verified</span>
            </div>
            ${(() => {
                const moPlots = typeof getPlotsByMoNo === "function" ? getPlotsByMoNo(item.moNo) : [];
                if (moPlots.length <= 1) return '';
                const totalRai = moPlots.reduce((sum, p) => sum + (p.thaiArea ? p.thaiArea.rai : 0), 0);
                return `
                    <div class="sub-box col-span-2" style="background:#eef2ff; border-color:#c7d2fe;">
                        <span><strong>แปลงแหล่งกำเนิดไม้ EUDR (${moPlots.length} แปลง รวม ${totalRai} ไร่):</strong> ${moPlots.map((p, idx) => `[${idx+1}] ${p.name} (${p.thaiArea ? p.thaiArea.rai : 0} ไร่)`).join(' &bull; ')}</span>
                        <span class="highlight-val">Multi-Polygon</span>
                    </div>
                `;
            })()}
            <div class="field-col col-span-2"><span class="field-label">Specification Requirement:</span><span class="field-value">${ra.specReq || 'EN 10204 3.1 Material Certification, ASME B16.34 Class 2500, Hydrostatic Test 525 bar'}</span></div>
            <div class="field-col col-span-2"><span class="field-label">Packaging & Label Requirement:</span><span class="field-value">${ra.packagingReq || 'VCI Anti-Corrosion Vacuum Sealed Polybags'} &bull; ${ra.labelReq || 'QR-Code Barcode Label (100x150 mm)'}</span></div>
            <div class="field-col"><span class="field-label">Customer Regulatory:</span><span class="field-value">${ra.customerRegulatory || 'RoHS 3, REACH, PED 2014/68/EU, มอก.'}</span></div>
            <div class="field-col"><span class="field-label">Transport Permit Expiry:</span><span class="field-value highlight-alert">${ra.transportExpiry || '2027-03-31'}</span></div>
        </div>
    </div>

    <!-- 3. Production Planning -->
    <div class="step-card">
        <div class="step-header">
            <span>3. PRODUCTION — WOODS MATERIAL PLANNING (การวางแผนวัตถุดิบไม้)</span>
            <span class="step-badge" style="background:#d97706;">Step 3</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">Planned Quantity:</span><span class="field-value">${(item.step3?.planned || 20000).toLocaleString()} Ton</span></div>
            <div class="field-col"><span class="field-label">Actual Quantity:</span><span class="field-value highlight-qty">${(item.step3?.actual || 15000).toLocaleString()} Ton</span></div>
            <div class="field-col"><span class="field-label">Start Date:</span><span class="field-value">${item.step3?.startDate || '2026/10/12'}</span></div>
            <div class="field-col"><span class="field-label">Finish Date:</span><span class="field-value">${item.step3?.finishDate || '2026/10/02'}</span></div>
            <div class="sub-box col-span-4">
                <span><strong>แหล่งกำเนิดแปลงไม้ (Plot Source):</strong> ${loc.placeName || 'แปลงสวนไม้ยางพารา สุราษฎร์ธานี'} (${loc.areaRai || '250 ไร่'}) [GPS: ${loc.lat || '-'}, ${loc.lng || '-'}]</span>
                <span class="highlight-val">FSC-Controlled</span>
            </div>
            <div class="field-col col-span-4"><span class="field-label">Raw Material Machinery:</span><span class="field-value">Hummer mill (Active), Flaker 3 (Standby), Flaker 4 (Active)</span></div>
        </div>
    </div>

    <!-- 4. In-Line QC -->
    <div class="step-card">
        <div class="step-header">
            <span>4. QC — IN-LINE QUALITY CONTROL & PELLETIZING (การควบคุมคุณภาพหน้าเตาและอัดเม็ด)</span>
            <span class="step-badge" style="background:#ea580c;">Step 4</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">Yield Output:</span><span class="field-value highlight-val">${pz.yield || '90,000 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Total Downtime:</span><span class="field-value highlight-alert">${(pz.totalDowntimeMins || 4000).toLocaleString()} นาที</span></div>
            <div class="field-col"><span class="field-label">Pellet Diameter:</span><span class="field-value highlight-val">${pz.pelletDiameter || '6.0 mm'}</span></div>
            <div class="field-col"><span class="field-label">Pellet Moisture:</span><span class="field-value highlight-val">${pz.pelletMoisture || '7.8%'}</span></div>
            <div class="field-col"><span class="field-label">Cooling Moisture:</span><span class="field-value highlight-ok">${pz.coolingMoisture || '6.5%'}</span></div>
            <div class="field-col col-span-3"><span class="field-label">In-line QC Checkpoints & Note:</span><span class="field-value highlight-alert">${pz.issue || 'Screen blockage on Hummer mill & die temperature check'}</span></div>
        </div>
    </div>

    <!-- 5. QA Lab & COA -->
    <div class="step-card">
        <div class="step-header">
            <span>5. QA — QUALITY ASSURANCE & CERTIFICATE OF ANALYSIS (COA)</span>
            <span class="step-badge" style="background:#9333ea;">Step 5</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">Sample No:</span><span class="field-value">${qa.sampleNo || '1-4'}</span></div>
            <div class="field-col"><span class="field-label">Test Date:</span><span class="field-value">${qa.testDate || '2026-10-09'}</span></div>
            <div class="field-col"><span class="field-label">Lead QA Analyst:</span><span class="field-value">${qa.analyst || 'NL-4092 (Somchai P.)'}</span></div>
            <div class="field-col col-span-3"><span class="field-label">Specification Standard:</span><span class="field-value">${qa.specification || 'ISO 17225-2 Class A1 / ENplus-A1 Wood Pellets'}</span></div>
            <div class="field-col col-span-2"><span class="field-label">COA File Reference:</span><span class="field-value highlight-val">${qa.coaFile || 'COA-202610-LF2-03918.pdf'}</span></div>
            <div class="field-col"><span class="field-label">Deviation / OOS:</span><span class="field-value highlight-ok">${qa.deviation || 'None (Zero Deviation)'}</span></div>
        </div>
    </div>

    <!-- 6. Storage & Warehouse -->
    <div class="step-card">
        <div class="step-header">
            <span>6. STORAGE — WAREHOUSE & STOCK MOVEMENT (คลังสินค้าและการจัดเก็บ)</span>
            <span class="step-badge" style="background:#0891b2;">Step 6</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">Storage Location:</span><span class="field-value">${wh.location || 'Warehouse 1 (Dry Bulk Bay)'}</span></div>
            <div class="field-col"><span class="field-label">Big Bag Label No:</span><span class="field-value">${wh.bigBagLabelNo || 'BB-202610-04159'}</span></div>
            <div class="field-col"><span class="field-label">Material Code:</span><span class="field-value">${wh.material || 'BWP-11-08 / BWP-12-08'}</span></div>
            <div class="field-col"><span class="field-label">Opening Stock:</span><span class="field-value">${wh.openingStock || '1,000 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Total Issue (จ่ายออก):</span><span class="field-value highlight-qty">${wh.issueQty || '300 Ton'}</span></div>
            <div class="field-col"><span class="field-label">Closing Stock (คงเหลือ):</span><span class="field-value highlight-ok">${wh.closingStock || '1,200 Ton'}</span></div>
        </div>
    </div>

    <!-- 7. RA Verification Dossier -->
    <div class="step-card">
        <div class="step-header">
            <span>7. RA VERIFICATION — REGULATORY VERIFICATION DOSSIER (การตรวจสอบเอกสารและใบรับรอง)</span>
            <span class="step-badge" style="background:#059669;">Step 7</span>
        </div>
        <div class="step-body">
            <div class="field-col"><span class="field-label">EUDR Due Diligence Statement:</span><span class="field-value highlight-ok">DDS-2026-TH-0924 (VALID)</span></div>
            <div class="field-col"><span class="field-label">SBP Claim:</span><span class="field-value">SBP-Compliant Biomass (FSC 100%)</span></div>
            <div class="field-col"><span class="field-label">GGL Certificate No:</span><span class="field-value">GGL-GRP-2026-8812</span></div>
            <div class="field-col col-span-3"><span class="field-label">Verification Result:</span><span class="field-value highlight-ok">ผ่านการตรวจสอบความสอดคล้องตามเกณฑ์ SBP Standard 1, GGL Track & Trace, และ EU Deforestation Regulation พร้อมส่งมอบเพื่อการส่งออก 100%</span></div>
        </div>
    </div>

    <!-- 8. Shipment & Export -->
    <div class="step-card">
        <div class="step-header">
            <span>8. SHIPMENT & EXPORT LOGISTICS (การจัดส่งและส่งออกทางเรือ)</span>
            <span class="step-badge" style="background:#0d9488;">Step 8</span>
        </div>
        <div class="step-body grid-4">
            <div class="field-col"><span class="field-label">SA Number:</span><span class="field-value highlight-val">${ship.saNo || 'CPM2600100'}</span></div>
            <div class="field-col"><span class="field-label">Destination Port (POD):</span><span class="field-value">${item.destination}</span></div>
            <div class="field-col"><span class="field-label">Shipping Line:</span><span class="field-value">${ship.shippingLine || 'EVG'}</span></div>
            <div class="field-col"><span class="field-label">Booking No:</span><span class="field-value">${ship.bookingNo || '09050012456'}</span></div>
            <div class="field-col"><span class="field-label">Loading Date:</span><span class="field-value">${ship.loadingDate || '30/09/26'}</span></div>
            <div class="field-col"><span class="field-label">ETD:</span><span class="field-value highlight-ok">${ship.etd || '10/10/26'}</span></div>
            <div class="field-col"><span class="field-label">ETA:</span><span class="field-value">${ship.eta || '10/11/26'}</span></div>
            <div class="field-col"><span class="field-label">Transit Time:</span><span class="field-value highlight-val">${ship.transitTime || '30 days'}</span></div>
        </div>
    </div>

    <div class="footer-note">
        <span>Green River Panels (Thailand) Co., Ltd &bull; Wood Pellets Operations Master System</span>
        <span>ระบบตรวจสอบย้อนกลับและควบคุมมาตรฐานสากล ISO 9001 / EUDR / SBP / GGL</span>
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