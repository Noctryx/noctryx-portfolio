import { useRef, useCallback } from "react";

/**
 * useRPGSounds — Web Audio API sound effects, zero dependencies.
 *
 * Usage:
 *   const { playClassSwitch, playQuestOpen, playSkillSelect, playLevelUp } = useRPGSounds();
 */
export function useRPGSounds() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ─── Core helpers ───────────────────────────────────────────────

  const playTone = useCallback(
    (frequency, type, duration, volume, delay = 0) => {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + delay + duration,
      );

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    },
    [getCtx],
  );

  const playNoise = useCallback(
    (duration, volume, filterFreq = 2000, delay = 0) => {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = filterFreq;
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + delay + duration,
      );

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(ctx.currentTime + delay);
      source.stop(ctx.currentTime + delay + duration + 0.05);
    },
    [getCtx],
  );

  // ─── Sound effects ──────────────────────────────────────────────

  /**
   * Class switch — ascending arpeggio whoosh.
   * Different chord per class to give each one a distinct feel.
   */
  const playClassSwitch = useCallback(
    (classKey = "GENERALIST") => {
      const chords = {
        GENERALIST: [261, 329, 392, 523], // C major — balanced
        SPECIALIST: [293, 370, 440, 587], // D major — bright/intelligent
        CRAFTSPERSON: [349, 440, 523, 698], // F major — warm/creative
        EXPLORER: [220, 277, 370, 440], // A minor — adventurous
      };

      const notes = chords[classKey] ?? chords.GENERALIST;

      // Whoosh noise first
      playNoise(0.18, 0.04, 1200);

      // Ascending arpeggio
      notes.forEach((freq, i) => {
        playTone(freq, "sine", 0.22, 0.06, i * 0.055);
      });

      // Harmonic overtone on top
      playTone(
        notes[notes.length - 1] * 2,
        "sine",
        0.3,
        0.025,
        notes.length * 0.055,
      );
    },
    [playTone, playNoise],
  );

  /**
   * Quest card open — deep thud + shimmer.
   */
  const playQuestOpen = useCallback(() => {
    // Low thud
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);

    // Shimmer
    playTone(880, "sine", 0.25, 0.03, 0.05);
    playTone(1320, "sine", 0.2, 0.02, 0.1);
  }, [getCtx, playTone]);

  /**
   * Skill select — crisp click + high ping.
   */
  const playSkillSelect = useCallback(() => {
    playNoise(0.06, 0.05, 3000);
    playTone(1046, "sine", 0.18, 0.04, 0.03);
    playTone(1568, "sine", 0.14, 0.025, 0.07);
  }, [playTone, playNoise]);

  /**
   * Skill deselect — descending two-tone.
   */
  const playSkillDeselect = useCallback(() => {
    playTone(880, "sine", 0.12, 0.04);
    playTone(659, "sine", 0.14, 0.035, 0.07);
  }, [playTone]);

  /**
   * Level up — triumphant fanfare. Use sparingly.
   */
  const playLevelUp = useCallback(() => {
    const fanfare = [523, 659, 784, 1046];
    fanfare.forEach((freq, i) => {
      playTone(freq, "square", 0.18, 0.035, i * 0.1);
    });
    // Final chord sustain
    playTone(1046, "sine", 0.5, 0.04, 0.45);
    playTone(784, "sine", 0.5, 0.03, 0.45);
    playTone(659, "sine", 0.5, 0.025, 0.45);
    playNoise(0.08, 0.03, 2000, 0.0);
  }, [playTone, playNoise]);

  /**
   * Nav click — subtle tick.
   */
  const playNavClick = useCallback(() => {
    playNoise(0.04, 0.03, 4000);
    playTone(698, "sine", 0.1, 0.03, 0.02);
  }, [playTone, playNoise]);

  return {
    playClassSwitch,
    playQuestOpen,
    playSkillSelect,
    playSkillDeselect,
    playLevelUp,
    playNavClick,
  };
}
