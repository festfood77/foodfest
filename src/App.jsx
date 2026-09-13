import Form from "./Form";

export default function App() {
  return (
    /* Full-page gradient background */
    <div className="min-h-dvh bg-gradient-to-br from-surface-0 via-surface-50 to-surface-100 flex flex-col items-center px-4 py-10">

      {/* ── Card ── */}
      <div className="w-full max-w-md bg-surface-100/80 backdrop-blur-sm border border-edge-subtle rounded-[1.5rem] shadow-[0_8px_64px_rgba(0,0,0,0.6)] overflow-hidden">

        {/* ── Gradient accent bar at top ── */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-gold-400" />

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-6 px-6">

          {/* Icon placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-surface-200 border border-edge-mid flex items-center justify-center">
            {/* TODO: Replace with your event icon/logo */}
            <span className="text-2xl">🎬</span>
          </div>

          {/* Title placeholder */}
          <div className="text-center">
            {/* TODO: Replace with your event title */}
            <h1 className="text-2xl font-bold text-ink-heading tracking-tight leading-tight">
              Event Title Here
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Book your tickets in seconds
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-edge-mid to-transparent mt-2" />
        </div>

        {/* ── Form body ── */}
        <div className="px-6 pb-8">
          <Form />
        </div>

      </div>

      {/* ── Bottom badge ── */}
      <p className="mt-6 text-[11px] text-ink-muted text-center">
        Secured &amp; Powered by <span className="text-brand-400 font-semibold">YourBrand</span>
      </p>

    </div>
  );
}
