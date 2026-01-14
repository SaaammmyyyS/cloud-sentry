import React from 'react';

export default function Header({ status, totalDetected }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#020203]/60 border-b border-white/5 py-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

        {/* Left Section: Logo & Brand */}
        <div className="flex items-center gap-5">
          <Logo />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                status === "ACTIVE" ? "bg-red-500 animate-ping" :
                status === "ERROR" ? "bg-red-600" : "bg-emerald-500 animate-pulse"
              }`} />
              <span className="text-[9px] text-emerald-500 font-bold tracking-[0.3em] uppercase opacity-70">
                System_Status: {status}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Cloud<span className="text-emerald-500">Sentry</span>
              <span className="text-[10px] not-italic font-light text-slate-500 ml-2 tracking-widest lowercase opacity-40">v2.0.4</span>
            </h1>
          </div>
        </div>

        {/* Right Section: Counter */}
        <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-emerald-500/20 pl-4 md:pl-0 md:pr-4">
          <span className="block text-[9px] text-slate-500 uppercase tracking-[0.4em] mb-1">Total_Intercepts</span>
          <span className="text-5xl font-black text-white leading-none tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {totalDetected.toString().padStart(3, '0')}
          </span>
        </div>

      </div>
    </header>
  );
}

const Logo = () => (
  <div className="relative group">
    {/* Glow effect behind logo */}
    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />

    <div className="relative w-14 h-14 border border-emerald-500/40 flex items-center justify-center text-xl font-black text-emerald-500 bg-[#0a0a0c] overflow-hidden">
      {/* Internal Scanning Animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.1),transparent)] bg-[size:100%_20px] animate-scan" />
      CS
    </div>
  </div>
);