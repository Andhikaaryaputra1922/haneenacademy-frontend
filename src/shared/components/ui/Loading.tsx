"use client";

import React from "react";

type LoadingProps = {
  mode?: "full" | "overlay" | "inline";
  message?: string;
};

export default function Loading({ mode = "full", message = "Memuat data..." }: LoadingProps) {
  const spinnerMarkup = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Premium Navy and Gold Double Ring Spinner */}
      <div className="relative h-16 w-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-[#D4AF37] animate-spin" />
        
        {/* Inner Ring (Reversed spin) */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#0B213F] animate-spin [animation-duration:1s] [animation-direction:reverse] opacity-80" />
        
        {/* Core Pulsing Dot */}
        <div className="absolute inset-[18px] rounded-full bg-gradient-to-tr from-[#0B213F] to-[#16335a] flex items-center justify-center shadow-inner animate-pulse" />
      </div>
      
      {/* Sleek message with subtle letter-spacing */}
      {message && (
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0B213F] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (mode === "full") {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/70 backdrop-blur-md transition-all duration-300">
        {spinnerMarkup}
      </div>
    );
  }

  if (mode === "overlay") {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl transition-all duration-300">
        {spinnerMarkup}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-slate-100 border-t-[#D4AF37] animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-[#0B213F] animate-spin [animation-duration:0.8s] [animation-direction:reverse]" />
      </div>
    </div>
  );
}
