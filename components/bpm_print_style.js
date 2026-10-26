/**
 * Component: BPM Print CSS Styles (A4 Portrait Layout)
 * Extracted print stylesheet to keep components strictly < 400 lines
 * Green River Panels Wood Pellets Operations Dashboard
 */
window.Components = window.Components || {};

window.Components.getBpmPrintCss = function () {
    return `
        @page {
            size: A4 portrait;
            margin: 6mm 8mm 6mm 8mm;
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
            font-size: 9px;
            line-height: 1.32;
        }
        .header-box {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 5px;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .company-pill {
            display: inline-block;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 1.5px 6px;
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
            font-size: 13.5px;
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
            border-radius: 5px;
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
            border-radius: 4px;
            margin-bottom: 4.5px;
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
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 3px 8px;
            font-size: 8.5px;
        }
        .step-body.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .step-body.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .step-body.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field-col { display: flex; flex-direction: column; min-width: 0; }
        .col-span-2 { grid-column: span 2 !important; }
        .col-span-3 { grid-column: span 3 !important; }
        .col-span-4 { grid-column: span 4 !important; }
        .col-span-full { grid-column: 1 / -1 !important; }
        .field-label { color: #64748b; font-size: 7.5px; font-weight: 600; margin-bottom: 0.5px; }
        .field-value { color: #0f172a; font-weight: 600; word-break: break-word; }
        .highlight-val { color: #4338ca; font-weight: 800; }
        .highlight-qty { color: #b45309; font-weight: 800; }
        .highlight-ok { color: #047857; font-weight: 700; }
        .highlight-alert { color: #be123c; font-weight: 700; }
        .sub-box {
            grid-column: 1 / -1 !important;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
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
    `;
};
