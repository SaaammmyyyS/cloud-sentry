const BackgroundEffects = ({ status }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-[#020203]" />
    <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] rounded-full blur-[80px] sm:blur-[120px] transition-colors duration-1000 opacity-20 ${
      status === "ACTIVE" ? "bg-red-500" : "bg-emerald-500"
    }`} />
    <div className="absolute inset-0 opacity-[0.08] sm:opacity-[0.12]"
      style={{
        backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 10%, transparent 100%)',
        transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2.5)',
        transformOrigin: 'top'
      }}
    />
  </div>
);
export default BackgroundEffects;