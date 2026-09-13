import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DateSelector from "./DateSelector";
import FloatingInput from "./FloatingInput";
import TicketCounter from "./TicketCounter";

const TICKET_PRICE = 299;
const MAX_TICKETS = 3;

export default function Form() {
  const [ticketCount, setTicketCount] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { fullName: "", mobile: "", email: "", date: "", age: "" },
  });
  const onSubmit = (data) =>
    console.log({
      ...data,
      tickets: ticketCount,
      totalAmount: ticketCount * TICKET_PRICE,
    });
  const totalAmount = ticketCount * TICKET_PRICE;

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-5 sm:px-6">
      <div className="rounded-[var(--radius-card)] border border-[#ecd9aa] bg-[#fffaf0] p-5 shadow-[0_16px_45px_rgba(111,56,23,0.14)] sm:p-8">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
            Reserve your spot
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-200 sm:text-3xl">
            Complete your booking
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#8a715b]">
            Enter your details below and choose the date that works best for
            you.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FloatingInput
            id="fullName"
            label="Full name"
            register={register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
            error={errors.fullName}
          />
          <FloatingInput
            id="mobile"
            label="Mobile number"
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
            label="Email address"
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
            min="5"
            max="100"
            register={register("age", {
              required: "Age is required",
              min: { value: 5, message: "Minimum age is 5" },
              max: { value: 100, message: "Enter a valid age" },
            })}
            error={errors.age}
          />
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
          <div className="rounded-[var(--radius-input)] border border-[#ead8b0] bg-brand-50/60 px-4 py-3.5">
            <TicketCounter  
              value={ticketCount}
              onChange={setTicketCount}
              MAX_TICKETS={MAX_TICKETS}
            />
          </div>
          <div className="flex items-center justify-between rounded-[var(--radius-input)] border border-brand-300/25 bg-brand-50 px-4 py-3.5">
            <div className="text-sm text-[#8a715b]">
              ₹{TICKET_PRICE} × {ticketCount} ticket{ticketCount > 1 ? "s" : ""}
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-300">
                Entry fee
              </span>
              <span className="text-xl font-extrabold text-brand-200">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-full bg-brand-200 py-4 text-base font-bold tracking-wide text-white shadow-[0_8px_18px_rgba(111,56,23,0.2)] transition hover:bg-brand-300 hover:shadow-[0_10px_24px_rgba(214,134,40,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
          >
            {isSubmitting ? "Processing…" : "Continue to payment  →"}
          </button>
          <p className="pb-1 text-center text-[11px] leading-5 text-[#8a715b]">
            By proceeding, you agree to our terms & conditions. Tickets are
            non-refundable.
          </p>
        </form>
      </div>
    </main>
  );
}
