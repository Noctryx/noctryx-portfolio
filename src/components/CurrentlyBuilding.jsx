export const CurrentlyBuilding = ({ isDark = true }) => {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 backdrop-blur-xl ${
        isDark
          ? "border-green-400/20 bg-green-400/10"
          : "border-green-300/30 bg-green-50/80"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-green-400 mb-2">
        Active Quest
      </p>
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-[var(--app-text)] font-semibold">
          Building: buildwithvenky content system
        </p>
        <p className="text-[var(--app-text-muted)]">Stack: Instagram + AI</p>
      </div>
    </div>
  );
};
