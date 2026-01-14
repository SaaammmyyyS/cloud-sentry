import React from 'react';

export default function ThreatCard({ threat }) {
  const isCritical = threat.severity === "CRITICAL";
  const isHigh = threat.severity === "HIGH";

  const timeLabel = new Date(threat.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className={`group relative rounded-lg border overflow-hidden transition-all duration-300
      ${isCritical
        ? "border-red-500/50 bg-red-500/[0.03] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
        : "border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]"}
    `}>

      {isCritical && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(239,68,68,0.05)_50%,transparent_100%)] bg-[size:100%_4px] animate-scan" />
      )}

      <div className={`absolute left-0 top-0 h-full w-[2px] transition-all duration-500
        ${isCritical ? "bg-red-500 shadow-[0_0_15px_#ef4444]" : "bg-emerald-500/40 group-hover:bg-emerald-500"}`}
      />

      <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
        <div className="flex-1 min-w-[140px] space-y-1">
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Source_IP</p>
          <p className={`text-xl font-bold tabular-nums ${isCritical ? "text-red-400" : "text-white"}`}>
            {threat.sourceIp}
          </p>
        </div>

        <div className="flex-1 min-w-[140px] space-y-1 border-l border-white/5 pl-4 md:pl-6">
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Attack_Type</p>
          <p className="text-lg font-medium text-slate-200 truncate">{threat.type}</p>
        </div>

        <div className="flex-1 min-w-[140px] space-y-1 border-l border-white/5 pl-4 md:pl-6">
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Origin_Location</p>
          <p className={`text-lg font-medium truncate ${!threat.location ? "text-slate-500 animate-pulse italic" : "text-emerald-500/80"}`}>
            {threat.location || "Detecting..."}
          </p>
        </div>

        <div className="text-right flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 ml-auto">
           <span className={`px-2 py-0.5 text-[9px] font-black tracking-tighter uppercase rounded
             ${isCritical ? "bg-red-500 text-white animate-pulse" :
               isHigh ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
               "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
             {threat.severity}
           </span>
           <span className="text-[10px] text-slate-600 font-mono italic">{timeLabel}</span>
        </div>
      </div>
    </div>
  );
}