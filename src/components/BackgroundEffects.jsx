import React from "react";

const BackgroundEffects = ({ status }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-[#020203]" />

    {/* Dynamic Glow */}
    <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 opacity-20 ${
      status === "ACTIVE" ? "bg-red-500" : "bg-emerald-500"
    }`} />

    {/* Perspective Grid */}
    <div
      className="absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 10%, transparent 100%)',
        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2.5)',
        transformOrigin: 'top'
      }}
    />

    {/* Scanline */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="w-full h-[1px] bg-emerald-500/20 shadow-[0_0_15px_#10b981] animate-scanline" />
    </div>
  </div>
);

export default BackgroundEffects;