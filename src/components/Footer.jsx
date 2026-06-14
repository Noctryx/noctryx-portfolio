export const Footer = ({ isDark }) => {
  return (
    <footer
      className={`mt-16 border-t pt-10 pb-8 ${
        isDark ? "border-zinc-800" : "border-green-200/40"
      }`}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-green-400 mb-3">
            NOCTRYX
          </p>
          <p className="text-[var(--app-text)] text-lg font-semibold">
            NOCTRYX © 2026 • Crafted in the Realm of React 
          </p>
          <p className="text-[var(--app-text-muted)] mt-2 max-w-xl">
            A portfolio built as a living quest log, showcasing my journey as a developer. Each project is a quest, each skill a badge of honor, and every line of code a step forward in my adventure. This portfolio is not just a collection of work, but a narrative of growth,
            visible progression, and a direct path to collaboration.
          </p>
        </div>
      </div>
    </footer>
  );
};
