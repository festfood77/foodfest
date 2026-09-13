import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationSubmitted() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-100 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-4 text-center rounded-[var(--radius-card)] border border-[#ecd9aa] bg-[#fffaf0] p-8 shadow-[0_16px_45px_rgba(111,56,23,0.14)] w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-300/20"
        >
          <CheckCircle2 size={40} className="text-brand-300" />
        </motion.div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-200">
          Application Submitted!
        </h2>
        <p className="mx-auto max-w-xs text-sm leading-6 text-[#8a715b]">
          Thank you for registering. You will receive audition details and all
          future updates via your registered email.
        </p>
      </motion.div>
    </div>
  );
}
