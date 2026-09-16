import React from "react";

const TICKET_OPTIONS = [
  { value: 1, name: "Normal" },
  { value: 599, name: "VIP" },
];

export default function TicketSelector({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
        Select your ticket
      </legend>
      <div className="grid grid-cols-3 gap-2.5">
        {TICKET_OPTIONS.map((ticket) => {
          const selected = value === ticket.value;
          return (
            <button
              key={ticket.value}
              type="button"
              onClick={() => onChange(ticket.value)}
              aria-pressed={selected}
              className={`relative overflow-hidden rounded-[var(--radius-input)] border px-2 py-3 text-center transition-all duration-200 ${selected ? "border-brand-300 bg-brand-50 shadow-[0_5px_16px_rgba(214,134,40,0.18)]" : "border-[#ead8b0] bg-white hover:border-brand-300/60 hover:bg-brand-50/50"}`}
            >
              <span
                className={`block text-[11px] font-semibold ${selected ? "text-brand-300" : "text-[#8a715b]"}`}
              >
                {ticket.name}
              </span>
              <span
                className={`block text-lg font-extrabold leading-tight ${selected ? "text-brand-200" : "text-brand-400"}`}
              >
                ₹{ticket.value}
              </span>

              {selected && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-300" />
              )}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 pl-1 text-xs text-red-600">{error.message}</p>
      )}
    </fieldset>
  );
}
