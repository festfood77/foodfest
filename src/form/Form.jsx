import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import ApplicationSubmitted from "./ApplicationSubmitted";
import DateSelector from "./DateSelector";
import FloatingInput from "./FloatingInput";
import Spinner from "./Spinner";
import TicketCounter from "./TicketCounter";
import TicketSelector from "./TicketSelector";

const MAX_TICKETS = 3;

export default function Form() {
  const [ticketCount, setTicketCount] = useState(1);
  const STORAGE_KEY = "disneyland-foodfest-registration-draft";

  const getSavedDraft = () => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) return JSON.parse(draft);
    } catch (e) {
      console.error("Failed to parse draft", e);
    }
    return null;
  };

  const savedDraft = getSavedDraft();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: savedDraft || {
      fullName: "",
      mobile: "",
      email: "",
      date: "",
      age: "",
      ticketPrice: 299,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const formData = watch();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // TODO: Implement form submission logic
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          fullName: data.fullName,
          mobile: data.mobile,
          email: data.email,
          date: data.date,
          age: data.age,
          tickets: ticketCount,
          ticketPrice: data.ticketPrice,
        },
      });

      if (res.error || !res.data?.orderId) {
        throw new Error(
          res.error?.message ||
            res.data?.error ||
            "Failed to create application",
        );
      }

      const { bookingId, orderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Disneyland Food Fest",
        description: "Booking Entry Fee",
        order_id: orderId,
        handler: async function (response) {
          setIsVerifying(true);
          try {
            const verifyRes = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  booking_id: bookingId,
                },
              },
            );

            if (verifyRes.error || !verifyRes.data?.success) {
              throw new Error("Payment verification failed");
            }

            localStorage.removeItem(STORAGE_KEY);
            reset();
            setSubmitted(true);
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.mobile,
        },
        theme: {
          color: "#d68628",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTicketPrice = formData.ticketPrice || 299;
  const totalAmount = ticketCount * currentTicketPrice;

  if (submitted) {
    return <ApplicationSubmitted />;
  }

  if (isVerifying) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-5 sm:px-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-card)] border border-[#ecd9aa] bg-[#fffaf0] p-5 shadow-[0_16px_45px_rgba(111,56,23,0.14)] sm:p-8">
          <Spinner size={48} className="text-brand-300" />
          <h2 className="mt-6 font-display text-xl font-bold text-brand-200">
            Verifying Payment...
          </h2>
          <p className="mt-2 text-center text-sm text-[#8a715b]">
            Please wait while we confirm your booking. Do not close this window.
          </p>
        </div>
      </main>
    );
  }

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
          <Controller
            name="ticketPrice"
            control={control}
            rules={{ required: "Please select a ticket type" }}
            render={({ field }) => (
              <TicketSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.ticketPrice}
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
              ₹{currentTicketPrice} × {ticketCount} ticket
              {ticketCount > 1 ? "s" : ""}
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
            className="mt-1 flex w-full items-center justify-center rounded-full bg-brand-200 py-4 text-base font-bold tracking-wide text-white shadow-[0_8px_18px_rgba(111,56,23,0.2)] transition hover:bg-brand-300 hover:shadow-[0_10px_24px_rgba(214,134,40,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size={20} className="mr-2 !text-white" />
                Processing…
              </>
            ) : (
              "Continue to payment  →"
            )}
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
