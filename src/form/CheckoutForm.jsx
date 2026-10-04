import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import Spinner from "./Spinner";
import ApplicationSubmitted from "./ApplicationSubmitted";
import "./checkout.css";

export default function CheckoutForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data from quantities page
  const { quantities, totalAmount, totalTickets } = location.state || {
    quantities: {},
    totalAmount: 0,
    totalTickets: 0,
  };

  const [inputVal, setInputVal] = useState("");
  const [inputError, setInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // If accessed directly without state, go back
  useEffect(() => {
    if (!location.state || totalTickets === 0) {
      navigate("/quantities");
    }
  }, [location.state, navigate, totalTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal) return;

    setInputError("");
    const isEmail = inputVal.includes("@");

    let mobile = "0000000000";
    let email = "guest@example.com";

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputVal)) {
        setInputError("Please enter a valid email address.");
        return;
      }
      email = inputVal;
    } else {
      const cleanPhone = inputVal.replace(/\D/g, '').slice(-10);
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        setInputError("Please enter a valid 10-digit mobile number.");
        return;
      }
      mobile = cleanPhone;
    }

    setIsSubmitting(true);
    try {
      // Trick the backend into using our exact totalAmount by sending tickets: 1, ticketPrice: totalAmount
      const res = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          fullName: "Guest User",
          mobile: mobile,
          email: email,
          date: "Any Day",
          age: 18,
          tickets: 1,
          ticketPrice: totalAmount,
        },
      });

      if (res.error || !res.data?.orderId) {
        throw new Error(
          res.error?.message ||
          res.data?.error ||
          "Failed to create application"
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
              }
            );

            if (verifyRes.error || !verifyRes.data?.success) {
              throw new Error("Payment verification failed");
            }

            setSubmitted(true);
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: "Guest User",
          email: email,
          contact: mobile,
        },
        theme: {
          color: "#111111",
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

  if (submitted) {
    return <ApplicationSubmitted />;
  }

  if (isVerifying) {
    return (
      <main className="cf-root">
        <div className="cf-verifying">
          <Spinner size={48} className="text-black" />
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your booking. Do not close this window.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="cf-root">
      <div className="cf-layout">

        {/* LEFT COLUMN: Header & Form */}
        <div className="cf-left">
          <div className="cf-header">
            <button className="cf-back-btn" onClick={() => navigate("/quantities")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="cf-header-info">
              <h1>Disney Land Food Fest – The Happiest Food Festival 2.2</h1>
              <p>📅 18 December – 20 December 2026 | 11:00 AM – 11:00 PM</p>
            </div>
            <div className="cf-header-meta">
              <span className="cf-header-price">INR {totalAmount}</span>
              <span className="cf-header-qty">Qty: {totalTickets}</span>
            </div>
          </div>

          <div className="cf-form-section">
            <h2>Confirm your account and pay</h2>
            <form onSubmit={handleSubmit}>
              <div className="cf-input-wrap">
                <input
                  type="text"
                  placeholder="Email or mobile number"
                  className={`cf-input ${inputError ? "cf-input-error" : ""}`}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  required
                />
                {inputError && <p className="cf-error-text">{inputError}</p>}
              </div>
              <p className="cf-form-hint">If you don't have an account yet, we'll create one for you</p>

              <button
                type="submit"
                className="cf-submit-btn"
                disabled={isSubmitting || !inputVal}
              >
                {isSubmitting ? <Spinner size={20} className="mr-2" /> : "Continue"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="cf-right">
          <div className="cf-summary-card">
            <div className="cf-summary-header">
              <h2>Order Summary</h2>
              <img src="/landing_page3.avif" alt="Event Poster" className="cf-summary-img" />
            </div>


            <div className="cf-summary-row">
              <div className="cf-summary-label">
                <span>Ticket Amount</span>
                <span className="cf-summary-desc">{totalTickets} × Passes</span>
              </div>
              <span className="cf-summary-val">INR {totalAmount}</span>
            </div>

            <div className="cf-summary-divider"></div>

            <div className="cf-summary-row cf-summary-total">
              <span>Total Amount</span>
              <span>INR {totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
