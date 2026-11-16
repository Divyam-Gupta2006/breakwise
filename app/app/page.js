"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { saveSessionRecord } from "../../lib/storage";
import { playGentleChime } from "../../lib/audio";

const fmt = (n) => {
  const x = Math.max(n, 0);
  return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}`;
};

const C = 565.5; // 2 * PI * 90

const BREAK_CATEGORIES = {
  physical: [
    "Stand up, stretch your back, and roll your shoulders",
    "Drink a tall glass of cold water",
    "20-20-20: Look out a window at something 20 feet away for 20 seconds",
    "Quick 3-minute stroll around your room or hallway",
  ],
  mindful: [
    "Box breathing: 4s in, 4s hold, 4s out, 4s hold",
    "Close your eyes and listen to 5 distinct sounds around you",
    "Put your hand over your heart and take 3 deliberate breaths",
    "Jot down 2 things you feel grateful for on paper",
  ],
  unplugged: [
    "Doodle on a scrap piece of paper with no goal",
    "Wash your face with cool water",
    "Step outside or onto a balcony for fresh air",
    "Gently massage your temples and jaw",
  ],
};

const H = ({ h, children }) => <h2 ref={h} tabIndex={-1} style={{ outline: "none" }}>{children}</h2>;

const Chips = ({ label, name, opts, val, set, unit = "min" }) => (
  <fieldset>
    <legend>{label}</legend>
    <div className="chips">
      {opts.map((m) => (
        <label className="chip" key={m}>
          <input
            type="radio"
            name={name}
            checked={val === m}
            onChange={() => set(m)}
          />
          <span>{m} {unit}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

const Ring = ({ left, total, rest, isPaused }) => (
  <div className="ring" data-rest={rest}>
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle className="trk" cx="100" cy="100" r="90" />
      <circle
        className="prg"
        cx="100"
        cy="100"
        r="90"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - Math.max(left, 0) / Math.max(total, 1))}
        transform="rotate(-90 100 100)"
        style={rest ? { stroke: "var(--coral)" } : undefined}
      />
    </svg>
    <div role="timer" aria-label={`${fmt(left)} remaining`}>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span>{fmt(left)}</span>
        {isPaused && (
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--coral)" }}>
            PAUSED
          </span>
        )}
      </span>
    </div>
  </div>
);

export default function FocusPlannerPage() {
  const [s, setS] = useState("plan"); // plan -> focus -> break -> reflect -> done
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [len, setLen] = useState(25);
  const [brk, setBrk] = useState(5);
  const [left, setLeft] = useState(0);
  const [total, setTotal] = useState(1);
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("Steady");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [breakStyle, setBreakStyle] = useState("physical");

  const h = useRef(null);

  // Accessible focus management
  useEffect(() => {
    if (h.current) {
      h.current.focus();
    }
  }, [s]);

  // Timer countdown
  useEffect(() => {
    if ((s !== "focus" && s !== "break") || isPaused) return;

    const t = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [s, isPaused]);

  // Stage transition when timer hits 0
  useEffect(() => {
    if (left > 0) return;

    if (s === "focus") {
      if (soundEnabled) playGentleChime("focus-end");
      setS("break");
      setLeft(brk * 60);
      setTotal(brk * 60);
    } else if (s === "break") {
      if (soundEnabled) playGentleChime("break-end");
      setS("reflect");
    }
  }, [left, s, brk, soundEnabled]);

  const start = () => {
    if (!topic.trim()) {
      setErr("Enter what you will study (e.g., Organic Chemistry Chapter 3).");
      return;
    }
    setErr("");
    setIsPaused(false);
    setLeft(len * 60);
    setTotal(len * 60);
    setS("focus");
  };

  const handleSaveReflection = () => {
    saveSessionRecord({
      topic,
      goal,
      focusMinutes: len,
      breakMinutes: brk,
      mood: mood || "Steady",
      energy,
      notes,
    });
    setS("done");
  };

  const reset = () => {
    setTopic("");
    setGoal("");
    setMood("");
    setEnergy("Steady");
    setNotes("");
    setIsPaused(false);
    setS("plan");
  };

  return (
    <section className="tryhero">
      <div className="wrap try">
        <div>
          <div className="tag" style={{ marginBottom: 14 }}>Feature 1 &middot; Focus &amp; Rest</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.2vw, 3.2rem)" }}>
            Study deeply.<br />Rest on purpose.
          </h1>
          <p className="sub" style={{ fontSize: "1.1rem", marginTop: 14 }}>
            BreakWise pairs every period of focus with a deliberate, screen-free rest period. The break is already secured when you begin, preventing burnout and mindless doomscrolling.
          </p>

          <div style={{ marginTop: 32, display: "grid", gap: 14 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>🌿</span>
                <div>
                  <h4 style={{ margin: 0 }}>Planned Rest Guarantee</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "var(--mute)" }}>
                    You never negotiate your break during tired moments. It is locked into the schedule from minute zero.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>🔔</span>
                <div>
                  <h4 style={{ margin: 0 }}>Calm Harmonic Chimes</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "var(--mute)" }}>
                    Gentle Web Audio chimes cue transitions without startling alarms or jarring buzzers.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>🕊️</span>
                <div>
                  <h4 style={{ margin: 0 }}>Compassionate Reflections</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "0.92rem", color: "var(--mute)" }}>
                    Sessions are logged locally to your <Link href="/dashboard" style={{ textDecoration: "underline", color: "var(--mintd)", fontWeight: 700 }}>Habit Reflection Dashboard</Link> without shame or broken streak penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Interactive Phone Container */}
        <div className="phone">
          {s === "plan" && (
            <>
              <H h={h}>Plan your session</H>
              <label htmlFor="topic-input" style={{ fontWeight: 700 }}>
                What will you study?
              </label>
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Systems lecture notes"
                aria-describedby="err-msg"
              />
              <div id="err-msg" role="alert" className="err">{err}</div>

              <label htmlFor="goal-input" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Specific intention <span style={{ color: "var(--mute)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="goal-input"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Finish reading section 4.2 and solve 2 proofs"
              />

              <Chips
                label="Focus time"
                name="len"
                opts={[25, 45, 60]}
                val={len}
                set={setLen}
              />

              <Chips
                label="Rest interval after it"
                name="brk"
                opts={[5, 10, 15]}
                val={brk}
                set={setBrk}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <label style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span>Soft chime on transition</span>
                </label>
              </div>

              <div className="spacer" />
              <button className="btn mint" onClick={start}>
                Start Focus Session
              </button>
            </>
          )}

          {s === "focus" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="tag">Focusing</span>
                <span style={{ fontSize: "0.85rem", color: "var(--mute)" }}>
                  Break scheduled: {brk} min
                </span>
              </div>

              <H h={h}>{topic}</H>
              {goal && <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "var(--mute)" }}>"{goal}"</p>}

              <Ring left={left} total={total} isPaused={isPaused} />

              <div style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--mute)" }}>
                Rest is already booked. No need to watch the clock.
              </div>

              <div className="spacer" />
              <div className="row" style={{ justifyContent: "center" }}>
                <button
                  className="btn ghost sm"
                  onClick={() => setIsPaused(!isPaused)}
                  aria-label={isPaused ? "Resume focus timer" : "Pause focus timer"}
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
                <button
                  className="btn sm"
                  onClick={() => setLeft(0)}
                  title="Wrap up focus early and take your planned break"
                >
                  Take break now
                </button>
                <button
                  className="btn ghost sm"
                  onClick={() => setLeft(3)}
                  title="Fast forward for demo"
                >
                  Demo: 3s
                </button>
              </div>
            </>
          )}

          {s === "break" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="tag" style={{ background: "var(--coral)", color: "#fff" }}>
                  Planned Break
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--mute)" }}>
                  Step away from screens
                </span>
              </div>

              <H h={h}>Time to Unplug &amp; Recharge</H>

              <Ring left={left} total={total} rest isPaused={isPaused} />

              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <button
                    className={`tier-btn ${breakStyle === "physical" ? "active" : ""}`}
                    onClick={() => setBreakStyle("physical")}
                  >
                    Physical
                  </button>
                  <button
                    className={`tier-btn ${breakStyle === "mindful" ? "active" : ""}`}
                    onClick={() => setBreakStyle("mindful")}
                  >
                    Mindful
                  </button>
                  <button
                    className={`tier-btn ${breakStyle === "unplugged" ? "active" : ""}`}
                    onClick={() => setBreakStyle("unplugged")}
                  >
                    Unplugged
                  </button>
                </div>

                <ul className="ideas">
                  {BREAK_CATEGORIES[breakStyle].map((idea) => (
                    <li key={idea}>
                      <span aria-hidden="true">✓</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="spacer" />
              <div className="row" style={{ justifyContent: "center" }}>
                <button
                  className="btn sm"
                  onClick={() => setLeft(0)}
                >
                  I'm Refreshed &middot; Reflect
                </button>
                <button
                  className="btn ghost sm"
                  onClick={() => setLeft(3)}
                >
                  Demo: 3s
                </button>
              </div>
            </>
          )}

          {s === "reflect" && (
            <>
              <H h={h}>Gentle Reflection</H>
              <p style={{ fontSize: "0.95rem" }}>
                There are no wrong answers or scores. A distracted session is just information about your energy, not your character.
              </p>

              <fieldset>
                <legend>How did the focus feel?</legend>
                <div className="chips">
                  {["Focused", "Mixed", "Distracted"].map((m) => (
                    <label className="chip" key={m}>
                      <input
                        type="radio"
                        name="mood"
                        checked={mood === m}
                        onChange={() => setMood(m)}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>Your energy level</legend>
                <div className="chips">
                  {["High", "Steady", "Tired"].map((en) => (
                    <label className="chip" key={en}>
                      <input
                        type="radio"
                        name="energy"
                        checked={energy === en}
                        onChange={() => setEnergy(en)}
                      />
                      <span>{en}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="reflect-notes" style={{ fontWeight: 700, fontSize: "0.92rem", marginTop: 4 }}>
                Private thought <span style={{ color: "var(--mute)", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="reflect-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What helped or distracted you? Any win to acknowledge?"
                rows={2}
              />

              <div className="spacer" />
              <button
                className="btn mint"
                disabled={!mood}
                onClick={handleSaveReflection}
              >
                Save to Habit Reflection
              </button>
            </>
          )}

          {s === "done" && (
            <>
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: 8 }}>🌿</div>
                <H h={h}>Session Completed</H>
                <p style={{ marginTop: 8 }}>
                  You dedicated <b>{len} min</b> to <b>{topic}</b> and gave yourself <b>{brk} min</b> of intentional rest.
                </p>
                <div style={{ marginTop: 14 }}>
                  <span className="mood-pill focused">
                    Focus: {mood}
                  </span>
                  {" "}
                  <span className="mood-pill peaceful">
                    Energy: {energy}
                  </span>
                </div>
              </div>

              <div className="card" style={{ padding: 18, background: "var(--mist)", border: 0 }}>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--mute)" }}>
                  Saved to your private reflection record. You can review your study rhythm anytime on the dashboard.
                </p>
              </div>

              <div className="spacer" />
              <div className="row" style={{ flexDirection: "column", gap: 10 }}>
                <button className="btn mint" onClick={reset}>
                  Plan Another Session
                </button>
                <Link className="btn ghost" href="/dashboard">
                  View Habit Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
