const FeedDivider = ({ title }) => (
  <div className="flex items-center gap-3 sm:gap-4 text-emerald-500/80 mb-6 sm:mb-8">
    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
      {title}
    </span>
    <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 to-transparent" />
  </div>
);
export default FeedDivider;