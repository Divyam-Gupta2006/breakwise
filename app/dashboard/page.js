"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStoredSessions,
  getStoredAudit,
  getStoredWindDown,
  getStoredReflections,
  saveReflectionRecord,
  deleteReflectionRecord,
} from "../../lib/storage";

const GENTLE_AFFIRMATIONS = [
  "Rest is not a reward you earn after exhausting yourself. It is a biological prerequisite for clear thinking.",
  "There are no broken streaks here. Life has natural rhythms of busy and calm. You are welcome here whenever you return.",
  "A distracted study session is not a moral failure—it is simply a signal that your mind is seeking recovery.",
  "Digital wellness isn't about throwing your phone in the ocean. It's about deciding when the door is open.",
];

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [audit, setAudit] = useState(null);
  const [windDown, setWindDown] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [dailyMood, setDailyMood] = useState("Balanced");
  const [joyNote, setJoyNote] = useState("");
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setSessions(getStoredSessions());
    setAudit(getStoredAudit());
    setWindDown(getStoredWindDown());
    setReflections(getStoredReflections());
    // Pick daily affirmation
    setAffirmationIdx(Math.floor(Math.random() * GENTLE_AFFIRMATIONS.length));
  }, []);

  const handleSaveCheckIn = () => {
    if (!joyNote.trim() && !dailyMood) return;

    const newRecords = saveReflectionRecord({
      type: "daily_checkin",
      mood: dailyMood,
      joyNote: joyNote.trim() || "Took time to breathe away from screens.",
    });

    setReflections(newRecords);
    setJoyNote("");
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id) => {
    const updated = deleteReflectionRecord(id);
    setReflections(updated);
  };

  // Aggregated Stats
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.focusMinutes || 0), 0);
  const totalBreakMinutes = sessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);

  // Silenced notifications estimate
  const silencedAppsCount = audit?.apps ? audit.apps.filter((a) => a.tier === "silence").length : 6;
  const auditHoursReclaimed = (silencedAppsCount * 1.8).toFixed(1);

  // Days active this week (last 7 days without judgment)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString([], { weekday: "short" });
    const dateStr = d.toISOString().split("T")[0];

    // Check if session or reflection on this day
    const hasActivity =
      sessions.some((s) => s.date && s.date.startsWith(dateStr)) ||
      reflections.some((r) => r.date && r.date.startsWith(dateStr));

    const isToday = i === 6;

    return { dayName, dateStr, hasActivity, isToday };
  });

  return (
    <section className="tryhero">
      <div className="wrap">
        <div style={{ maxWidth: 840, margin: "0 auto 36px", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 12 }}>Feature 4 &middot; Anti-Shame Habit Reflection</div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>Habit Reflection</h1>
          <p className="sub" style={{ fontSize: "1.15rem", margin: "14px auto 0" }}>
            No red marks. No lost streaks. No shame. A calm sanctuary to observe your focus, honor your need for rest, and cultivate self-compassion.
          </p>
        </div>

        {/* Calm Non-Judgmental Banner */}
        <div className="calm-banner">
          <div>
            <div className="calm-quote">
              &ldquo;{GENTLE_AFFIRMATIONS[affirmationIdx]}&rdquo;
            </div>
            <div className="calm-sub">The BreakWise Compassion Pledge</div>
          </div>
          <button
            className="btn ghost sm"
            onClick={() => setAffirmationIdx((affirmationIdx + 1) % GENTLE_AFFIRMATIONS.length)}
            style={{ flexShrink: 0 }}
          >
            New Perspective ✨
          </button>
        </div>

        {/* Metrics Row - Celebrating Both Focus AND Rest */}
        <div className="metrics-row">
          <div className="metric-box">
            <div className="val">{totalFocusMinutes}m</div>
            <div className="label">Intentional Focus</div>
            <div className="subtext">Honoring your curiosity</div>
          </div>

          <div className="metric-box" style={{ background: "var(--soft-coral)" }}>
            <div className="val" style={{ color: "var(--coral)" }}>{totalBreakMinutes}m</div>
            <div className="label">Planned Rest Taken</div>
            <div className="subtext" style={{ color: "var(--coral)" }}>Guilt-free recovery</div>
          </div>

          <div className="metric-box">
            <div className="val">~{auditHoursReclaimed}h</div>
            <div className="label">Weekly Peace Gained</div>
            <div className="subtext">{silencedAppsCount} apps quieted</div>
          </div>

          <div className="metric-box" style={{ background: "var(--soft-mint)" }}>
            <div className="val" style={{ color: "var(--mintd)" }}>
              {sessions.length + reflections.length}
            </div>
            <div className="label">Mindful Moments</div>
            <div className="subtext" style={{ color: "var(--mintd)" }}>Steps toward presence</div>
          </div>
        </div>

        {/* Weekly Organic Rhythm (Non-punitive) */}
        <div className="rhythm-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>Your Weekly Rhythm</h3>
              <p style={{ margin: "4px 0 0", color: "var(--mute)", fontSize: "0.9rem" }}>
                Notice the gentle ebb and flow. Empty days simply reflect other priorities in living.
              </p>
            </div>
            <span className="tag" style={{ background: "var(--mist)", color: "var(--ink)" }}>
              Streak-Free Zone 🕊️
            </span>
          </div>

          <div className="rhythm-week">
            {past7Days.map((day) => (
              <div
                key={day.dateStr}
                className={`rhythm-day ${day.hasActivity ? "active" : ""} ${day.isToday ? "today" : ""}`}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)" }}>
                  {day.dayName} {day.isToday && "(Today)"}
                </span>
                <div className="rhythm-dot" />
                <span style={{ fontSize: "0.75rem", color: "var(--mute)" }}>
                  {day.hasActivity ? "Present" : "Resting"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Daily Mindful Check-in & Recent Session History */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Daily Quick Reflection Form */}
          <div className="card" style={{ padding: 28 }}>
            <div className="tag" style={{ marginBottom: 12 }}>Daily Micro-Journal</div>
            <h3 style={{ margin: "0 0 10px" }}>How is your relationship with screens today?</h3>
            <p style={{ margin: "0 0 16px", color: "var(--mute)", fontSize: "0.92rem" }}>
              Take 30 seconds to capture how your mind felt today without judgment.
            </p>

            <fieldset>
              <legend>Today's Digital Vibe</legend>
              <div className="chips">
                {["Peaceful", "Balanced", "Frantic", "Tired", "Overloaded"].map((m) => (
                  <label className="chip" key={m}>
                    <input
                      type="radio"
                      name="dailyMood"
                      checked={dailyMood === m}
                      onChange={() => setDailyMood(m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div style={{ marginTop: 14 }}>
              <label htmlFor="joy-input" style={{ fontWeight: 700, display: "block", marginBottom: 6, fontSize: "0.92rem" }}>
                One offline joy today <span style={{ color: "var(--mute)", fontWeight: 400 }}>(a meal, sunlight, a breath)</span>
              </label>
              <input
                id="joy-input"
                type="text"
                value={joyNote}
                onChange={(e) => setJoyNote(e.target.value)}
                placeholder="e.g. Sipped tea outside in the sun with no headphones"
                onKeyDown={(e) => e.key === "Enter" && handleSaveCheckIn()}
              />
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn mint sm" onClick={handleSaveCheckIn}>
                Record Daily Thought
              </button>
              {savedNotice && (
                <span style={{ fontSize: "0.85rem", color: "var(--mintd)", fontWeight: 700 }}>
                  ✓ Recorded with love
                </span>
              )}
            </div>
          </div>

          {/* Recent History & Insights */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ margin: "0 0 12px" }}>Recent Reflections &amp; Focus Records</h3>

            {sessions.length === 0 && reflections.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--mute)" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>🌱</div>
                <p style={{ margin: 0, fontSize: "0.95rem" }}>
                  No sessions recorded yet today. Complete your first session in the{" "}
                  <Link href="/app" style={{ color: "var(--mintd)", fontWeight: 700, textDecoration: "underline" }}>
                    Focus Planner
                  </Link>{" "}
                  or write a daily micro-thought on the left.
                </p>
              </div>
            ) : (
              <div className="reflections-list">
                {/* Display recent sessions */}
                {sessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="reflection-card">
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span className="tag sm">Focus Session</span>
                        <b style={{ fontSize: "0.98rem" }}>{s.topic}</b>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--mute)" }}>
                        {s.focusMinutes}m focus &middot; {s.breakMinutes}m rest &middot; Energy: {s.energy || "Steady"}
                      </p>
                      {s.notes && (
                        <p style={{ margin: "6px 0 0", fontSize: "0.85rem", fontStyle: "italic", color: "var(--ink)" }}>
                          &ldquo;{s.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className={`mood-pill ${s.mood ? s.mood.toLowerCase() : "focused"}`}>
                      {s.mood || "Focused"}
                    </span>
                  </div>
                ))}

                {/* Display recent daily check-ins */}
                {reflections.slice(0, 4).map((r) => (
                  <div key={r.id} className="reflection-card">
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span className="tag" style={{ background: "var(--sand)", border: "1px solid var(--line)", color: "var(--ink)" }}>
                          Offline Joy
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "var(--mute)" }}>
                          {new Date(r.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--ink)" }}>
                        {r.joyNote}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="mood-pill peaceful">
                        {r.mood}
                      </span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{ background: "transparent", border: 0, color: "var(--mute)", cursor: "pointer", fontSize: "1.1rem" }}
                        title="Delete reflection"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link className="btn ghost sm" href="/app">
                + New Focus Session
              </Link>
              <Link className="btn ghost sm" href="/wind-down">
                🌙 Wind Down Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
