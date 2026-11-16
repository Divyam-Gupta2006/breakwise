"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredAudit, saveAuditRecord } from "../../lib/storage";

const DEFAULT_APPS = [
  { id: "phone", name: "Phone & VIP Contacts", category: "People", tier: "immediate", defaultAlerts: 12, icon: "📞" },
  { id: "sms", name: "SMS / Two-Factor Auth", category: "People", tier: "immediate", defaultAlerts: 15, icon: "💬" },
  { id: "whatsapp", name: "WhatsApp / Direct Chats", category: "Messaging", tier: "batch", defaultAlerts: 45, icon: "🟢" },
  { id: "slack", name: "Slack / Teams", category: "Work", tier: "batch", defaultAlerts: 35, icon: "💼" },
  { id: "gmail", name: "Email (Gmail / Outlook)", category: "Work", tier: "batch", defaultAlerts: 28, icon: "✉️" },
  { id: "instagram", name: "Instagram", category: "Social", tier: "silence", defaultAlerts: 40, icon: "📸" },
  { id: "tiktok", name: "TikTok / Shorts", category: "Social", tier: "silence", defaultAlerts: 30, icon: "🎵" },
  { id: "x", name: "X (Twitter)", category: "Social", tier: "silence", defaultAlerts: 25, icon: "🐦" },
  { id: "news", name: "Breaking News Apps", category: "News", tier: "silence", defaultAlerts: 18, icon: "📰" },
  { id: "shopping", name: "Shopping & Food Delivery Deals", category: "Promotions", tier: "silence", defaultAlerts: 22, icon: "🛍️" },
];

export default function NotificationAuditPage() {
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [activeGuide, setActiveGuide] = useState("ios");
  const [copied, setCopied] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    const saved = getStoredAudit();
    if (saved && saved.apps && saved.apps.length > 0) {
      setApps(saved.apps);
    }
  }, []);

  const handleTierChange = (id, newTier) => {
    const updated = apps.map((app) =>
      app.id === id ? { ...app, tier: newTier } : app
    );
    setApps(updated);
    saveAuditRecord({ apps: updated, lastUpdated: new Date().toISOString() });
  };

  const addCustomApp = () => {
    if (!newAppName.trim()) return;
    const newApp = {
      id: "app_" + Date.now(),
      name: newAppName.trim(),
      category: "Custom",
      tier: "batch",
      defaultAlerts: 20,
      icon: "📱",
    };
    const updated = [...apps, newApp];
    setApps(updated);
    setNewAppName("");
    saveAuditRecord({ apps: updated, lastUpdated: new Date().toISOString() });
  };

  // Calculations
  const totalBaseAlerts = apps.reduce((acc, a) => acc + a.defaultAlerts, 0);
  const immediateAlerts = apps
    .filter((a) => a.tier === "immediate")
    .reduce((acc, a) => acc + Math.round(a.defaultAlerts * 0.7), 0);
  const batchAlerts = apps
    .filter((a) => a.tier === "batch")
    .length * 3; // 2 to 3 digest deliveries per day
  const silencedCount = apps.filter((a) => a.tier === "silence").length;
  const currentDailyAlerts = immediateAlerts + batchAlerts;
  const dailyAlertsPrevented = Math.max(0, totalBaseAlerts - currentDailyAlerts);
  const reclaimedHoursWeekly = ((dailyAlertsPrevented * 1.5) / 60 * 7).toFixed(1);

  const copyManifesto = () => {
    const immediateList = apps.filter((a) => a.tier === "immediate").map((a) => a.name).join(", ") || "None";
    const batchList = apps.filter((a) => a.tier === "batch").map((a) => a.name).join(", ") || "None";
    const silencedList = apps.filter((a) => a.tier === "silence").map((a) => a.name).join(", ") || "None";

    const text = `BreakWise Notification Audit:\n\n` +
      `🚨 Immediate (Real-time Only):\n${immediateList}\n\n` +
      `📦 Scheduled Digest (Checked 1-2x daily):\n${batchList}\n\n` +
      `🔕 Silenced (No lock screen or badge banners):\n${silencedList}\n\n` +
      `Reclaimed Focus: ~${reclaimedHoursWeekly} hrs/week saved.`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const categories = ["all", "People", "Messaging", "Work", "Social", "News", "Promotions", "Custom"];
  const filteredApps = filterCat === "all" ? apps : apps.filter((a) => a.category.toLowerCase() === filterCat.toLowerCase());

  return (
    <section className="tryhero">
      <div className="wrap">
        <div style={{ maxWidth: 840, margin: "0 auto 40px", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 12 }}>Feature 2 &middot; Intentional Attention</div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>Notification Audit</h1>
          <p className="sub" style={{ fontSize: "1.15rem", margin: "14px auto 0" }}>
            Every alert on your screen is an open doorway for someone else to steal your train of thought. Audit your apps into three clear tiers and reclaim quiet focus.
          </p>
        </div>

        {/* Meter Stats */}
        <div className="meter-card" style={{ maxWidth: 960, margin: "0 auto 36px" }}>
          <div>
            <div className="meter-num" style={{ color: "var(--coral)" }}>
              {dailyAlertsPrevented}
            </div>
            <div className="meter-label">Alerts silenced per day</div>
          </div>
          <div>
            <div className="meter-num" style={{ color: "var(--mintd)" }}>
              ~{reclaimedHoursWeekly} hrs
            </div>
            <div className="meter-label">Deep focus time saved / week</div>
          </div>
          <div>
            <div className="meter-num">
              {silencedCount} / {apps.length}
            </div>
            <div className="meter-label">Apps completely de-noised</div>
          </div>
        </div>

        {/* Audit Tool Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 36, alignItems: "start" }}>
          {/* Apps Table */}
          <div className="audit-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: "1.4rem" }}>Triage Your Apps</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`tier-btn ${filterCat === c ? "active" : ""}`}
                    onClick={() => setFilterCat(c)}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              {filteredApps.map((app) => (
                <div className="app-row" key={app.id}>
                  <div className="app-info">
                    <span className="app-ic" aria-hidden="true">{app.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.98rem" }}>{app.name}</div>
                      <span style={{ fontSize: "0.8rem", color: "var(--mute)" }}>
                        {app.category} &middot; ~{app.defaultAlerts} pings/day
                      </span>
                    </div>
                  </div>

                  <div className="tier-selector">
                    <button
                      className={`tier-btn ${app.tier === "immediate" ? "active" : ""}`}
                      data-tier="immediate"
                      onClick={() => handleTierChange(app.id, "immediate")}
                      title="Only urgent calls & VIP contacts"
                    >
                      Immediate
                    </button>
                    <button
                      className={`tier-btn ${app.tier === "batch" ? "active" : ""}`}
                      data-tier="batch"
                      onClick={() => handleTierChange(app.id, "batch")}
                      title="Deliver in a scheduled digest 1-2x daily"
                    >
                      Digest
                    </button>
                    <button
                      className={`tier-btn ${app.tier === "silence" ? "active" : ""}`}
                      data-tier="silence"
                      onClick={() => handleTierChange(app.id, "silence")}
                      title="Turn off lock screen banners & badges"
                    >
                      Mute
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom App */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <input
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="Audit another app (e.g. Discord, Duolingo, BeReal)..."
                onKeyDown={(e) => e.key === "Enter" && addCustomApp()}
              />
              <button className="btn mint sm" onClick={addCustomApp}>
                Add App
              </button>
            </div>
          </div>

          {/* Guidelines & Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Tier Legend */}
            <div className="card" style={{ padding: 24 }}>
              <h3>The 3-Tier Rule of Thumb</h3>
              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="tag" style={{ background: "var(--coral)", color: "#fff", height: "fit-content" }}>Immediate</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--mute)" }}>
                    <b>Human emergencies only.</b> If someone is in hospital or stranded. SMS, direct calls from 3-5 favorite contacts.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="tag" style={{ background: "#F1C40F", color: "#111", height: "fit-content" }}>Digest</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--mute)" }}>
                    <b>Non-urgent conversations.</b> WhatsApp, work Slack, and newsletters. Batched at noon and 6 PM.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="tag" style={{ background: "var(--mint)", color: "var(--ink)", height: "fit-content" }}>Mute</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--mute)" }}>
                    <b>Algorithmic bait.</b> Likes, comments, trending topics, sales pitches. Check only when YOU decide to open them.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step OS Implementation */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Apply to Your Phone</h3>
                <div className="tab-pills" style={{ margin: 0 }}>
                  <button
                    className={`tab-pill ${activeGuide === "ios" ? "active" : ""}`}
                    onClick={() => setActiveGuide("ios")}
                  >
                    iOS
                  </button>
                  <button
                    className={`tab-pill ${activeGuide === "android" ? "active" : ""}`}
                    onClick={() => setActiveGuide("android")}
                  >
                    Android
                  </button>
                </div>
              </div>

              {activeGuide === "ios" ? (
                <ol style={{ paddingLeft: 18, margin: 0, fontSize: "0.9rem", color: "var(--mute)", lineHeight: 1.6 }}>
                  <li>Open <b>Settings &rarr; Notifications &rarr; Scheduled Summary</b>. Add your social and shopping apps for 12:00 and 18:00 delivery.</li>
                  <li>Go to <b>Settings &rarr; Focus</b>. Configure a "Study" focus that only allows calls from your "Favorites" list.</li>
                  <li>Disable <b>Notification Badges</b> (red dots) for Instagram, YouTube, and news apps to stop passive compulsion.</li>
                </ol>
              ) : (
                <ol style={{ paddingLeft: 18, margin: 0, fontSize: "0.9rem", color: "var(--mute)", lineHeight: 1.6 }}>
                  <li>Open <b>Settings &rarr; Digital Wellbeing &rarr; Focus Mode</b>. Set your work and study hours to pause distracting apps.</li>
                  <li>Go to <b>Settings &rarr; Sound &rarr; Do Not Disturb &rarr; People</b>. Allow messages/calls only from starred contacts.</li>
                  <li>Long press any non-urgent app icon &rarr; <b>App info &rarr; Notifications</b> &rarr; toggle off marketing channels.</li>
                </ol>
              )}

              <div style={{ marginTop: 20 }}>
                <button
                  className="btn sm"
                  style={{ width: "100%" }}
                  onClick={copyManifesto}
                >
                  {copied ? "✓ Copied to Clipboard!" : "📋 Copy My Audit Summary"}
                </button>
              </div>
            </div>

            {/* Direct Link to Reflection */}
            <div className="card" style={{ padding: 20, background: "var(--mist)", border: 0 }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--mute)" }}>
                Your notification setup is saved locally. Notice how much calmer your study sessions feel on your{" "}
                <Link href="/dashboard" style={{ fontWeight: 700, color: "var(--ink)", textDecoration: "underline" }}>
                  Habit Reflection Dashboard
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
