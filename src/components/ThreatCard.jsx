import React, { useMemo } from 'react';

export default function ThreatCard({ threat }) {
  const isCritical = threat.severity === "CRITICAL";
  const isHigh = threat.severity === "HIGH";

  const aiData = useMemo(() => {
    if (!threat.ai_analysis || threat.ai_analysis === "Pending...") return null;
    try {
      if (typeof threat.ai_analysis === 'object') return threat.ai_analysis;
      let cleanStr = threat.ai_analysis.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanStr.indexOf('{');
      const lastBrace = cleanStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanStr = cleanStr.substring(firstBrace, lastBrace + 1);
      }
      return JSON.parse(cleanStr);
    } catch (e) {
      return {
        summary: typeof threat.ai_analysis === 'string' ? threat.ai_analysis : "Parsing error",
        action: "Check logs for raw signature."
      };
    }
  }, [threat.ai_analysis]);

  const statusColor = isCritical ? "text-red-500" : isHigh ? "text-orange-500" : "text-emerald-500";
  const borderColor = isCritical ? "border-red-500/30" : isHigh ? "border-orange-500/30" : "border-emerald-500/20";
  const glowShadow = isCritical ? "shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "shadow-none";

  return (
    <div className={`relative mb-4 sm:mb-6 rounded-sm border ${borderColor} bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-black/60 ${glowShadow}`}>
      {isCritical && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(239,68,68,0)_50%,rgba(239,68,68,0.05)_50%)] bg-[size:100%_4px] animate-pulse opacity-50" />
      )}

      <div className="p-4 sm:p-6 relative z-10">
        {/* Header Section: Stack on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-1 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${statusColor} shadow-[0_0_8px_currentColor] animate-ping`} />
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Origin_IP</p>
            </div>
            <p className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${statusColor} break-all`}>
              {threat.sourceIp}
            </p>
          </div>

          <div className="flex-1 w-full sm:min-w-[140px] space-y-1 sm:border-l border-white/10 sm:pl-6">
            <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Target_Asset</p>
            <p className="text-sm sm:text-md font-bold text-orange-400/90 tracking-tight truncate uppercase">
              {threat.target_resource || "Global_Edge_Router"}
            </p>
          </div>

          <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
            <div className={`px-3 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-tighter rounded-sm border ${borderColor} ${statusColor} bg-black/50`}>
              {threat.severity} // LVL_{threat.severity?.substring(0,3)}
            </div>
            <p className="text-[10px] text-slate-600 sm:mt-2 font-mono tabular-nums">
              {new Date(threat.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Info Grid: 1 column on tiny screens, 2 columns on tablets+ */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
           <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Vector_Type</p>
              <p className="text-xs sm:text-sm text-slate-200 font-bold uppercase tracking-tight truncate">{threat.type}</p>
           </div>
           <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Geolocation</p>
              <p className="text-xs sm:text-sm text-emerald-500/80 italic font-medium truncate">{threat.location || "Satellite_Active"}</p>
           </div>
        </div>

        {/* AI Analysis Section */}
        <div className="relative group/ai">
          <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />
          <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-sm p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Neural_Analysis</p>
            </div>

            {aiData ? (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium italic">
                  "{aiData.summary}"
                </p>

                {aiData.action && (
                  <div className="pt-3 border-t border-emerald-500/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="w-fit text-[8px] sm:text-[9px] font-black text-orange-500 uppercase border border-orange-500/30 px-1.5 py-0.5 rounded-sm bg-orange-500/5">
                      Countermeasure
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                      {aiData.action}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-1">
                <div className="h-1 w-16 sm:w-24 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40 w-1/2 animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-[9px] text-slate-600 animate-pulse italic uppercase">Synthesizing...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}