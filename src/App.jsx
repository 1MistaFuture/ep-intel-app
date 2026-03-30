import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  location: "ep_v21_location",
  alerts: "ep_v21_alerts",
  mode: "ep_v21_mode",
  manualThreat: "ep_v21_manualThreat",
  intelOutput: "ep_v21_intelOutput",
  itineraryOutput: "ep_v21_itineraryOutput",
};

const LOCATIONS = ["Rolex Rodeo", "Patek Rodeo", "Rolex Century City"];
const ALERT_CATEGORIES = [
  "Local Crime",
  "Local Alert",
  "Suspicious Activity",
  "Traffic / Movement",
];
const ALERT_LEVELS = ["Low", "Medium", "High"];
const ALERT_STATUS = ["Active", "Cleared"];
const VISIBILITY_LEVELS = ["Low", "Moderate", "High", "Very High"];

const styles = {
  page: {
    background: "#0b1320",
    color: "white",
    minHeight: "100vh",
    padding: "20px 16px 40px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "18px",
    lineHeight: 1.15,
  },
  tabsWrap: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  button: {
    padding: "11px 16px",
    borderRadius: "14px",
    border: "1px solid #596273",
    background: "#2d3748",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
  },
  buttonActive: {
    padding: "11px 16px",
    borderRadius: "14px",
    border: "1px solid #8b95a7",
    background: "#3a4558",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
  },
  section: {
    borderTop: "1px solid #4a5568",
    paddingTop: "18px",
    marginTop: "18px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "12px",
  },
  card: {
    background: "#101827",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "16px",
    marginTop: "12px",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    marginBottom: "10px",
    borderRadius: "14px",
    border: "1px solid #4b5563",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "13px 14px",
    marginBottom: "10px",
    borderRadius: "14px",
    border: "1px solid #4b5563",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  label: {
    fontSize: "13px",
    color: "#cbd5e1",
    marginBottom: "6px",
    display: "block",
    fontWeight: 600,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  },
  subText: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: "15px",
    marginTop: "6px",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    border: "1px solid #4b5563",
    background: "#1f2937",
    color: "white",
  },
  danger: { color: "#ef4444" },
  medium: { color: "#f59e0b" },
  low: { color: "#22c55e" },
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
  if (level === "High" || level === "HIGH") return "#ef4444";
  if (level === "Medium" || level === "MEDIUM") return "#f59e0b";
  return "#22c55e";
}

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
    localStorage.setItem(
      STORAGE_KEYS.manualThreat,
      JSON.stringify(manualThreat),
    );
  }, [manualThreat]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.alerts, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.intelOutput, JSON.stringify(intelOutput));
  }, [intelOutput]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.itineraryOutput,
      JSON.stringify(itineraryOutput),
    );
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

  const threatColor = levelColor(threatLevel);

  const latestAlert = activeAlerts[0] || null;

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
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Cleared" } : a,
      ),
    );
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
        ? "Elevated public recognition, opportunistic approach risk, and increased need for controlled movement planning."
        : risk === "Medium"
          ? "Moderate visibility with potential exposure at arrival, departure, and publicly accessible choke points."
          : "Lower visibility profile, though entry/exit and vehicle-side exposure still require monitoring.";

    const exposureConcerns =
      intelForm.location === "Rolex Rodeo" || intelForm.location === "Patek Rodeo"
        ? "Luxury retail frontage, sidewalk exposure, curbside pickup visibility, and tourist foot traffic."
        : "Mall circulation, parking access points, elevator/stairwell exposure, and shared public interior routes.";

    const movementConcerns =
      risk === "High"
        ? "Advance route discipline, controlled ingress/egress, and proactive observation of crowd behavior recommended."
        : "Monitor vehicle approach, curbside pauses, and public congregation points during movement.";

    const posture =
      risk === "High"
        ? "Enhanced close-watch posture with controlled movement and tighter exposure management."
        : risk === "Medium"
          ? "Balanced protective posture with focus on route discipline and environmental awareness."
          : "Low-profile monitoring with emphasis on entry/exit awareness and visible anomalies.";

    const summary = `${intelForm.name} is assessed as a ${risk.toLowerCase()}-to-${
      risk === "High" ? "elevated" : risk.toLowerCase()
    } exposure principal based on visibility, location, and expected public interaction.`;

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
    if (!itineraryForm.hotel && !itineraryForm.route && !itineraryForm.venue)
      return;

    const risk =
      itineraryForm.venue || itineraryForm.route ? "Moderate" : "Low";

    const routeConsiderations = itineraryForm.route
      ? `Primary route noted as: ${itineraryForm.route}. Review alternative access and delays before movement.`
      : "No dedicated route entered. Establish primary and alternate movement route before execution.";

    const ingressEgress = itineraryForm.venue
      ? `Venue ingress/egress should be reviewed in advance for choke points, curbside exposure, and staging flow around ${itineraryForm.venue}.`
      : "Venue ingress/egress not entered. Confirm access, exits, and rally points before movement.";

    const exposurePoints =
      "Key exposure points include curbside loading, pedestrian bottlenecks, parking interfaces, and delayed departure windows.";

    const movementNotes =
      itineraryForm.notes?.trim() ||
      "Maintain movement discipline, identify fallback options, and confirm POC readiness prior to movement.";

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
      generatedAt: formatTimestamp(),
    });
  };

  const tabButton = (value, label) => (
    <button
      key={value}
      style={tab === value ? styles.buttonActive : styles.button}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛡️ EP Command Dashboard</h1>

      <div style={styles.tabsWrap}>
        {tabButton("dashboard", "Dashboard")}
        {tabButton("intel", "Intel")}
        {tabButton("itinerary", "Itinerary")}
        {tabButton("alerts", "Alerts")}
      </div>

      {tab === "dashboard" && (
        <>
          <div style={styles.card}>
            <div style={{ ...styles.label, textAlign: "center" }}>
              Current Location
            </div>
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

            <div style={{ ...styles.sectionTitle, marginTop: "4px" }}>
              Threat Level
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "64px",
                fontWeight: 800,
                color: threatColor,
                lineHeight: 1,
                marginBottom: "10px",
              }}
            >
              {threatLevel}
            </div>

            <div style={styles.tabsWrap}>
              <button
                style={mode === "auto" ? styles.buttonActive : styles.button}
                onClick={() => setMode("auto")}
              >
                AUTO
              </button>
              <button
                style={mode === "manual" ? styles.buttonActive : styles.button}
                onClick={() => setMode("manual")}
              >
                MANUAL
              </button>
            </div>

            {mode === "manual" && (
              <div style={styles.tabsWrap}>
                {["LOW", "MEDIUM", "HIGH"].map((lvl) => (
                  <button
                    key={lvl}
                    style={manualThreat === lvl ? styles.buttonActive : styles.button}
                    onClick={() => setManualThreat(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}

            <div style={styles.subText}>
              Mode: {mode === "auto" ? "Auto from Active Alerts" : "Manual Override"}
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Operational Summary</div>
              <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                <div>
                  <strong>Location:</strong> {location}
                </div>
                <div>
                  <strong>Active Alerts:</strong> {activeAlerts.length}
                </div>
                <div>
                  <strong>Latest Alert:</strong>{" "}
                  {latestAlert ? latestAlert.title : "No active alerts"}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Active Alerts</div>
            {activeAlerts.length === 0 ? (
              <div style={styles.card}>
                <div style={{ textAlign: "center", color: "#cbd5e1" }}>
                  No active alerts.
                </div>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>
                      {alert.title}
                    </div>
                    <div style={styles.badgeRow}>
                      <span
                        style={badgeStyle(
                          "#1e293b",
                          "#475569",
                          "#e2e8f0",
                        )}
                      >
                        {alert.category}
                      </span>
                      <span
                        style={badgeStyle(
                          levelColor(alert.level) + "22",
                          levelColor(alert.level),
                          levelColor(alert.level),
                        )}
                      >
                        {alert.level}
                      </span>
                      <span
                        style={badgeStyle(
                          alert.status === "Active" ? "#052e16" : "#3f3f46",
                          alert.status === "Active" ? "#16a34a" : "#71717a",
                          alert.status === "Active" ? "#4ade80" : "#d4d4d8",
                        )}
                      >
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ color: "#cbd5e1", marginTop: "10px", lineHeight: 1.7 }}>
                    <div>
                      <strong>Location:</strong> {alert.location}
                    </div>
                    <div>
                      <strong>Time:</strong> {alert.timestamp}
                    </div>
                    {alert.notes ? (
                      <div>
                        <strong>Notes:</strong> {alert.notes}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Add Alert</div>
            <div style={styles.card}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                placeholder="Enter alert title"
                value={alertForm.title}
                onChange={(e) =>
                  setAlertForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />

              <label style={styles.label}>Category</label>
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

              <label style={styles.label}>Level</label>
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

              <label style={styles.label}>Location</label>
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

              <label style={styles.label}>Notes</label>
              <textarea
                style={styles.textarea}
                placeholder="Operator notes"
                value={alertForm.notes}
                onChange={(e) =>
                  setAlertForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />

              <button style={styles.buttonActive} onClick={addAlert}>
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
            <div style={styles.card}>
              <div style={{ textAlign: "center", color: "#cbd5e1" }}>
                No alerts created yet.
              </div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: 700 }}>
                    {alert.title}
                  </div>
                  <div style={styles.badgeRow}>
                    <span
                      style={badgeStyle(
                        "#1e293b",
                        "#475569",
                        "#e2e8f0",
                      )}
                    >
                      {alert.category}
                    </span>
                    <span
                      style={badgeStyle(
                        levelColor(alert.level) + "22",
                        levelColor(alert.level),
                        levelColor(alert.level),
                      )}
                    >
                      {alert.level}
                    </span>
                    <span
                      style={badgeStyle(
                        alert.status === "Active" ? "#052e16" : "#3f3f46",
                        alert.status === "Active" ? "#16a34a" : "#71717a",
                        alert.status === "Active" ? "#4ade80" : "#d4d4d8",
                      )}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div style={{ color: "#cbd5e1", marginTop: "10px", lineHeight: 1.7 }}>
                  <div>
                    <strong>Location:</strong> {alert.location}
                  </div>
                  <div>
                    <strong>Time:</strong> {alert.timestamp}
                  </div>
                  {alert.notes ? (
                    <div>
                      <strong>Notes:</strong> {alert.notes}
                    </div>
                  ) : null}
                </div>

                <div style={styles.badgeRow}>
                  {alert.status === "Active" && (
                    <button style={styles.button} onClick={() => clearAlert(alert.id)}>
                      Mark Cleared
                    </button>
                  )}
                  <button style={styles.button} onClick={() => removeAlert(alert.id)}>
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
          <div style={styles.card}>
            <label style={styles.label}>Principal Name</label>
            <input
              style={styles.input}
              placeholder="Name"
              value={intelForm.name}
              onChange={(e) =>
                setIntelForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <label style={styles.label}>Role / Title</label>
            <input
              style={styles.input}
              placeholder="Role / Title"
              value={intelForm.role}
              onChange={(e) =>
                setIntelForm((prev) => ({ ...prev, role: e.target.value }))
              }
            />

            <label style={styles.label}>Visibility Level</label>
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

            <label style={styles.label}>Location</label>
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

            <label style={styles.label}>Context / Notes</label>
            <textarea
              style={styles.textarea}
              placeholder="Context, event notes, known concerns"
              value={intelForm.notes}
              onChange={(e) =>
                setIntelForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />

            <button style={styles.buttonActive} onClick={runIntel}>
              Run Intel
            </button>
          </div>

          {intelOutput && (
            <div style={styles.card}>
              <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px" }}>
                {intelOutput.principal}
              </div>

              <div style={styles.badgeRow}>
                <span style={badgeStyle("#1e293b", "#475569")}>
                  {intelOutput.role}
                </span>
                <span
                  style={badgeStyle(
                    levelColor(intelOutput.risk) + "22",
                    levelColor(intelOutput.risk),
                    levelColor(intelOutput.risk),
                  )}
                >
                  Risk: {intelOutput.risk}
                </span>
                <span style={badgeStyle("#1e293b", "#475569")}>
                  Visibility: {intelOutput.visibility}
                </span>
              </div>

              <div style={{ color: "#cbd5e1", lineHeight: 1.75, marginTop: "14px" }}>
                <div>
                  <strong>Location:</strong> {intelOutput.location}
                </div>
                <div>
                  <strong>Generated:</strong> {intelOutput.generatedAt}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Threat Considerations:</strong> {intelOutput.threatConsiderations}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Public Exposure Concerns:</strong> {intelOutput.exposureConcerns}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Movement Concerns:</strong> {intelOutput.movementConcerns}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Recommended Protection Posture:</strong> {intelOutput.posture}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Summary:</strong> {intelOutput.summary}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Operator Notes:</strong> {intelOutput.notes}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "itinerary" && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Itinerary Builder</div>
          <div style={styles.card}>
            <label style={styles.label}>Hotel</label>
            <input
              style={styles.input}
              placeholder="Hotel"
              value={itineraryForm.hotel}
              onChange={(e) =>
                setItineraryForm((prev) => ({ ...prev, hotel: e.target.value }))
              }
            />

            <label style={styles.label}>Route</label>
            <input
              style={styles.input}
              placeholder="Route"
              value={itineraryForm.route}
              onChange={(e) =>
                setItineraryForm((prev) => ({ ...prev, route: e.target.value }))
              }
            />

            <label style={styles.label}>Venue</label>
            <input
              style={styles.input}
              placeholder="Venue"
              value={itineraryForm.venue}
              onChange={(e) =>
                setItineraryForm((prev) => ({ ...prev, venue: e.target.value }))
              }
            />

            <label style={styles.label}>POC</label>
            <input
              style={styles.input}
              placeholder="POC"
              value={itineraryForm.poc}
              onChange={(e) =>
                setItineraryForm((prev) => ({ ...prev, poc: e.target.value }))
              }
            />

            <label style={styles.label}>Notes</label>
            <textarea
              style={styles.textarea}
              placeholder="Movement notes"
              value={itineraryForm.notes}
              onChange={(e) =>
                setItineraryForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />

            <button style={styles.buttonActive} onClick={generateItinerary}>
              Generate Plan
            </button>
          </div>

          {itineraryOutput && (
            <div style={styles.card}>
              <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px" }}>
                Movement Brief
              </div>

              <div style={styles.badgeRow}>
                <span
                  style={badgeStyle(
                    levelColor(itineraryOutput.risk) + "22",
                    levelColor(itineraryOutput.risk),
                    levelColor(itineraryOutput.risk),
                  )}
                >
                  Risk: {itineraryOutput.risk}
                </span>
              </div>

              <div style={{ color: "#cbd5e1", lineHeight: 1.75, marginTop: "14px" }}>
                <div>
                  <strong>Hotel:</strong> {itineraryOutput.hotel}
                </div>
                <div>
                  <strong>Route:</strong> {itineraryOutput.route}
                </div>
                <div>
                  <strong>Venue:</strong> {itineraryOutput.venue}
                </div>
                <div>
                  <strong>POC:</strong> {itineraryOutput.poc}
                </div>
                <div>
                  <strong>Generated:</strong> {itineraryOutput.generatedAt}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Route Considerations:</strong> {itineraryOutput.routeConsiderations}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Ingress / Egress Notes:</strong> {itineraryOutput.ingressEgress}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Exposure Points:</strong> {itineraryOutput.exposurePoints}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <strong>Recommended Movement Notes:</strong> {itineraryOutput.movementNotes}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}