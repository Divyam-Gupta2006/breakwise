"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredWindDown, saveWindDownRecord } from "../../lib/storage";
import { playGentleChime } from "../../lib/audio";

const SCROLL_INTENTIONS = [
  { id: "habit", label: "Pure habit / reflex", tip: "Place your phone face down for 60 seconds first." },
  { id: "boredom", label: "Feeling bored or restless", tip: "Boredom is the birthplace of creativity. Try 2 minutes of daydreaming." },
  { id: "avoidance", label: "Avoiding a difficult task", tip: "Shrink the task: just do 2 minutes of it right now." },
  { id: "lonely", label: "Seeking connection", tip: "Call or text one specific friend directly instead of scrolling strangers." },
  { id: "specific", label: "Looking for specific information", tip: "Find the answer, then deliberately set the device down." },
];

const ALTERNATIVE_SWAPS = [
  { ic: "💧", title: "Cold water reset", text: "Drink a tall glass of ice water and feel the temperature sensation." },
  { ic: "🌳", title: "Look far away", text: "Stare at the furthest tree, building, or cloud for 30 full seconds." },
  { ic: "🧘", title: "Spine decompression", text: "Interlace your fingers behind your back and open your chest." },
  { ic: "📖", title: "One page reading", text: "Read a single page of an analog book or paper magazine." },
];

export default function WindDownPage() {
  const [tab, setTab] = useState("scroll"); // 'scroll' or 'bedtime'

  // Mindful Scrolling State
  const [breathPhase, setBreathPhase] = useState("idle"); // idle, inhale, hold, exhale
  const [breathCount, setBreathCount] = useState(3);
  const [selectedIntention, setSelectedIntention] = useState(null);
  const [scrollTimerActive, setScrollTimerActive] = useState(false);
  const [scrollTimerSeconds, setScrollTimerSeconds] = useState(300); // 5 min
  const [scrollLeft, setScrollLeft] = useState(300);

  // Bedtime Wind-Down State
  const [wakeTime, setWakeTime] = useState("07:00");
  const [rituals, setRituals] = useState([
    { id: "screen", label: "Digital Curfew: Screen off & phone charging away from the bed", done: false, time: "T-60 min" },
    { id: "dump", label: "Tomorrow's Brain Dump: Write down 3 key priorities to clear mental loops", done: false, time: "T-45 min" },
    { id: "dim", label: "Dim the lights: Warm ambient lighting only (no overhead LEDs)", done: false, time: "T-30 min" },
    { id: "tea", label: "Warm drink or herbal chamomile tea", done: false, time: "T-20 min" },
    { id: "read", label: "Read physical paper book or magazine (no backlit screens)", done: false, time: "T-15 min" },
    { id: "cool", label: "Cool bedroom temperature (~18-19°C / 65-67°F) for deep sleep", done: false, time: "T-5 min" },
  ]);

  useEffect(() => {
    const saved = getStoredWindDown();
    if (saved) {
      if (saved.wakeTime) setWakeTime(saved.wakeTime);
      if (saved.rituals) setRituals(saved.rituals);
    }
  }, []);

  // Breathing cycle animation
  useEffect(() => {
    if (breathPhase === "idle") return;

    let timer;
    if (breathPhase === "inhale") {
      timer = setTimeout(() => setBreathPhase("hold"), 4000);
    } else if (breathPhase === "hold") {
      timer = setTimeout(() => setBreathPhase("exhale"), 3000);
    } else if (breathPhase === "exhale") {
      timer = setTimeout(() => {
        if (breathCount > 1) {
          setBreathCount((c) => c - 1);
          setBreathPhase("inhale");
        } else {
          setBreathPhase("done");
          playGentleChime("focus-end");
        }
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [breathPhase, breathCount]);

  const startBreathing = () => {
    setBreathCount(3);
    setBreathPhase("inhale");
  };

  // Scroll limit timer countdown
  useEffect(() => {
    if (!scrollTimerActive) return;

    const interval = setInterval(() => {
      setScrollLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setScrollTimerActive(false);
          playGentleChime("break-end");
          alert("Gentle Reminder: Your planned scrolling time is complete. Take a breath and step away.");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [scrollTimerActive]);

  const startScrollTimer = (seconds) => {
    setScrollTimerSeconds(seconds);
    setScrollLeft(seconds);
    setScrollTimerActive(true);
  };

  // Bedtime Calculations: 5 cycles of 90 min = 7.5 hrs + 15 min to fall asleep = 465 mins
  const calculateSleepSchedule = () => {
    const [h, m] = wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    // Bedtime = Wake time - 7 hours 45 minutes
    const bedDate = new Date(wakeDate.getTime() - (7 * 60 + 45) * 60000);
    // Wind down starts 60 min before bed
    const windDownDate = new Date(bedDate.getTime() - 60 * 60000);

    const fmtTime = (d) =>
      d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

    return {
      windDownTime: fmtTime(windDownDate),
      bedTime: fmtTime(bedDate),
      wakeDisplay: fmtTime(wakeDate),
    };
  };

  const schedule = calculateSleepSchedule();

  const toggleRitual = (id) => {
    const updated = rituals.map((r) => (r.id === id ? { ...r, done: !r.done } : r));
    setRituals(updated);
    saveWindDownRecord({ wakeTime, rituals: updated });
  };

  const handleWakeTimeChange = (newVal) => {
    setWakeTime(newVal);
    saveWindDownRecord({ wakeTime: newVal, rituals });
  };

  const resetRituals = () => {
    const reset = rituals.map((r) => ({ ...r, done: false }));
    setRituals(reset);
    saveWindDownRecord({ wakeTime, rituals: reset });
  };

  return (
    <section className="tryhero">
      <div className="wrap">
        <div style={{ maxWidth: 760, margin: "0 auto 36px", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 12 }}>Feature 3 &middot; Mindful Tech Boundaries</div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>Wind-Down &amp; Scrolling Pause</h1>
          <p className="sub" style={{ fontSize: "1.15rem", margin: "14px auto 0" }}>
            Friction is kindness. Take a conscious 3-breath pause before losing yourself in an endless feed, or plan a serene evening transition into restful sleep.
          </p>

          <div className="tab-pills" style={{ marginTop: 24 }}>
            <button
              className={`tab-pill ${tab === "scroll" ? "active" : ""}`}
              onClick={() => setTab("scroll")}
            >
              📱 Mindful Scrolling Pause
            </button>
            <button
              className={`tab-pill ${tab === "bedtime" ? "active" : ""}`}
              onClick={() => setTab("bedtime")}
            >
              🌙 Bedtime Wind-Down Ritual
            </button>
          </div>
        </div>

        {tab === "scroll" ? (
          /* Mindful Scrolling Section */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
            {/* The 3-Breath Pause Card */}
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <div className="tag" style={{ marginBottom: 14 }}>The 3-Breath Pause</div>
              <h2 style={{ fontSize: "1.5rem" }}>Break the Dopamine Loop</h2>
              <p style={{ margin: "10px 0 0", color: "var(--mute)", fontSize: "0.95rem" }}>
                Before opening social media or a video feed, give your prefrontal cortex 30 seconds to catch up with your thumb.
              </p>

              <div className="breathe-container">
                <div
                  className={`breathe-circle ${
                    breathPhase === "inhale"
                      ? "inhale"
                      : breathPhase === "exhale"
                      ? "exhale"
                      : ""
                  }`}
                >
                  <div className="breathe-text">
                    {breathPhase === "idle" && "Ready?"}
                    {breathPhase === "inhale" && "Inhale..."}
                    {breathPhase === "hold" && "Hold gently..."}
                    {breathPhase === "exhale" && "Exhale slowly..."}
                    {breathPhase === "done" && "Centered ✨"}
                  </div>
                </div>

                <div style={{ minHeight: 30, color: "var(--mute)", fontSize: "0.95rem", fontWeight: 600 }}>
                  {breathPhase !== "idle" && breathPhase !== "done" && (
                    <span>Breaths remaining: {breathCount}</span>
                  )}
                  {breathPhase === "done" && (
                    <span style={{ color: "var(--mintd)" }}>You took space before reacting. Great job!</span>
                  )}
                </div>

                <div style={{ marginTop: 20 }}>
                  <button
                    className="btn mint"
                    onClick={startBreathing}
                    disabled={breathPhase !== "idle" && breathPhase !== "done"}
                  >
                    {breathPhase === "idle" ? "Start 3-Breath Pause" : "Breathe Again"}
                  </button>
                </div>
              </div>

              {/* Set a Gentle Scrolling Timer */}
              <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 20, textAlign: "left" }}>
                <h4 style={{ margin: "0 0 10px" }}>Or Set a Conscious Scrolling Cap</h4>
                <p style={{ margin: "0 0 14px", fontSize: "0.88rem", color: "var(--mute)" }}>
                  If you choose to browse, set a container so you don't lose an hour accidentally.
                </p>

                <div className="row">
                  <button
                    className={`btn sm ${scrollTimerActive && scrollTimerSeconds === 300 ? "mint" : "ghost"}`}
                    onClick={() => startScrollTimer(300)}
                  >
                    5 min limit
                  </button>
                  <button
                    className={`btn sm ${scrollTimerActive && scrollTimerSeconds === 600 ? "mint" : "ghost"}`}
                    onClick={() => startScrollTimer(600)}
                  >
                    10 min limit
                  </button>
                  <button
                    className={`btn sm ${scrollTimerActive && scrollTimerSeconds === 900 ? "mint" : "ghost"}`}
                    onClick={() => startScrollTimer(900)}
                  >
                    15 min limit
                  </button>
                </div>

                {scrollTimerActive && (
                  <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--soft-coral)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                      ⏳ Time Remaining: {Math.floor(scrollLeft / 60)}:{String(scrollLeft % 60).padStart(2, "0")}
                    </span>
                    <button
                      className="btn ghost sm"
                      style={{ padding: "0 10px", minHeight: 32 }}
                      onClick={() => setScrollTimerActive(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Intention Check & Healthy Swaps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card" style={{ padding: 26 }}>
                <h3 style={{ margin: "0 0 12px" }}>Why Did You Pick Up Your Device?</h3>
                <p style={{ margin: "0 0 16px", color: "var(--mute)", fontSize: "0.92rem" }}>
                  Name the emotion without judging it. Awareness dissolves the compulsion.
                </p>

                <div style={{ display: "grid", gap: 8 }}>
                  {SCROLL_INTENTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIntention(item)}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        borderRadius: 14,
                        border: selectedIntention?.id === item.id ? "2px solid var(--ink)" : "1px solid var(--line)",
                        background: selectedIntention?.id === item.id ? "var(--mist)" : "#fff",
                        font: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {selectedIntention && (
                  <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--soft-mint)", borderRadius: 14, borderLeft: "4px solid var(--mint)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--mintd)" }}>Gentle Guidance</div>
                    <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--ink)" }}>
                      {selectedIntention.tip}
                    </p>
                  </div>
                )}
              </div>

              {/* Instant Screen-Free Swaps */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ margin: "0 0 12px" }}>Quick Screen-Free Swaps</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {ALTERNATIVE_SWAPS.map((swap) => (
                    <div key={swap.title} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: "1.4rem" }}>{swap.ic}</span>
                      <div>
                        <b style={{ fontSize: "0.95rem" }}>{swap.title}</b>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--mute)" }}>{swap.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Bedtime Wind-Down Section */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
            {/* Wind-Down Timeline Calculator */}
            <div className="card" style={{ padding: 32 }}>
              <div className="tag" style={{ marginBottom: 14 }}>Optimal Circadian Rhythm</div>
              <h2 style={{ fontSize: "1.5rem" }}>Sleep Cycle Calculator</h2>
              <p style={{ margin: "10px 0 20px", color: "var(--mute)", fontSize: "0.95rem" }}>
                Human sleep occurs in natural 90-minute ultradian cycles. Waking at the end of a cycle lets you wake up energized rather than groggy.
              </p>

              <div style={{ marginBottom: 24 }}>
                <label htmlFor="wake-input" style={{ fontWeight: 700, display: "block", marginBottom: 8 }}>
                  When do you need to wake up tomorrow?
                </label>
                <input
                  id="wake-input"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => handleWakeTimeChange(e.target.value)}
                  style={{ maxWidth: 220, fontSize: "1.2rem", fontWeight: 700 }}
                />
              </div>

              {/* Calculated Milestones */}
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ padding: "16px 20px", borderRadius: 16, background: "var(--soft-coral)", border: "1px solid #FFD3C4" }}>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 800, color: "var(--coral)" }}>
                    Step 1 &middot; {schedule.windDownTime}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2 }}>Begin Wind-Down Curfew</div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--mute)" }}>
                    Turn off primary screens. Blue light halts melatonin release; give your brain 60 minutes of darkness.
                  </p>
                </div>

                <div style={{ padding: "16px 20px", borderRadius: 16, background: "var(--mist)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 800, color: "var(--ink)" }}>
                    Step 2 &middot; {schedule.bedTime}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2 }}>Lights Out &amp; In Bed</div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--mute)" }}>
                    Allows ~15 minutes of calm drifting off + 5 full 90-minute sleep cycles (7.5 hours of deep recovery).
                  </p>
                </div>

                <div style={{ padding: "16px 20px", borderRadius: 16, background: "var(--soft-mint)", border: "1px solid #C4F0E4" }}>
                  <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 800, color: "var(--mintd)" }}>
                    Step 3 &middot; {schedule.wakeDisplay}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: 2 }}>Natural Awakening</div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--mute)" }}>
                    Wake up right at the conclusion of your REM cycle with minimal sleep inertia.
                  </p>
                </div>
              </div>
            </div>

            {/* Tonight's Checklist */}
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Tonight's Wind-Down Ritual</h3>
                  <p style={{ margin: "4px 0 0", color: "var(--mute)", fontSize: "0.88rem" }}>
                    Check off steps as you glide toward bedtime.
                  </p>
                </div>
                <button className="btn ghost sm" onClick={resetRituals} title="Reset ritual items for a new night">
                  Reset
                </button>
              </div>

              <div>
                {rituals.map((r) => (
                  <div
                    key={r.id}
                    className={`ritual-item ${r.done ? "checked" : ""}`}
                    onClick={() => toggleRitual(r.id)}
                  >
                    <div className="ritual-checkbox">
                      {r.done && <span style={{ fontWeight: 800, fontSize: "0.8rem" }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", textDecoration: r.done ? "line-through" : "none" }}>
                          {r.label}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--mute)", fontWeight: 600 }}>
                          {r.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--mute)", margin: "0 0 16px" }}>
                  Completed tonight: <b>{rituals.filter((r) => r.done).length} / {rituals.length}</b> steps
                </p>
                <Link className="btn mint sm" href="/dashboard">
                  Reflect on Habits in Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
