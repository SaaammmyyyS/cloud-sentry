const ScanningState = () => (
  <div className="flex flex-col items-center justify-center py-16 sm:py-32 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-xl relative overflow-hidden">
    <div className="relative mb-6">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
    <div className="text-center space-y-2 z-10 px-4">
      <h3 className="text-emerald-500 font-black text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase animate-pulse">
        Active_Scan_In_Progress
      </h3>
      <p className="text-slate-500 text-[8px] sm:text-[9px] uppercase tracking-[0.2em]">
        Waiting for incoming packets...
      </p>
    </div>
  </div>
);
export default ScanningState;