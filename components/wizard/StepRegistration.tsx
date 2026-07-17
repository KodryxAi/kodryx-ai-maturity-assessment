"use client";

import type { ContactInfo } from "../../lib/types/assessment";

export interface StepRegistrationProps {
  values: ContactInfo;
  onChange: (payload: Partial<ContactInfo>) => void;
}

export default function StepRegistration({
  values,
  onChange,
}: StepRegistrationProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Let&rsquo;s get acquainted
        </h2>
        <p className="kx-caption mt-1">
          Tell us who should receive the executive report.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Full Name</span>
        <input
          type="text"
          required
          value={values.contactName}
          onChange={(e) => onChange({ contactName: e.target.value })}
          className="rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Email</span>
        <input
          type="email"
          required
          value={values.contactEmail}
          onChange={(e) => onChange({ contactEmail: e.target.value })}
          className="rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Company Name</span>
        <input
          type="text"
          required
          value={values.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Phone (optional)</span>
        <input
          type="tel"
          value={values.contactPhone ?? ""}
          onChange={(e) => onChange({ contactPhone: e.target.value })}
          className="rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none"
        />
      </label>
    </div>
  );
}
