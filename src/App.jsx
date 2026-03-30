import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  location: "ep_v22_location",
  alerts: "ep_v22_alerts",
  mode: "ep_v22_mode",
  manualThreat: "ep_v22_manualThreat",
  intelOutput: "ep_v22_intelOutput",
  itineraryOutput: "ep_v22_itineraryOutput",
};

const LOCATIONS = ["Rolex Rodeo", "Patek Rodeo", "Rolex Century City"];
const ALERT_CATEGORIES = [
  "Local Crime",
  "Local Alert",
  "Suspicious Activity",
  "Traffic / Movement",
];
const ALERT_LEVELS = ["Low", "Medium", "High"];
const VISIBILITY_LEVELS = ["Low", "Moderate", "High", "Very High"];

const COLORS = {
  bg: "#07111f",
  panel: "#0d1b2e",
  panelAlt: "#11233a",
  border: "#31445f",
  softBorder: "#22324b",
  text: "#f3f6fb",
  muted: "#b7c2d1",
  soft: "#8fa0b7",
  gold: "#d4af37",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  blue: "#60a5fa",
};

function getSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function formatTimestamp(date = new Date()) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function levelColor(level) {
  if (level === "High" || level === "HIGH") return COLORS.red;
  if (level === "Medium" || level === "MEDIUM") return COLORS.amber;
  return COLORS.green;
}

const styles = {
  page: {
    background: `linear-gradient(180deg, ${COLORS.bg} 0%, #081524 100%)`,
    color: COLORS.text,
    minHeight: "100vh",
    padding: "18px 14px 42px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  appShell: {
    maxWidth: "860px",
    margin: "0 auto",
  },
  titleWrap: {
    textAlign: "center",
    marginBottom: "18px",
  },
  title: {
    fontSize: "30px",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    marginBottom: "6px",
  },
  subtitle: {
    color: COLORS.gold,
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  tabRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  tabButton: {
    padding: "11px 16px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.panelAlt,
    color: COLORS.text,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
    boxShadow: "0 4px 18px rgba(0,0,0,.16)",
  },
  tabButtonActive: {
    padding: "11px 16px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.gold}`,
    background: "linear-gradient(180deg, #1a2d47 0%, #14253b 100%)",
    color: "#fff7de",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 800,
    boxShadow: "0 8px 24px rgba(0,0,0,.22)",
  },
  section: {
    marginTop: "18px",
  },
  panel: {
    background: `linear-gradient(180deg, ${COLORS.panel} 0%, #0a1627 100%)`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "20px",
    padding: "16px",
    boxShadow: "0 12px 34px rgba(0,0,0,.28)",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "14px",
    letterSpacing: "-0.02em",
  },
  subHeader: {
    fontSize: "12px",
    color: COLORS.gold,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontWeight: 700,
    marginBottom: "8px",
  },
  fieldLabel: {
    fontSize: "12px",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.softBorder}`,
    background: "#0b1728",
    color: COLORS.text,
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "12px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "94px",
    padding: "13px 14px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.softBorder}`,
    background: "#0b1728",
    color: COLORS.text,
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "12px",
    resize: "vertical",
    outline: "none",
  },
  btn: {
    padding: "12px 16px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.panelAlt,
    color: COLORS.text,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
  },
  btnPrimary: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.gold}`,
    background: `linear-gradient(180deg, ${COLORS.gold} 0%, #b98b1e 100%)`,
    color: "#111827",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 800,
    boxShadow: "0 10px 24px rgba(212,175,55,.18)",
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "8px",
  },
  threatNumber: {
    fontSize: "72px",
    fontWeight: 900,
    textAlign: "center",
    lineHeight: 1,
    marginBottom: "10px",
    letterSpacing: "-0.04em",
  },
  modeText: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: "15px",
    marginTop: "10px",
  },
  summaryGrid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "1fr",
    marginTop: "14px",
  },
  summaryCard: {
    background: "rgba(255,255,255,0.02)",
    border: `1px solid ${COLORS.softBorder}`,
    borderRadius: "16px",
    padding: "14px",
  },
  summaryLabel: {
    color: COLORS.soft,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    marginBottom: "6px",
  },
  summaryValue: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  alertCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.01) 100%)",
    border: `1px solid ${COLORS.softBorder}`,
    borderRadius: "18px",
    padding: "16px",
    marginTop: "12px",
  },
  alertTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    flexWrap: "wrap",
  },
  alertTitle: {
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.02em",
  },
  detailList: {
    color: COLORS.muted,
    lineHeight: 1.75,
    marginTop: "10px",
    fontSize: "15px",
  },
  detailStrong: {
    color: COLORS.text,
    fontWeight: 700,
  },
  emptyState: {
    textAlign: "center",
    color: COLORS.muted,
    padding: "16px 4px",
    fontSize: "16px",
  },
  briefCard: {
    background: "linear-gradient(180deg, rgba(17,35,58,.95) 0%, rgba(10,22,39,.95) 100%)",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "20px",
    padding: "18px",
    marginTop: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,.22)",
  },
  briefTitle: {
    fontSize: "26px",
    fontWeight: 900,
    lineHeight: 1.2,
    marginBottom: "10px",
    letterSpacing: "-0.03em",
  },
  briefSection: {
    marginTop: "14px",
    color: COLORS.muted,
    lineHeight: 1.8,
    fontSize: "15px",
  },
  divider: {
    height: "1px",
    background: COLORS.softBorder,
    margin: "14px 0",
  },
};

function badgeStyle(bg, border, color = "white") {
  return {
    ...styles.badge,
    background: bg,
    border: `1px solid ${border}`,
    color,
  };
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [location, setLocation] = useState(() =>
    getSaved(STORAGE_KEYS.location, "Rolex Rodeo"),
  );
  const [mode, setMode] = useState(() =>
    getSaved(STORAGE_KEYS.mode, "auto"),
  );
  const [manualThreat, setManualThreat] = useState(() =>
    getSaved(STORAGE_KEYS.manualThreat, "LOW"),
  );
  const [alerts, setAlerts] = useState(() =>
    getSaved(STORAGE_KEYS.alerts, []),
  );
  const [intelOutput, setIntelOutput] = useState(() =>
    getSaved(STORAGE_KEYS.intelOutput, null),
  );
  const [itineraryOutput, setItineraryOutput] = useState(() =>
    getSaved(STORAGE_KEYS.itineraryOutput, null),
  );

  const [alertForm, setAlertForm] = useState({
    title: "",
    category: "Local Crime",
    level: "Low",
    location: "Rolex Rodeo",
    notes: "",
    status: "Active",
  });

  const [intelForm, setIntelForm] = useState({
    name: "",
    role: "",
    visibility: "Moderate",
    location: "Rolex Rodeo",
    notes: "",
  });

  const [itineraryForm, setItineraryForm] = useState({
    hotel: "",
    route: "",
    venue: "",
    poc: "",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.location, JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, JSON.stringify(mode));
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.manualThreat, JSON.stringify(manualThreat));
  }, [manualThreat]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.intelOutput, JSON.stringify(intelOutput));
  }, [intelOutput]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.itineraryOutput, JSON.stringify(itineraryOutput));
  }, [itineraryOutput]);

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === "Active"),
    [alerts],
  );

  const threatLevel = useMemo(() => {
    if (mode === "manual") return manualThreat;
    if (activeAlerts.some((a) => a.level === "High")) return "HIGH";
    if (activeAlerts.some((a) => a.level === "Medium")) return "MEDIUM";
    return "LOW";
  }, [mode, manualThreat, activeAlerts]);

  const latestAlert = activeAlerts[0] || null;
  const threatColor = levelColor(threatLevel);

  const addAlert = () => {
    if (!alertForm.title.trim()) return;

    const newAlert = {
      id: Date.now(),
      title: alertForm.title.trim(),
      category: alertForm.category,
      level: alertForm.level,
      location: alertForm.location,
      notes: alertForm.notes.trim(),
      status: alertForm.status,
      timestamp: formatTimestamp(),
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setAlertForm((prev) => ({
      ...prev,
      title: "",
      notes: "",
      location,
    }));
  };

  const clearAlert = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Cleared" } : a)));
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const runIntel = () => {
    if (!intelForm.name.trim()) return;

    const risk =
      intelForm.visibility === "Very High"
        ? "High"
        : intelForm.visibility === "High"
          ? "High"
          : intelForm.visibility === "Moderate"
            ? "Medium"
            : "Low";

    const threatConsiderations =
      risk === "High"
        ? "High-visibility principal with elevated likelihood of recognition, crowd focus, opportunistic approach attempts, and heightened movement exposure."
        : risk === "Medium"
          ? "Moderate public exposure profile with increased concern at arrival/departure points, waiting positions, and open-access areas."
          : "Lower recognition profile, though standard entry/exit, curbside, and vehicle-side exposure remains relevant.";

    const exposureConcerns =
      intelForm.location === "Rolex Rodeo" || intelForm.location === "Patek Rodeo"
        ? "Storefront visibility, sidewalk congestion, luxury retail attention, curbside pickup observation, and adjacent pedestrian traffic."
        : "Structured parking access, interior mall circulation, elevator/stairwell choke points, and shared public movement corridors.";

    const movementConcerns =
      risk === "High"
        ? "Require deliberate route discipline, reduced curbside dwell time, controlled ingress/egress, and proactive scan of crowd behavior before movement."
        : "Monitor route exposure, pause points, parking interfaces, and public congregation near arrival and departure.";

    const posture =
      risk === "High"
        ? "Enhanced executive posture: controlled movement, tighter environmental watch, reduced exposure windows, and active principal-side positioning."
        : risk === "Medium"
          ? "Balanced protective posture: maintain low-profile presence with emphasis on route control and anomaly recognition."
          : "Low-profile monitoring posture: maintain environmental awareness and preserve flexibility at movement points.";

    const summary = `${intelForm.name} is assessed as a ${risk.toLowerCase()}-risk principal for ${intelForm.location}, with primary concerns centered on public exposure, movement visibility, and approach opportunities around ingress/egress windows.`;

    setIntelOutput({
      principal: intelForm.name,
      role: intelForm.role || "Not specified",
      visibility: intelForm.visibility,
      location: intelForm.location,
      risk,
      threatConsiderations,
      exposureConcerns,
      movementConcerns,
      posture,
      summary,
      notes: intelForm.notes || "No additional operator notes entered.",
      generatedAt: formatTimestamp(),
    });
  };

  const generateItinerary = () => {
    if (!itineraryForm.hotel && !itineraryForm.route && !itineraryForm.venue) return;

    const risk =
      itineraryForm.venue || itineraryForm.route ? "Moderate" : "Low";

    const routeConsiderations = itineraryForm.route
      ? `Primary route entered as "${itineraryForm.route}". Confirm alternate routing, traffic contingencies, and any forced slowdown points before movement.`
      : "No primary route entered. Establish primary and alternate movement routes before execution.";

    const ingressEgress = itineraryForm.venue
      ? `Review ingress and egress around ${itineraryForm.venue}, with focus on curbside exposure, choke points, staging flow, and fallback movement options.`
      : "Venue ingress/egress not entered. Confirm access points, exits, rally options, and curbside conditions before movement.";

    const exposurePoints =
      "Primary exposure points likely include hotel frontage, curbside loading/unloading, waiting positions, pedestrian bottlenecks, parking interfaces, and delayed departure windows.";

    const movementNotes =
      itineraryForm.notes?.trim() ||
      "Maintain disciplined movement timing, confirm POC readiness, and reduce unnecessary dwell time at transition points.";

    const summary = `Movement plan prepared for hotel-to-venue movement with primary focus on route discipline, exposure reduction, and controlled ingress/egress.`;

    setItineraryOutput({
      hotel: itineraryForm.hotel || "Not entered",
      route: itineraryForm.route || "Not entered",
      venue: itineraryForm.venue || "Not entered",
      poc: itineraryForm.poc || "Not entered",
      risk,
      routeConsiderations,
      ingressEgress,
      exposurePoints,
      movementNotes,
      summary,
      generatedAt: formatTimestamp(),
    });
  };

  const tabButton = (value, label) => (
    <button
      key={value}
      style={tab === value ? styles.tabButtonActive : styles.tabButton}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.page}>
      <div style={styles.appShell}>
        <div style={styles.titleWrap}>
          <div style={styles.title}>🛡️ EP Command Dashboard</div>
          <div style={styles.subtitle}>Executive Command Center</div>
        </div>

        <div style={styles.tabRow}>
          {tabButton("dashboard", "Dashboard")}
          {tabButton("intel", "Intel")}
          {tabButton("itinerary", "Itinerary")}
          {tabButton("alerts", "Alerts")}
        </div>

        {tab === "dashboard" && (
          <>
            <div style={styles.panel}>
              <div style={styles.subHeader}>Current Location</div>
              <select
                style={styles.input}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setAlertForm((prev) => ({ ...prev, location: e.target.value }));
                  setIntelForm((prev) => ({ ...prev, location: e.target.value }));
                }}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <div style={styles.sectionTitle}>Threat Level</div>
              <div style={{ ...styles.threatNumber, color: threatColor }}>
                {threatLevel}
              </div>

              <div style={styles.btnRow}>
                <button
                  style={mode === "auto" ? styles.tabButtonActive : styles.btn}
                  onClick={() => setMode("auto")}
                >
                  AUTO
                </button>
                <button
                  style={mode === "manual" ? styles.tabButtonActive : styles.btn}
                  onClick={() => setMode("manual")}
                >
                  MANUAL
                </button>
              </div>

              {mode === "manual" && (
                <div style={styles.btnRow}>
                  {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
                    <button
                      key={lvl}
                      style={manualThreat === lvl ? styles.tabButtonActive : styles.btn}
                      onClick={() => setManualThreat(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              )}

              <div style={styles.modeText}>
                Mode: {mode === "auto" ? "Auto from Active Alerts" : "Manual Override"}
              </div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>Operational Summary</div>
                <div style={styles.summaryGrid}>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Location</div>
                    <div style={styles.summaryValue}>{location}</div>
                  </div>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Active Alerts</div>
                    <div style={styles.summaryValue}>{activeAlerts.length}</div>
                  </div>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Latest Alert</div>
                    <div style={styles.summaryValue}>
                      {latestAlert ? latestAlert.title : "No active alerts"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Active Alerts</div>
              {activeAlerts.length === 0 ? (
                <div style={styles.panel}>
                  <div style={styles.emptyState}>No active alerts.</div>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} style={styles.alertCard}>
                    <div style={styles.alertTitleRow}>
                      <div style={styles.alertTitle}>{alert.title}</div>
                      <div style={styles.badgeRow}>
                        <span style={badgeStyle("#172554", "#1d4ed8", "#93c5fd")}>
                          {alert.category}
                        </span>
                        <span
                          style={badgeStyle(
                            `${levelColor(alert.level)}22`,
                            levelColor(alert.level),
                            levelColor(alert.level),
                          )}
                        >
                          {alert.level}
                        </span>
                        <span style={badgeStyle("#052e16", "#16a34a", "#4ade80")}>
                          {alert.status}
                        </span>
                      </div>
                    </div>

                    <div style={styles.detailList}>
                      <div>
                        <span style={styles.detailStrong}>Location:</span> {alert.location}
                      </div>
                      <div>
                        <span style={styles.detailStrong}>Time:</span> {alert.timestamp}
                      </div>
                      {alert.notes ? (
                        <div>
                          <span style={styles.detailStrong}>Notes:</span> {alert.notes}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Add Alert</div>
              <div style={styles.panel}>
                <label style={styles.fieldLabel}>Title</label>
                <input
                  style={styles.input}
                  placeholder="Enter alert title"
                  value={alertForm.title}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />

                <label style={styles.fieldLabel}>Category</label>
                <select
                  style={styles.input}
                  value={alertForm.category}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  {ALERT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <label style={styles.fieldLabel}>Level</label>
                <select
                  style={styles.input}
                  value={alertForm.level}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, level: e.target.value }))
                  }
                >
                  {ALERT_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>

                <label style={styles.fieldLabel}>Location</label>
                <select
                  style={styles.input}
                  value={alertForm.location}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <label style={styles.fieldLabel}>Notes</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Operator notes"
                  value={alertForm.notes}
                  onChange={(e) =>
                    setAlertForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />

                <button style={styles.btnPrimary} onClick={addAlert}>
                  Add Alert
                </button>
              </div>
            </div>
          </>
        )}

        {tab === "alerts" && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>All Alerts</div>
            {alerts.length === 0 ? (
              <div style={styles.panel}>
                <div style={styles.emptyState}>No alerts created yet.</div>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} style={styles.alertCard}>
                  <div style={styles.alertTitleRow}>
                    <div style={styles.alertTitle}>{alert.title}</div>
                    <div style={styles.badgeRow}>
                      <span style={badgeStyle("#172554", "#1d4ed8", "#93c5fd")}>
                        {alert.category}
                      </span>
                      <span
                        style={badgeStyle(
                          `${levelColor(alert.level)}22`,
                          levelColor(alert.level),
                          levelColor(alert.level),
                        )}
                      >
                        {alert.level}
                      </span>
                      <span
                        style={
                          alert.status === "Active"
                            ? badgeStyle("#052e16", "#16a34a", "#4ade80")
                            : badgeStyle("#3f3f46", "#71717a", "#d4d4d8")
                        }
                      >
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <div style={styles.detailList}>
                    <div>
                      <span style={styles.detailStrong}>Location:</span> {alert.location}
                    </div>
                    <div>
                      <span style={styles.detailStrong}>Time:</span> {alert.timestamp}
                    </div>
                    {alert.notes ? (
                      <div>
                        <span style={styles.detailStrong}>Notes:</span> {alert.notes}
                      </div>
                    ) : null}
                  </div>

                  <div style={styles.btnRow}>
                    {alert.status === "Active" && (
                      <button style={styles.btn} onClick={() => clearAlert(alert.id)}>
                        Mark Cleared
                      </button>
                    )}
                    <button style={styles.btn} onClick={() => removeAlert(alert.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "intel" && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Client Intel</div>
            <div style={styles.panel}>
              <label style={styles.fieldLabel}>Principal Name</label>
              <input
                style={styles.input}
                placeholder="Name"
                value={intelForm.name}
                onChange={(e) =>
                  setIntelForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>Role / Title</label>
              <input
                style={styles.input}
                placeholder="Role / Title"
                value={intelForm.role}
                onChange={(e) =>
                  setIntelForm((prev) => ({ ...prev, role: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>Visibility Level</label>
              <select
                style={styles.input}
                value={intelForm.visibility}
                onChange={(e) =>
                  setIntelForm((prev) => ({ ...prev, visibility: e.target.value }))
                }
              >
                {VISIBILITY_LEVELS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <label style={styles.fieldLabel}>Location</label>
              <select
                style={styles.input}
                value={intelForm.location}
                onChange={(e) =>
                  setIntelForm((prev) => ({ ...prev, location: e.target.value }))
                }
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <label style={styles.fieldLabel}>Context / Notes</label>
              <textarea
                style={styles.textarea}
                placeholder="Context, event notes, known concerns"
                value={intelForm.notes}
                onChange={(e) =>
                  setIntelForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />

              <button style={styles.btnPrimary} onClick={runIntel}>
                Generate Intel Brief
              </button>
            </div>

            {intelOutput && (
              <div style={styles.briefCard}>
                <div style={styles.subHeader}>Protective Intelligence Brief</div>
                <div style={styles.briefTitle}>{intelOutput.principal}</div>

                <div style={styles.badgeRow}>
                  <span style={badgeStyle("#1e293b", "#475569", COLORS.text)}>
                    {intelOutput.role}
                  </span>
                  <span
                    style={badgeStyle(
                      `${levelColor(intelOutput.risk)}22`,
                      levelColor(intelOutput.risk),
                      levelColor(intelOutput.risk),
                    )}
                  >
                    Risk: {intelOutput.risk}
                  </span>
                  <span style={badgeStyle("#172554", "#1d4ed8", "#93c5fd")}>
                    Visibility: {intelOutput.visibility}
                  </span>
                  <span style={badgeStyle("#1f2937", "#475569", COLORS.muted)}>
                    {intelOutput.location}
                  </span>
                </div>

                <div style={styles.divider} />

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Threat Considerations:</strong>{" "}
                  {intelOutput.threatConsiderations}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Public Exposure Concerns:</strong>{" "}
                  {intelOutput.exposureConcerns}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Movement Concerns:</strong>{" "}
                  {intelOutput.movementConcerns}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Recommended Protection Posture:</strong>{" "}
                  {intelOutput.posture}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Operator Notes:</strong>{" "}
                  {intelOutput.notes}
                </div>

                <div style={styles.divider} />

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Summary:</strong>{" "}
                  {intelOutput.summary}
                </div>

                <div style={{ ...styles.briefSection, color: COLORS.soft }}>
                  Generated: {intelOutput.generatedAt}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "itinerary" && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Itinerary Builder</div>
            <div style={styles.panel}>
              <label style={styles.fieldLabel}>Hotel</label>
              <input
                style={styles.input}
                placeholder="Hotel"
                value={itineraryForm.hotel}
                onChange={(e) =>
                  setItineraryForm((prev) => ({ ...prev, hotel: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>Route</label>
              <input
                style={styles.input}
                placeholder="Route"
                value={itineraryForm.route}
                onChange={(e) =>
                  setItineraryForm((prev) => ({ ...prev, route: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>Venue</label>
              <input
                style={styles.input}
                placeholder="Venue"
                value={itineraryForm.venue}
                onChange={(e) =>
                  setItineraryForm((prev) => ({ ...prev, venue: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>POC</label>
              <input
                style={styles.input}
                placeholder="POC"
                value={itineraryForm.poc}
                onChange={(e) =>
                  setItineraryForm((prev) => ({ ...prev, poc: e.target.value }))
                }
              />

              <label style={styles.fieldLabel}>Movement Notes</label>
              <textarea
                style={styles.textarea}
                placeholder="Movement notes"
                value={itineraryForm.notes}
                onChange={(e) =>
                  setItineraryForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />

              <button style={styles.btnPrimary} onClick={generateItinerary}>
                Generate Movement Brief
              </button>
            </div>

            {itineraryOutput && (
              <div style={styles.briefCard}>
                <div style={styles.subHeader}>Operational Movement Brief</div>
                <div style={styles.briefTitle}>{itineraryOutput.venue}</div>

                <div style={styles.badgeRow}>
                  <span
                    style={badgeStyle(
                      `${levelColor(itineraryOutput.risk)}22`,
                      levelColor(itineraryOutput.risk),
                      levelColor(itineraryOutput.risk),
                    )}
                  >
                    Risk: {itineraryOutput.risk}
                  </span>
                  <span style={badgeStyle("#1f2937", "#475569", COLORS.text)}>
                    Hotel: {itineraryOutput.hotel}
                  </span>
                </div>

                <div style={styles.divider} />

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Route:</strong>{" "}
                  {itineraryOutput.route}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>POC:</strong>{" "}
                  {itineraryOutput.poc}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Route Considerations:</strong>{" "}
                  {itineraryOutput.routeConsiderations}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Ingress / Egress Notes:</strong>{" "}
                  {itineraryOutput.ingressEgress}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Exposure Points:</strong>{" "}
                  {itineraryOutput.exposurePoints}
                </div>

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Recommended Movement Notes:</strong>{" "}
                  {itineraryOutput.movementNotes}
                </div>

                <div style={styles.divider} />

                <div style={styles.briefSection}>
                  <strong style={styles.detailStrong}>Summary:</strong>{" "}
                  {itineraryOutput.summary}
                </div>

                <div style={{ ...styles.briefSection, color: COLORS.soft }}>
                  Generated: {itineraryOutput.generatedAt}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}