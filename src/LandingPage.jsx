import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-dvh bg-brand-100 overflow-y-auto flex justify-center">
      <div className="w-full max-w-md relative bg-surface-0 shadow-xl h-max">
        <img
          src="/landing_page2.avif"
          alt="Landing Page"
          className="w-full h-auto block"
        />

        {/* Button overlaid on the image placeholder */}
        <div className="absolute mt-7 left-0 w-full flex justify-center px-8">
          <button
            onClick={() => navigate("/form")}
            className="w-full bg-brand-300 hover:bg-brand-200 text-surface-0 font-bold text-xl py-4 rounded-pill shadow-lg active:scale-95 transition-all"
          >
            Register Now →
          </button>
        </div>
      </div>
    </div>
  );
}
