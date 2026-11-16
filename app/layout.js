import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "BreakWise - Digital Wellness & Mindful Study Companion",
  description: "Plan study sessions with built-in breaks, audit distracting notifications, practice mindful scrolling, and reflect on habits without guilt.",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        
        <header className="nav">
          <div className="wrap">
            <Link href="/" className="logo" aria-label="BreakWise home">
              <i aria-hidden="true" />
              <span>BreakWise</span>
            </Link>

            <nav className="links" aria-label="Main Navigation">
              <Link href="/app">Focus Planner</Link>
              <Link href="/audit">Notification Audit</Link>
              <Link href="/wind-down">Wind-Down & Scroll</Link>
              <Link href="/dashboard">Habit Reflection</Link>
              <Link className="btn mint sm" href="/app">Start Focus</Link>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer>
          <div className="wrap">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <b>BreakWise</b>
                <span className="tag" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>Private & Offline</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--mute)" }}>
                A digital wellness sanctuary for students and thinkers. Your habits are never judged, scored, or tracked online.
              </p>
            </div>
            <div className="f-links">
              <Link href="/app">Focus</Link>
              <Link href="/audit">Notifications</Link>
              <Link href="/wind-down">Wind-Down</Link>
              <Link href="/dashboard">Reflection</Link>
              <Link href="/#why">Philosophy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
