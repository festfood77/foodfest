import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationSubmitted() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-100 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <h2 className="font-cinzel text-2xl font-bold text-white">
          Application Submitted!
        </h2>
        <p className="mx-auto max-w-xs text-sm text-gray-400">
          Thank you for registering. You will receive audition details and all
          future updates via your registered email.
        </p>
      </motion.div>
    </div>
  );
}
