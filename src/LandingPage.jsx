import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "./landing.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const heroBookRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (heroBookRef.current) observer.observe(heroBookRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-root">

      {/* ── HERO SECTION ── */}
      <section className="lp-hero">

        {/* Poster / Left image */}
        <div className="lp-poster-wrap">
          <img
            src="/landing_page3.avif"
            alt="Horn OK Please Event Poster"
            className="lp-poster-img"
          />
        </div>

        {/* Info panel */}
        <div className="lp-info">
          <span className="lp-category">Festivals</span>

          <h1 className="lp-title">
            Disney Land Food Fest – The Happiest Food Festival 2.2
          </h1>

          <p className="lp-datetime">
            18 December – 20 December 2026 &nbsp;|&nbsp; 11:00 AM – 11:00 PM
          </p>

          <p className="lp-venue">South Delhi</p>

          <div className="lp-tags">
            <span className="lp-tag">Food Festival</span>
          </div>

          {/* Book Now row – observed for sticky trigger */}
          <div className="lp-book-row" ref={heroBookRef}>
            <button
              className="lp-book-btn"
              onClick={() => navigate("/form")}
            >
              Book Now
            </button>
            <span className="lp-price">INR 299 – 899</span>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION SECTION ── */}
      <section className="lp-desc">
        <div className="lp-desc-inner">
          <h2 className="lp-desc-heading">DESCRIPTION</h2>

          {[
            "Delhi, clear your weekend plans — Disneyland Foodfest is BACK!",
            "We're bringing the vibes with insane food, a power-packed artist lineup, epic shopping, games, rides and experiences you'll actually want on your camera roll.",
            "Come hungry because Disneyland Foodfest is serving iconic eats, viral legends, global flavours and desserts worth breaking the diet for. And when you're done eating? Catch your favourite artists live, discover cool homegrown brands, take on games and challenges, hit the rides and explore something new around every corner.",
            "Come with your gang, your date, your fam, your kids — or literally everyone. There's something happening for every age and every vibe.",
            "Eat. Vibe. Dance. Shop. Play. Repeat. 🔁",
            "One weekend. Big food. Bigger artists. Non-stop scenes.",
            "📍 Disneyland Foodfest — Delhi's Favourite Family Carnival.",
            "You already know where you need to be. 👀",
          ].map((para, i) => (
            <p key={i} className="lp-desc-para">{para}</p>
          ))}
        </div>
      </section>

      {/* ── STICKY BOOK NOW BAR ── */}
      <div className={`lp-sticky${showStickyBar ? " lp-sticky--show" : ""}`}>
        <p className="lp-sticky-title">
          Disney Land Food Fest – The Happiest Food Festival 2.2
        </p>
        <button
          className="lp-sticky-btn"
          onClick={() => navigate("/form")}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
