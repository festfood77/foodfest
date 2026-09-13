// this is just an example

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

/* ─── constants ─── */
const DATE_OPTIONS = [
  { value: "2024-12-18", label: "18 December 2024", day: "Wed" },
  { value: "2024-12-19", label: "19 December 2024", day: "Thu" },
  { value: "2024-12-20", label: "20 December 2024", day: "Fri" },
];

const DON_OPTIONS = [
  { value: "don1", label: "Don 1" },
  { value: "don2", label: "Don 2" },
  { value: "both", label: "Both" },
];

const TICKET_PRICE = 299;
const MAX_TICKETS = 3;

/* ─── sub-components ─── */

/** Animated floating-label input */
function FloatingInput({ id, label, type = "text", register, error, ...rest }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        {...register}
        {...rest}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value.length > 0);
          register.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          register.onChange?.(e);
        }}
        className={[
          "peer w-full px-4 pt-5 pb-2 rounded-[0.75rem] bg-surface-100 border text-ink-heading",
          "placeholder-transparent outline-none transition-all duration-200 text-base",
          "focus:ring-2 focus:ring-brand-500/40",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-edge-subtle focus:border-brand-500",
        ].join(" ")}
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={[
          "absolute left-4 pointer-events-none transition-all duration-200 font-medium",
          focused || hasValue
            ? "top-1.5 text-[10px] text-brand-400"
            : "top-[14px] text-sm text-ink-muted",
        ].join(" ")}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-xs text-red-400 pl-1">{error.message}</p>
      )}
    </div>
  );
}

/** Don selection card group */
// eslint-disable-next-line no-unused-vars
function DonSelector({ value, onChange, error }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-2.5">
        Select Don's Ticket
      </p>
      <div className="grid grid-cols-3 gap-3">
        {DON_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "relative py-3 px-2 rounded-[0.75rem] border text-sm font-semibold transition-all duration-200",
              "overflow-hidden cursor-pointer select-none",
              value === opt.value
                ? "border-brand-500 bg-brand-500/15 text-brand-300 shadow-[0_0_16px_rgba(192,64,240,0.35)]"
                : "border-edge-subtle bg-surface-100 text-ink-muted hover:border-edge-mid hover:text-ink-base",
            ].join(" ")}
          >
            {value === opt.value && (
              <span className="absolute inset-0 rounded-[0.75rem] bg-gradient-to-br from-brand-500/10 to-brand-700/5 pointer-events-none" />
            )}
            {opt.label}
            {value === opt.value && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 pl-1">{error.message}</p>
      )}
    </div>
  );
}

/** Date selector cards */
function DateSelector({ value, onChange, error }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-2.5">
        Date of Visit
      </p>
      <div className="grid grid-cols-3 gap-3">
        {DATE_OPTIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => onChange(d.value)}
            className={[
              "relative py-3 px-2 rounded-[0.75rem] border text-center transition-all duration-200 cursor-pointer select-none overflow-hidden",
              value === d.value
                ? "border-brand-500 bg-brand-500/15 shadow-[0_0_16px_rgba(192,64,240,0.35)]"
                : "border-edge-subtle bg-surface-100 hover:border-edge-mid",
            ].join(" ")}
          >
            {value === d.value && (
              <span className="absolute inset-0 rounded-[0.75rem] bg-gradient-to-br from-brand-500/10 to-brand-700/5 pointer-events-none" />
            )}
            <span
              className={[
                "block text-[11px] font-medium mb-0.5",
                value === d.value ? "text-brand-400" : "text-ink-muted",
              ].join(" ")}
            >
              {d.day}
            </span>
            <span
              className={[
                "block text-lg font-bold leading-none",
                value === d.value ? "text-brand-300" : "text-ink-heading",
              ].join(" ")}
            >
              {new Date(d.value).getDate()}
            </span>
            <span
              className={[
                "block text-[10px] mt-0.5",
                value === d.value ? "text-brand-400" : "text-ink-muted",
              ].join(" ")}
            >
              Dec
            </span>
            {value === d.value && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 pl-1">{error.message}</p>
      )}
    </div>
  );
}

/** Pill-shaped ticket counter */
function TicketCounter({ value, onChange }) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(MAX_TICKETS, value + 1));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">
          Number of Tickets
        </span>
        <span className="text-[11px] text-ink-muted mt-0.5">
          Max {MAX_TICKETS} tickets per phone number
        </span>
      </div>

      {/* Pill counter */}
      <div className="flex items-center bg-surface-200 border border-edge-mid rounded-full p-1 gap-1 select-none">
        {/* Minus */}
        <button
          type="button"
          onClick={dec}
          disabled={value <= 1}
          className={[
            "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 font-bold text-lg leading-none",
            value <= 1
              ? "text-ink-muted cursor-not-allowed"
              : "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_10px_rgba(192,64,240,0.4)] cursor-pointer active:scale-95",
          ].join(" ")}
        >
          <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
            <rect width="14" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>

        {/* Count */}
        <span className="w-10 text-center text-ink-heading font-bold text-base tabular-nums">
          {value}
        </span>

        {/* Plus */}
        <button
          type="button"
          onClick={inc}
          disabled={value >= MAX_TICKETS}
          className={[
            "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 font-bold text-lg leading-none",
            value >= MAX_TICKETS
              ? "text-ink-muted cursor-not-allowed"
              : "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_10px_rgba(192,64,240,0.4)] cursor-pointer active:scale-95",
          ].join(" ")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="6" width="2" height="14" rx="1" fill="currentColor" />
            <rect y="6" width="14" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── main form component ─── */
export default function Form() {
  const [ticketCount, setTicketCount] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      don: "",
      date: "",
      age: "",
    },
  });

  const onSubmit = (data) => {
    // TODO: add submission logic
    console.log({ ...data, tickets: ticketCount });
  };

  const totalAmount = ticketCount * TICKET_PRICE;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md mx-auto flex flex-col gap-5"
    >
      {/* ── Personal details ── */}
      <FloatingInput
        id="fullName"
        label="Full Name"
        register={register("fullName", {
          required: "Full name is required",
          minLength: { value: 3, message: "Name must be at least 3 characters" },
        })}
        error={errors.fullName}
      />

      <FloatingInput
        id="mobile"
        label="Mobile Number"
        type="tel"
        register={register("mobile", {
          required: "Mobile number is required",
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Enter a valid 10-digit Indian mobile number",
          },
        })}
        error={errors.mobile}
      />

      <FloatingInput
        id="email"
        label="Email ID"
        type="email"
        register={register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        error={errors.email}
      />

      <FloatingInput
        id="age"
        label="Age"
        type="number"
        register={register("age", {
          required: "Age is required",
          min: { value: 5, message: "Minimum age is 5" },
          max: { value: 100, message: "Enter a valid age" },
        })}
        error={errors.age}
      />

      {/* ── Don selector ── */}
      {/* <Controller
        name="don"
        control={control}
        rules={{ required: "Please select a Don's ticket" }}
        render={({ field }) => (
          <DonSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.don}
          />
        )}
      /> */}

      {/* ── Date selector ── */}
      <Controller
        name="date"
        control={control}
        rules={{ required: "Please select a date of visit" }}
        render={({ field }) => (
          <DateSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.date}
          />
        )}
      />

      {/* ── Ticket counter ── */}
      <div className="bg-surface-100 border border-edge-subtle rounded-[0.75rem] px-4 py-3.5">
        <TicketCounter value={ticketCount} onChange={setTicketCount} />
      </div>

      {/* ── Price summary ── */}
      <div className="flex items-center justify-between px-4 py-3 rounded-[0.75rem] bg-brand-500/10 border border-brand-500/25">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span>₹{TICKET_PRICE}</span>
          <span className="text-edge-mid">×</span>
          <span>{ticketCount} ticket{ticketCount > 1 ? "s" : ""}</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
            Entry Fee
          </span>
          <span className="text-xl font-bold text-ink-heading">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full font-bold text-base text-white tracking-wide transition-all duration-200 cursor-pointer
          bg-gradient-to-r from-brand-600 to-brand-500
          hover:from-brand-500 hover:to-brand-400
          hover:shadow-[0_0_32px_rgba(192,64,240,0.55)]
          active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-surface-0"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Processing…
          </span>
        ) : (
          "Pay Now →"
        )}
      </button>

      {/* ── Fine print ── */}
      <p className="text-center text-[11px] text-ink-muted pb-2">
        By proceeding you agree to our terms & conditions. Tickets are non-refundable.
      </p>
    </form>
  );
}
