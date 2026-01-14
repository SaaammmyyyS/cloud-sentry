import React from "react";
import { motion } from "framer-motion";

const ScanningState = () => (
  <div className="flex flex-col items-center justify-center py-32 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-xl relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-64 h-64 border border-emerald-500/10 rounded-full animate-[ping_3s_linear_infinite]" />
      <div className="w-96 h-96 border border-emerald-500/5 rounded-full animate-[ping_4s_linear_infinite]" />
    </div>

    <div className="relative mb-6">
      <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />
      </div>
    </div>

    <div className="text-center space-y-2 z-10">
      <h3 className="text-emerald-500 font-black text-xs tracking-[0.6em] uppercase animate-pulse">
        Active_Scan_In_Progress
      </h3>
      <p className="text-slate-500 text-[9px] uppercase tracking-[0.3em]">
        Waiting for incoming packets...
      </p>
    </div>
  </div>
);

export default ScanningState;