import pfp from "./assets/pfp.png";
import { useRPGSounds } from "./hooks/useRPGSounds";
import { ParticleConstellation } from "./components/ParticleConstellation";
import { BossIntro } from "./components/BossIntro";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import { MobileNav } from "./components/MobileNav";
import { TypedText } from "./components/TypedText";
import { SkillFilter } from "./components/SkillFilter";
import { ContactForm } from "./components/ContactForm";
import { ToastContainer } from "./components/Toast";
import { ParallaxSection } from "./components/ParallaxSection";
import { CharacterSheet } from "./components/CharacterSheet";
import { AchievementBadge } from "./components/AchievementBadge";
import { QuestLog } from "./components/QuestLog";
import { StatsCard } from "./components/StatsCard";
import { ArcaneButton } from "./components/ArcaneButton";
import { Footer } from "./components/Footer";
import { CurrentlyBuilding } from "./components/CurrentlyBuilding";
import { copyToClipboard } from "./utils/copyToClipboard";
import { CLASSES } from "./data/classes";
import { SKILL_GROUPS } from "./data/skills";
import { PROJECTS } from "./data/projects";
import { ACHIEVEMENTS } from "./data/achievements";
import { calculateTotalXP } from "./utils/levelingSystem";
import { FiGithub, FiLinkedin, FiMail, FiInstagram } from "react-icons/fi";

import inventoryIcon from "./assets/inventory-backpack.svg";

export default function NoctryxPortfolio() {
  const { isDark } = useTheme();
  const { playClassSwitch, playQuestOpen, playSkillSelect, playSkillDeselect } =
    useRPGSounds();
  const [activeSection, setActiveSection] = useState("about");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedClass, setSelectedClass] = useState("GENERALIST");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [introComplete, setIntroComplete] = useState(false);

  const classConfig = CLASSES[selectedClass] ?? CLASSES.GENERALIST;

  const orderedProjects = [...PROJECTS].sort((left, right) => {
    const leftPriority = classConfig.projectPriority.indexOf(left.title);
    const rightPriority = classConfig.projectPriority.indexOf(right.title);
    return (
      (leftPriority === -1 ? 999 : leftPriority) -
      (rightPriority === -1 ? 999 : rightPriority)
    );
  });

  const filteredProjects = selectedSkill
    ? orderedProjects.filter((project) =>
        project.skills.includes(selectedSkill),
      )
    : orderedProjects;

  const orderedSkills = SKILL_GROUPS.map((group) => ({
    ...group,
    skills: [...group.skills].sort((left, right) => {
      const leftPriority = classConfig.skillPriority.indexOf(left);
      const rightPriority = classConfig.skillPriority.indexOf(right);
      return (
        (leftPriority === -1 ? 999 : leftPriority) -
        (rightPriority === -1 ? 999 : rightPriority)
      );
    }),
  }));

  const totalXP = calculateTotalXP(orderedProjects, ACHIEVEMENTS);
  const featuredProject =
    orderedProjects.find(
      (project) => project.title === classConfig.featuredProject,
    ) ?? orderedProjects[0];

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const nav = document.querySelector("nav");
    const offset = nav ? nav.offsetHeight + 20 : 88;
    const targetY =
      element.getBoundingClientRect().top + window.scrollY - offset;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 560;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTime = null;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "skills", "projects", "experience", "contact"];
      const scrollPos = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const selector = 'a, button, input, textarea, select, [role="button"]';
    const handleHoverOver = (e) => {
      const el =
        e.target && e.target.closest ? e.target.closest(selector) : null;
      setIsHoveringInteractive(Boolean(el));
    };
    const handleHoverOut = () => {
      setIsHoveringInteractive(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleHoverOver);
    window.addEventListener("mouseout", handleHoverOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleHoverOver);
      window.removeEventListener("mouseout", handleHoverOut);
    };
  }, []);

  const traits = [
    {
      title: "Steadfast Resolve",
      text: "Operates with a disciplined focus, turning abstract ideas into usable systems without abandoning the quest halfway.",
    },
    {
      title: "Adaptive Intellect",
      text: "Moves seamlessly between frontend polish, backend logic, and AI-assisted workflows when the problem requires all three.",
    },
    {
      title: "Proven Execution",
      text: "Backed by hackathon victories, successful internships, and shipped projects that serve as proof of consistent delivery.",
    },
  ];

  return (
    <>
      {!introComplete && (
        <BossIntro onComplete={() => setIntroComplete(true)} />
      )}
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] overflow-x-hidden relative px-6 md:px-20 py-20 font-sans scroll-smooth cursor-none">
        <ParticleConstellation mousePosition={mousePosition} />
        <motion.div
          className="fixed top-0 left-0 w-36 h-36 rounded-full bg-green-400/8 blur-[60px] pointer-events-none z-0"
          animate={{ x: mousePosition.x - 72, y: mousePosition.y - 72 }}
          transition={{ type: "spring", stiffness: 35, damping: 25, mass: 0.8 }}
        />

        {/* Custom cursor circle */}
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 md:w-3 md:h-3 rounded-full border border-green-400/90 bg-transparent pointer-events-none z-[99999]"
          animate={{
            x: mousePosition.x - 6,
            y: mousePosition.y - 6,
            scale: isHoveringInteractive ? 3.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />

        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_30%)]" />

        <ParallaxSection offset={30}>
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/5 blur-3xl rounded-full" />
        </ParallaxSection>

        <ParallaxSection offset={40}>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-400/5 blur-3xl rounded-full" />
        </ParallaxSection>

        <div className="fixed right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
          <div className="w-[2px] h-20 bg-zinc-700" />

          <a
            href="https://github.com/Noctryx"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-green-400 hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] hover:-translate-y-1 transition text-sm tracking-widest uppercase"
          >
            <FiGithub className="w-5 h-5" />
          </a>

          <a
            href="https://linkedin.com/in/venky1418"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-green-400 hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] hover:-translate-y-1 transition text-sm tracking-widest uppercase"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>

          <button
            onClick={() =>
              copyToClipboard("venky14182007@gmail.com", () =>
                addToast("Email copied!"),
              )
            }
            className="p-2 text-zinc-400 hover:text-green-400 hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] hover:-translate-y-1 transition text-sm tracking-widest uppercase"
          >
            <FiMail className="w-5 h-5" />
          </button>

          <a
            href="https://www.instagram.com/__its.srii__/"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-green-400 hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] hover:-translate-y-1 transition text-sm tracking-widest uppercase"
          >
            <FiInstagram className="w-5 h-5" />
          </a>

          <div className="w-[2px] h-20 bg-zinc-700" />
        </div>

        <nav className="fixed top-0 left-0 w-full px-6 md:px-20 py-6 flex justify-between items-center border-b border-zinc-900 bg-black/70 backdrop-blur-xl z-50">
          <h1 className="text-2xl font-bold tracking-wider text-green-400">
            NOCTRYX
          </h1>

          <div className="hidden md:flex gap-8 text-[var(--app-text-muted)]">
            {[
              ["about", "About"],
              ["skills", "Skills"],
              ["projects", "Projects"],
              ["experience", "Experience"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  smoothScrollTo(id);
                }}
                className={
                  activeSection === id
                    ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "hover:text-green-400 cursor-pointer"
                }
              >
                {label}
              </a>
            ))}
          </div>

          <MobileNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </nav>

        <motion.section
          id="about"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative grid lg:grid-cols-[1fr_0.9fr] gap-12 items-start min-h-[82vh] mt-20"
        >
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-5">
              <p className="text-green-400 tracking-[0.3em] text-sm uppercase">
                • AI EXPLORER • PRODUCT BUILDER
              </p>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-2xl">
                <TypedText text="P Venkata Srinivas" />
              </h1>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedClass}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="space-y-5"
                >
                  <p className="text-2xl text-[var(--app-text)] leading-relaxed max-w-2xl">
                    {classConfig.heroIntro}{" "}
                    <span className="text-green-400">
                      {classConfig.heroHighlight}
                    </span>{" "}
                    {classConfig.heroTagline}
                  </p>
                  <p className="text-lg max-w-2xl leading-relaxed text-[var(--app-text-muted)]">
                    {classConfig.heroSubline}
                  </p>
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-[var(--app-text)]">
                    <span className="text-green-400 font-semibold">
                      Featured Quest
                    </span>
                    <span>{featuredProject.title}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-[0_0_30px_rgba(34,197,94,0.12)] aspect-[16/10]"
              role="img"
              aria-label="Portrait placeholder for profile photo"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_45%),linear-gradient(135deg,rgba(9,9,11,0.95),rgba(24,24,27,0.92))]" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
                <img
                  src={pfp}
                  alt="Profile"
                  className="rounded-2xl max-h-full"
                />
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <ArcaneButton
                onClick={() => smoothScrollTo("projects")}
                type="button"
              >
                Enter Quest Log
              </ArcaneButton>
              <ArcaneButton
                as="a"
                href="/P_Venkata_Srinivas_Resume.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                Adventurer's Insignia
              </ArcaneButton>
              <ArcaneButton
                onClick={() => smoothScrollTo("contact")}
                type="button"
              >
                Send a Raven
              </ArcaneButton>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(34,197,94,0.08)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-green-400 mb-3">
                Choose Your Class
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(CLASSES).map(([key, classData]) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedClass(key);
                      playClassSwitch(key);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedClass === key
                        ? "border-green-400 bg-green-400/15 shadow-[0_0_14px_rgba(34,197,94,0.28)]"
                        : "border-zinc-800 bg-black/20 hover:border-green-400/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center py-1">
                      <span className="text-2xl">{classData.icon}</span>
                      <p className="text-sm font-semibold text-[var(--app-text)]">
                        {classData.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-green-400/80">
                        {key === "GENERALIST" ? "Core" : "Spec"}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <CurrentlyBuilding isDark={isDark} />

            <CharacterSheet isDark={isDark} selectedClass={selectedClass} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative py-10 grid md:grid-cols-3 gap-6"
        >
          {traits.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl p-6 border bg-zinc-900/70 border-zinc-800 shadow-xl hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(34,197,94,0.12)] transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-[var(--app-text)]">
                {item.title}
              </h3>
              <p className="text-[var(--app-text-muted)] leading-relaxed text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </motion.section>

        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative py-20 space-y-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-10">
              <img src={inventoryIcon} alt="Inventory" className="w-16 h-16" />
              <h2 className="text-4xl font-bold text-[var(--app-text)]">
                Inventory
              </h2>
            </div>
            <SkillFilter
              skills={orderedSkills}
              selectedSkill={selectedSkill}
              onSelectSkill={(skill) => {
                setSelectedSkill(skill);
                if (skill) playSkillSelect();
                else playSkillDeselect();
              }}
              selectedClass={classConfig}
            />
          </div>
        </motion.section>

        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative py-20"
        >
          <QuestLog
            key={selectedSkill ?? "all"}
            isDark={isDark}
            projects={filteredProjects}
            selectedSkill={selectedSkill}
            onClearFilter={() => setSelectedSkill(null)}
            onQuestOpen={playQuestOpen}
          />
        </motion.section>

        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative py-20"
        >
          <div className="space-y-10">
            <StatsCard
              isDark={isDark}
              selectedClass={selectedClass}
              totalXP={totalXP}
            />
            <AchievementBadge isDark={isDark} />
          </div>
        </motion.section>

        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative py-20 border-t border-zinc-800 mt-10"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-[var(--app-text)]">
              📩 Form a Party, Adventurer!
            </h2>
            <p className="mb-8 text-zinc-400 max-w-2xl">
              Ready to collaborate? Open to internships, technical networking,
              and building the future together.
            </p>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
              <div className="rounded-3xl p-8 border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-6 text-green-400">
                  Guild Channels
                </h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  Choose a channel below if you'd rather skip the scroll and
                  reach me directly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <ArcaneButton
                    as="a"
                    href="https://github.com/Noctryx"
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                    className="!min-w-[180px]"
                  >
                    GitHub
                  </ArcaneButton>
                  <ArcaneButton
                    as="a"
                    href="https://linkedin.com/in/venky1418"
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                    className="!min-w-[180px]"
                  >
                    LinkedIn
                  </ArcaneButton>
                  <ArcaneButton
                    as="a"
                    href="mailto:venky14182007@gmail.com"
                    size="sm"
                    className="!min-w-[180px]"
                  >
                    Email Me
                  </ArcaneButton>
                  <ArcaneButton
                    as="a"
                    href="https://www.instagram.com/__its.srii__/"
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                    className="!min-w-[180px]"
                  >
                    Instagram
                  </ArcaneButton>
                </div>
              </div>

              <div className="rounded-3xl p-8 border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold mb-6 text-green-400">
                  Send a Raven
                </h3>
                <ContactForm onSuccess={() => addToast("Message sent! 🎉")} />
              </div>
            </div>
          </div>
        </motion.section>

        <Footer isDark={isDark} />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </>
  );
}
