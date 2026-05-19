"use client";

import { motion } from "framer-motion";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ 
        type: "spring",
        stiffness: 380,
        damping: 30,
        opacity: { duration: 0.22, ease: "easeInOut" }
      }}
      className="relative z-10 w-full"
      style={{ maxWidth: "440px" }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 4px 40px rgba(11,33,63,0.08), 0 1px 3px rgba(11,33,63,0.06)",
          border: "1px solid rgba(232,234,240,0.8)",
          transition: "height 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
