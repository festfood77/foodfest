import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const DATE_OPTIONS = [
  { value: "2024-12-18", day: "Wed" },
  { value: "2024-12-19", day: "Thu" },
  { value: "2024-12-20", day: "Fri" },
];
const TICKET_PRICE = 299;
const MAX_TICKETS = 3;

function FloatingInput({ id, label, type = "text", register, error, ...rest }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  return (
    <div className="relative w-full">
      <input id={id} type={type} {...register} {...rest}
        onFocus={() => setFocused(true)}
        onBlur={(event) => { setFocused(false); setHasValue(event.target.value.length > 0); register.onBlur?.(event); }}
        onChange={(event) => { setHasValue(event.target.value.length > 0); register.onChange?.(event); }}
        placeholder={label}
        className={`peer w-full rounded-[var(--radius-input)] border bg-white px-4 pb-2 pt-5 text-sm text-brand-400 outline-none transition-all placeholder-transparent focus:ring-2 focus:ring-brand-300/25 ${error ? "border-red-500 focus:border-red-500" : "border-[#ead8b0] focus:border-brand-300"}`}
      />
      <label htmlFor={id} className={`pointer-events-none absolute left-4 font-medium transition-all duration-200 ${focused || hasValue ? "top-1.5 text-[10px] text-brand-300" : "top-[14px] text-sm text-[#8a715b]"}`}>{label}</label>
      {error && <p className="mt-1 pl-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

function DateSelector({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">Date of visit</legend>
      <div className="grid grid-cols-3 gap-2.5">
        {DATE_OPTIONS.map((date) => {
          const selected = value === date.value;
          return (
            <button key={date.value} type="button" onClick={() => onChange(date.value)} aria-pressed={selected}
              className={`relative overflow-hidden rounded-[var(--radius-input)] border px-2 py-3 text-center transition-all duration-200 ${selected ? "border-brand-300 bg-brand-50 shadow-[0_5px_16px_rgba(214,134,40,0.18)]" : "border-[#ead8b0] bg-white hover:border-brand-300/60 hover:bg-brand-50/50"}`}>
              <span className={`block text-[11px] font-semibold ${selected ? "text-brand-300" : "text-[#8a715b]"}`}>{date.day}</span>
              <span className={`block text-lg font-extrabold leading-tight ${selected ? "text-brand-200" : "text-brand-400"}`}>{new Date(`${date.value}T00:00:00`).getDate()}</span>
              <span className={`block text-[10px] ${selected ? "text-brand-300" : "text-[#8a715b]"}`}>Dec</span>
              {selected && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-300" />}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 pl-1 text-xs text-red-600">{error.message}</p>}
    </fieldset>
  );
}

function TicketCounter({ value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">Number of tickets</p><p className="mt-1 text-[11px] text-[#8a715b]">Maximum {MAX_TICKETS} per booking</p></div>
      <div className="flex items-center gap-1 rounded-full border border-[#ead8b0] bg-white p-1">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value === 1} aria-label="Decrease ticket count" className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-brand-200 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-30">−</button>
        <span className="w-8 text-center text-sm font-extrabold tabular-nums text-brand-400">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(MAX_TICKETS, value + 1))} disabled={value === MAX_TICKETS} aria-label="Increase ticket count" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200 text-lg font-bold text-white transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-30">+</button>
      </div>
    </div>
  );
}

export default function Form() {
  const [ticketCount, setTicketCount] = useState(1);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({ defaultValues: { fullName: "", mobile: "", email: "", date: "", age: "" } });
  const onSubmit = (data) => console.log({ ...data, tickets: ticketCount, totalAmount: ticketCount * TICKET_PRICE });
  const totalAmount = ticketCount * TICKET_PRICE;

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-5 sm:px-6">
      <div className="rounded-[var(--radius-card)] border border-[#ecd9aa] bg-[#fffaf0] p-5 shadow-[0_16px_45px_rgba(111,56,23,0.14)] sm:p-8">
        <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Reserve your spot</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-200 sm:text-3xl">Complete your booking</h1><p className="mt-2 text-sm leading-6 text-[#8a715b]">Enter your details below and choose the date that works best for you.</p></div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FloatingInput id="fullName" label="Full name" register={register("fullName", { required: "Full name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} error={errors.fullName} />
          <FloatingInput id="mobile" label="Mobile number" type="tel" register={register("mobile", { required: "Mobile number is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian mobile number" } })} error={errors.mobile} />
          <FloatingInput id="email" label="Email address" type="email" register={register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } })} error={errors.email} />
          <FloatingInput id="age" label="Age" type="number" min="5" max="100" register={register("age", { required: "Age is required", min: { value: 5, message: "Minimum age is 5" }, max: { value: 100, message: "Enter a valid age" } })} error={errors.age} />
          <Controller name="date" control={control} rules={{ required: "Please select a date of visit" }} render={({ field }) => <DateSelector value={field.value} onChange={field.onChange} error={errors.date} />} />
          <div className="rounded-[var(--radius-input)] border border-[#ead8b0] bg-brand-50/60 px-4 py-3.5"><TicketCounter value={ticketCount} onChange={setTicketCount} /></div>
          <div className="flex items-center justify-between rounded-[var(--radius-input)] border border-brand-300/25 bg-brand-50 px-4 py-3.5"><div className="text-sm text-[#8a715b]">₹{TICKET_PRICE} × {ticketCount} ticket{ticketCount > 1 ? "s" : ""}</div><div className="text-right"><span className="block text-[10px] font-bold uppercase tracking-wider text-brand-300">Entry fee</span><span className="text-xl font-extrabold text-brand-200">₹{totalAmount.toLocaleString("en-IN")}</span></div></div>
          <button type="submit" disabled={isSubmitting} className="mt-1 w-full rounded-full bg-brand-200 py-4 text-base font-bold tracking-wide text-white shadow-[0_8px_18px_rgba(111,56,23,0.2)] transition hover:bg-brand-300 hover:shadow-[0_10px_24px_rgba(214,134,40,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2">{isSubmitting ? "Processing…" : "Continue to payment  →"}</button>
          <p className="pb-1 text-center text-[11px] leading-5 text-[#8a715b]">By proceeding, you agree to our terms & conditions. Tickets are non-refundable.</p>
        </form>
      </div>
    </main>
  );
}
