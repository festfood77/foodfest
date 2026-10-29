import React from "react";

export default function TicketCounter({ value, onChange, MAX_TICKETS = 3 }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
          Number of tickets
        </p>
        <p className="mt-1 text-[11px] text-[#8a715b]">
          Maximum {MAX_TICKETS} per booking
        </p>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-[#ead8b0] bg-white p-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value === 1}
          aria-label="Decrease ticket count"
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-brand-200 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-extrabold tabular-nums text-brand-400">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(MAX_TICKETS, value + 1))}
          disabled={value === MAX_TICKETS}
          aria-label="Increase ticket count"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200 text-lg font-bold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
