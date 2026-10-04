import { useState } from "react";
import { useNavigate } from "react-router";
import "./quantities.css";

const TICKET_TYPES = [
  { id: "eb1_d1", name: "Early Bird Pass", description: "Limited early bird offer – valid for 18th December", date: "18 Dec", day: "Friday", price: 299, soldOut: false },
  { id: "eb1_d2", name: "Early Bird Pass", description: "Limited early bird offer – valid for 19th December", date: "19 Dec", day: "Saturday", price: 299, soldOut: false },
  { id: "eb1_d3", name: "Early Bird Pass", description: "Limited early bird offer – valid for 20th December", date: "20 Dec", day: "Sunday", price: 299, soldOut: false },

  { id: "eb2_d1", name: "Early Bird Plus", description: "Early bird offer with premium perks – valid for 18th December", date: "18 Dec", day: "Friday", price: 399, soldOut: false },
  { id: "eb2_d2", name: "Early Bird Plus", description: "Early bird offer with premium perks – valid for 19th December", date: "19 Dec", day: "Saturday", price: 399, soldOut: false },
  { id: "eb2_d3", name: "Early Bird Plus", description: "Early bird offer with premium perks – valid for 20th December", date: "20 Dec", day: "Sunday", price: 399, soldOut: false },

  { id: "t1_d1", name: "Standard Ticket", description: "General entry – valid for 18th December", date: "18 Dec", day: "Friday", price: 499, soldOut: false },
  { id: "t1_d2", name: "Standard Ticket", description: "General entry – valid for 19th December", date: "19 Dec", day: "Saturday", price: 499, soldOut: false },
  { id: "t1_d3", name: "Standard Ticket", description: "General entry – valid for 20th December", date: "20 Dec", day: "Sunday", price: 499, soldOut: false },

  { id: "t2_d1", name: "Standard Ticket Plus", description: "General entry with priority access – valid for 18th December", date: "18 Dec", day: "Friday", price: 599, soldOut: false },
  { id: "t2_d2", name: "Standard Ticket Plus", description: "General entry with priority access – valid for 19th December", date: "19 Dec", day: "Saturday", price: 599, soldOut: false },
  { id: "t2_d3", name: "Standard Ticket Plus", description: "General entry with priority access – valid for 20th December", date: "20 Dec", day: "Sunday", price: 599, soldOut: false },

  { id: "vip", name: "VIP All Access Pass", description: "Full 3-day VIP access with exclusive perks", price: 899, soldOut: true },
];


export default function QuantitiesPage() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState(
    Object.fromEntries(TICKET_TYPES.map((t) => [t.id, 0]))
  );

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = TICKET_TYPES.filter((t) => !t.soldOut).reduce(
    (sum, t) => sum + t.price * quantities[t.id],
    0
  );

  const handleQtyChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleCheckout = () => {
    if (totalTickets === 0) return;
    navigate("/form", {
      state: {
        quantities,
        totalAmount,
        totalTickets,
      },
    });
  };

  return (
    <div className="qp-root">
      {/* ── MAIN LAYOUT ── */}
      <div className="qp-layout">

        {/* ── LEFT: Tickets ── */}
        <div className="qp-left">
          {/* Event header */}
          <div className="qp-event-header">
            <button className="qp-back-btn" onClick={() => navigate("/")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="qp-header-info">
              <h1 className="qp-event-title">
                Disney Land Food Fest – The Happiest Food Festival 2.2
              </h1>
              <p className="qp-event-meta">
                📅 18 December – 20 December 2026 &nbsp;|&nbsp; 11:00 AM – 11:00 PM
              </p>
            </div>
          </div>

          {/* Ticket rows */}
          <div className="qp-ticket-list">
            {TICKET_TYPES.map((ticket, i) => (
              <div
                key={ticket.id}
                className={`qp-ticket-row${ticket.soldOut ? " qp-ticket-row--soldout" : ""}`}
              >
                <div className="qp-ticket-info">
                  <div className="qp-ticket-name-row">
                    <p className="qp-ticket-name">{ticket.name}</p>
                    {ticket.date && ticket.day && (
                      <span className="qp-date-badge">
                        {ticket.date} • {ticket.day}
                      </span>
                    )}
                    {ticket.soldOut && (
                      <span className="qp-sold-out-badge">Sold Out</span>
                    )}
                  </div>
                  <p className="qp-ticket-desc">{ticket.description}</p>
                  <p className="qp-ticket-price">₹{ticket.price}</p>
                </div>

                <div className="qp-ticket-right">
                  {ticket.soldOut ? (
                    <span className="qp-sold-out-text">Unavailable</span>
                  ) : (
                    <div className="qp-qty-wrap">
                      <select
                        className="qp-qty-select"
                        value={quantities[ticket.id]}
                        onChange={(e) => handleQtyChange(ticket.id, e.target.value)}
                      >
                        {Array.from(
                          { length: Math.min(4, 4 - totalTickets + quantities[ticket.id]) + 1 },
                          (_, n) => (
                            <option key={n} value={n}>
                              Qty: {n}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}
                  <span className="qp-ticket-subtotal">
                    {ticket.soldOut
                      ? "–"
                      : `INR ${(ticket.price * quantities[ticket.id]).toLocaleString("en-IN")}`}
                  </span>
                </div>

                {i < TICKET_TYPES.length - 1 && <div className="qp-divider" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Summary ── */}
        <div className="qp-summary">
          <div className="qp-summary-row">
            <span className="qp-summary-label">Ticket Quantity</span>
            <span className="qp-summary-value">{totalTickets}</span>
          </div>
          <div className="qp-summary-row">
            <span className="qp-summary-label">Ticket Amount</span>
            <span className="qp-summary-value">
              INR {totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="qp-summary-divider" />

          <div className="qp-summary-row qp-summary-total">
            <span className="qp-summary-label">Total Amount</span>
            <span className="qp-summary-value">
              INR {totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            className={`qp-checkout-btn${totalTickets === 0 ? " qp-checkout-btn--disabled" : ""}`}
            onClick={handleCheckout}
            disabled={totalTickets === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
