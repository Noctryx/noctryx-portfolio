import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function MobileNav({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        size="sm"
        className="!min-w-[70px] !h-[52px] hover:text-green-400 hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-screen w-64 bg-black border-l border-zinc-900 z-50 flex flex-col pt-20 px-6"
            >
              <nav className="flex flex-col gap-6">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => handleNavClick(section.id)}
                    className={
                      activeSection === section.id
                        ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] text-lg font-semibold"
                        : "text-zinc-400 hover:text-green-400 cursor-pointer text-lg"
                    }
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
