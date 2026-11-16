import Link from "next/link";

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const FEATURES = [
  {
    icon: "⏱",
    title: "Focus & Planned Breaks",
    desc: "Lock in your break before starting. Screen-free suggestions wait for you when the timer rings.",
    link: "/app",
    cta: "Open Planner",
    tag: "Core Tool",
  },
  {
    icon: "🔕",
    title: "Notification Audit",
    desc: "Triage your alerts into Immediate, Scheduled Digest, or Muted. Reclaim uninterrupted cognitive hours.",
    link: "/audit",
    cta: "Audit Alerts",
    tag: "Attention Guard",
  },
  {
    icon: "🌙",
    title: "Wind-Down & Scroll Pause",
    desc: "A 3-breath pause before endless feeds, plus a circadian sleep calculator to drift off peacefully.",
    link: "/wind-down",
    cta: "Explore Rituals",
    tag: "Boundaries",
  },
  {
    icon: "🕊️",
    title: "Anti-Shame Habit Reflection",
    desc: "No broken streaks, no red guilt badges. Track how focus feels and honor natural ebbs and flows.",
    link: "/dashboard",
    cta: "View Dashboard",
    tag: "Sanctuary",
  },
];

const STEPS = [
  ["1. Plan with Rest", "Name what you want to learn and decide both your focus length and your screen-free break length upfront."],
  ["2. Guard Your Attention", "Mute algorithmic noise with the notification audit so your study bubble stays unbroken."],
  ["3. Pause Before Scrolling", "Take a 3-breath micro-pause or use the bedtime wind-down calculator when evening arrives."],
  ["4. Reflect Without Guilt", "Log how you felt in one word. Distracted sessions are treated with compassion, not punishment."],
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="tag" style={{ marginBottom: 14 }}>A Calm Digital Wellness Sanctuary</div>
            <h1>
              Study hard.<br />
              Rest on purpose.
            </h1>
            <p className="lead">
              BreakWise pairs focused study with guaranteed breaks, audits distracting notifications, pauses mindless doomscrolling, and provides a shame-free reflection space.
            </p>
            <div className="row">
              <Link className="btn mint" href="/app">
                Start a Focus Session
              </Link>
              <Link className="btn ghost" href="/audit">
                Audit Notifications
              </Link>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 20, fontSize: "0.9rem", color: "var(--mute)" }}>
              <span>✓ 100% Private in Browser</span>
              <span>✓ No Streaks or Guilt</span>
              <span>✓ Zero Account Required</span>
            </div>
          </div>

          <div className="photo">
            <img
              src={U("photo-1522202176988-66273c2fd55f")}
              alt="Students studying peacefully together at a table"
            />
            <div className="float">
              <div>
                <span className="tag">Focus Session</span>
                <div><b>25:00</b></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="tag" style={{ background: "var(--coral)", color: "#fff" }}>
                  Planned Break
                </span>
                <div><b>5:00</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="s" id="features">
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <h2>Four Pillars of Digital Calm</h2>
            <p className="sub" style={{ margin: "14px auto 0" }}>
              Purpose-built tools designed to protect your attention from morning study to evening sleep.
            </p>
          </div>

          <div className="grid4">
            {FEATURES.map((f) => (
              <div className="card" key={f.title} style={{ justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div className="ic" aria-hidden="true">{f.icon}</div>
                    <span className="tag" style={{ fontSize: "0.75rem", padding: "2px 8px", background: "var(--sand)", border: "1px solid var(--line)" }}>
                      {f.tag}
                    </span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>

                <div style={{ marginTop: 24 }}>
                  <Link className="btn ghost sm" href={f.link} style={{ width: "100%" }}>
                    {f.cta} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Split Section */}
      <section className="s" id="why" style={{ background: "var(--mist)" }}>
        <div className="wrap">
          <div className="split">
            <div className="photo">
              <img
                src={U("photo-1499750310107-5fef28a66643")}
                alt="Laptop and notebook on an uncluttered workspace"
              />
            </div>
            <div>
              <div className="tag" style={{ marginBottom: 12 }}>Guaranteed Downtime</div>
              <h2>Long study sessions require real, unplugged rest</h2>
              <p className="sub">
                Most students plan what to study, but leave breaks to chance. Unplanned breaks drift into feeds, leaving you more cognitively depleted than before. Planning the rest before starting ensures true restoration.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn mint sm" href="/app">
                  Try Focus &amp; Rest
                </Link>
              </div>
            </div>
          </div>

          <div className="split rev" style={{ marginTop: 72 }}>
            <div className="photo">
              <img
                src={U("photo-1506126613408-eca07ce68773")}
                alt="Person taking a deep stretch and relaxing peacefully"
              />
            </div>
            <div>
              <div className="tag" style={{ marginBottom: 12, background: "var(--coral)", color: "#fff" }}>
                Anti-Shame Design
              </div>
              <h2>Reflection without shame or broken streaks</h2>
              <p className="sub">
                Life is not a continuous uninterrupted streak. Bad days, fatigue, and distraction are normal human signals. BreakWise gives you a gentle space to check in with how you feel—never penalizing you with guilt.
              </p>
              <div style={{ marginTop: 20 }}>
                <Link className="btn ghost sm" href="/dashboard">
                  Explore Habit Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works 4-Steps */}
      <section className="s" id="how">
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <h2>A Simple, Humane System</h2>
            <p className="sub" style={{ margin: "12px auto 0" }}>
              How BreakWise works together as your daily focus and downtime companion.
            </p>
          </div>

          <div className="steps">
            {STEPS.map(([title, desc]) => (
              <div className="step" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="s" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="band">
            <img
              src={U("photo-1434030216411-0b793f4b4173")}
              alt="Person writing notes quietly in a cozy library"
            />
            <div className="in">
              <h2>Ready for your first calm session?</h2>
              <p className="sub">
                No sign-up required. Completely private in your browser.
              </p>
              <div className="row" style={{ marginTop: 24 }}>
                <Link className="btn mint" href="/app">
                  Start Focus Session
                </Link>
                <Link className="btn ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }} href="/audit">
                  Audit Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
