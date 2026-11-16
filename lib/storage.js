// Storage helper for BreakWise non-judgmental habits and preferences
const SESSIONS_KEY = "breakwise_sessions";
const AUDIT_KEY = "breakwise_audit";
const WINDDOWN_KEY = "breakwise_winddown";
const REFLECTIONS_KEY = "breakwise_reflections";

export const getStoredSessions = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveSessionRecord = (session) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredSessions();
    const updated = [
      {
        id: "sess_" + Date.now(),
        date: new Date().toISOString(),
        ...session,
      },
      ...existing,
    ].slice(0, 50); // keep recent 50
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredAudit = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const saveAuditRecord = (auditData) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditData));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredWindDown = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WINDDOWN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const saveWindDownRecord = (data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WINDDOWN_KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredReflections = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveReflectionRecord = (reflection) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredReflections();
    const updated = [
      {
        id: "ref_" + Date.now(),
        date: new Date().toISOString(),
        ...reflection,
      },
      ...existing,
    ].slice(0, 100);
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const deleteReflectionRecord = (id) => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredReflections();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
};
