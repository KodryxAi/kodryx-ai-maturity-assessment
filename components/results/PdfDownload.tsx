"use client";

import React from "react";
import { useReactToPrint } from "react-to-print";

interface PdfDownloadProps {
  contentRef: React.RefObject<HTMLDivElement>;
  companyName: string;
}

export default function PdfDownload({ contentRef, companyName }: PdfDownloadProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `KODRYX AI Maturity Assessment - ${companyName}`,
    pageStyle: `
      @page { margin: 15mm; }
      body { font-family: Inter, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .kx-caption { font-size: 12px; color: #6b7280; }
      .kx-eyebrow { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: #6b7280; }
      .kx-metric { font-size: 36px; font-weight: 700; color: #c9a24d; }
      .font-display { font-family: Poppins, sans-serif; }
      .font-body { font-family: Inter, sans-serif; }
    `,
  });

  return (
    <button
      type="button"
      onClick={() => handlePrint()}
      className="rounded-md bg-kx-gold px-6 py-3 text-white font-body font-semibold text-sm transition-colors duration-200 hover:bg-kx-gold/90"
    >
      Download PDF
    </button>
  );
}
