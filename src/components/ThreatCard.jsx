import React, { useMemo } from 'react';

export default function ThreatCard({ threat }) {
  const isCritical = threat.severity === "CRITICAL";
  const isHigh = threat.severity === "HIGH";

  const aiData = useMemo(() => {
    if (!threat.ai_analysis || threat.ai_analysis === "Pending...") return null;
    try {
      const cleanJson = typeof threat.ai_analysis === 'string'
        ? threat.ai_analysis.replace(/'/g, '"')
        : threat.ai_analysis;
      return typeof cleanJson === 'string' ? JSON.parse(cleanJson) : cleanJson;
    } catch (e) {
      return { summary: threat.ai_analysis };
    }
  }, [threat.ai_analysis]);

  const statusColor = isCritical ? "text-red-500" : isHigh ? "text-orange-500" : "text-emerald-500";
  const borderColor = isCritical ? "border-red-500/30" : isHigh ? "border-orange-500/30" : "border-emerald-500/20";
  const glowShadow = isCritical ? "shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "shadow-none";

  return (
    <div className={`relative mb-6 rounded-sm border ${borderColor} bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-black/60 ${glowShadow}`}>

      {isCritical && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(239,68,68,0)_50%,rgba(239,68,68,0.05)_50%)] bg-[size:100%_4px] animate-pulse opacity-50" />
      )}

      <div className="p-6 relative z-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${statusColor} shadow-[0_0_8px_currentColor] animate-ping`} />
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Secure_Origin_Link</p>
            </div>
            <p className={`text-2xl font-black font-mono tracking-tight ${statusColor}`}>
              {threat.sourceIp}
            </p>
          </div>


          <div className="flex-1 min-w-[140px] space-y-1 border-l border-white/5 pl-4 md:pl-6">
            <p className="text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">Target_Asset</p>
            <p className="text-md font-bold text-orange-400/90 tracking-tight truncate uppercase">
              {threat.target_resource || "Global_Edge_Router"}
            </p>
          </div>

          <div className="text-right">
            <div className={`inline-block px-3 py-0.5 text-[11px] font-black uppercase tracking-tighter rounded-sm border ${borderColor} ${statusColor} bg-black/50`}>
              {threat.severity} // LVL_{threat.severity?.substring(0,3)}
            </div>
            <p className="text-[10px] text-slate-600 mt-2 font-mono tabular-nums">
              {new Date(threat.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5 group hover:border-white/10 transition-colors">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Vector_Type</p>
              <p className="text-sm text-slate-200 font-bold uppercase tracking-tight">{threat.type}</p>
           </div>
           <div className="bg-white/[0.02] p-3 rounded-sm border border-white/5 group hover:border-white/10 transition-colors">
              <p className="text-[9px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Geolocation</p>
              <p className="text-sm text-emerald-500/80 italic font-medium">{threat.location || "Satellite_Link_Active..."}</p>
           </div>
        </div>

        {/* AI Analysis Block */}
        <div className="relative group/ai">
          <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />

          <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-sm p-4 hover:bg-emerald-500/[0.04] transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Neural_Analysis_Feed</p>
            </div>

            {aiData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                    "{aiData.summary}"
                  </p>
                </div>

                {aiData.action && (
                  <div className="pt-3 border-t border-emerald-500/10 flex items-center gap-3">
                    <span className="text-[9px] font-black text-orange-500 uppercase border border-orange-500/30 px-1.5 py-0.5 rounded-sm bg-orange-500/5">
                      Countermeasure
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono font-medium">
                      {aiData.action}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500/40 w-1/2 animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-[10px] text-slate-600 animate-pulse italic uppercase tracking-widest">Synthesizing intelligence...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}