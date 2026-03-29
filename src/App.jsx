import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      text: "Beverly Hills – Suspicious activity",
      level: "medium",
    },
    {
      id: 2,
      text: "Vehicle break-ins increasing",
      level: "high",
    },
    {
      id: 3,
      text: "Retail theft spike",
      level: "medium",
    },
  ]);

  const [newAlertText, setNewAlertText] = useState("");
  const [newAlertLevel, setNewAlertLevel] = useState("medium");
  const [intelResult, setIntelResult] = useState(null);
  const [clientName, setClientName] = useState("");
  const [itineraryInput, setItineraryInput] = useState("");
  const [itineraryResult, setItineraryResult] = useState(null);
  const [manualThreat, setManualThreat] = useState(null);

  const threatLevel =
    manualThreat ||
    (alerts.some((a) => a.level === "high")
      ? "HIGH"
      : alerts.some((a) => a.level === "medium")
        ? "MEDIUM"
        : "LOW");

  const getColor = () => {
    if (threatLevel === "LOW") return "green";
    if (threatLevel === "MEDIUM") return "orange";
    if (threatLevel === "HIGH") return "red";
    return "white";
  };

  const addAlert = () => {
    if (!newAlertText.trim()) return;

    const newAlert = {
      id: Date.now(),
      text: newAlertText,
      level: newAlertLevel,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setNewAlertText("");
    setNewAlertLevel("medium");
    setManualThreat(null);
  };

  const buttonStyle = {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #555",
    background: "#1f2937",
    color: "white",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "8px",
    fontSize: "16px",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#374151",
    border: "1px solid #888",
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "#111827",
    color: "white",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "12px",
    fontSize: "16px",
  };

  const sectionStyle = {
    borderTop: "1px solid #666",
    paddingTop: "20px",
    marginTop: "20px",
  };

  const cardStyle = {
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "14px",
  };

  const navButtonStyle = (tabName) => ({
    padding: "10px 16px",
    borderRadius: "14px",
    border: "1px solid #555",
    background: activeTab === tabName ? "#374151" : "#1f2937",
    color: "white",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "8px",
    fontSize: "16px",
  });

  const renderDashboard = () => (
    <>
      <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "8px" }}>
        Threat Level
      </h2>

      <h1
        style={{
          color: getColor(),
          fontSize: "64px",
          margin: "10px 0 20px",
          textAlign: "center",
        }}
      >
        {threatLevel}
      </h1>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button
          style={manualThreat === "LOW" ? activeButtonStyle : buttonStyle}
          onClick={() => setManualThreat("LOW")}
        >
          LOW
        </button>
        <button
          style={manualThreat === "MEDIUM" ? activeButtonStyle : buttonStyle}
          onClick={() => setManualThreat("MEDIUM")}
        >
          MEDIUM
        </button>
        <button
          style={manualThreat === "HIGH" ? activeButtonStyle : buttonStyle}
          onClick={() => setManualThreat("HIGH")}
        >
          HIGH
        </button>
        <button
          style={buttonStyle}
          onClick={() => setManualThreat(null)}
        >
          AUTO
        </button>
      </div>

      <p style={{ textAlign: "center", color: "#cbd5e1", marginTop: "0", marginBottom: "12px" }}>
        Mode: {manualThreat ? "Manual Override" : "Auto from Alerts"}
      </p>

      <div style={sectionStyle}>
        <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "12px" }}>
          Active Alerts
        </h2>

        <ul style={{ lineHeight: "1.9", fontSize: "22px", paddingLeft: "28px" }}>
          {alerts.map((alert) => (
            <li key={alert.id} style={{ marginBottom: "6px" }}>
              {alert.level === "high" ? "🚨" : alert.level === "medium" ? "⚠️" : "ℹ️"}{" "}
              {alert.text}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ ...sectionStyle, paddingBottom: "40px" }}>
        <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "12px" }}>
          Add New Alert
        </h2>

        <input
          style={inputStyle}
          placeholder="Enter new intel..."
          value={newAlertText}
          onChange={(e) => setNewAlertText(e.target.value)}
        />

        <select
          style={inputStyle}
          value={newAlertLevel}
          onChange={(e) => setNewAlertLevel(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button style={buttonStyle} onClick={addAlert}>
          Add Alert
        </button>
      </div>
    </>
  );

  const renderIntel = () => (
    <div style={sectionStyle}>
      <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "12px" }}>
        Client Intel
      </h2>

      <input
        style={inputStyle}
        placeholder="Enter client name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />

      <button
        style={buttonStyle}
        onClick={() => {
          if (!clientName.trim()) return;
          setIntelResult({
            risk: "Medium",
            notes: `${clientName} is a high-visibility individual. Monitor public exposure, entry/exit points, crowd proximity, and vehicle approach routes.`,
          });
        }}
      >
        Run Intel
      </button>

      {intelResult && (
        <div style={cardStyle}>
          <p style={{ fontSize: "20px", marginBottom: "10px" }}>
            <strong>Risk Level:</strong> {intelResult.risk}
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
            <strong>Notes:</strong> {intelResult.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderItinerary = () => (
    <div style={sectionStyle}>
      <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "12px" }}>
        Itinerary Builder
      </h2>

      <input
        style={inputStyle}
        placeholder="Location / Hotel / Venue"
        value={itineraryInput}
        onChange={(e) => setItineraryInput(e.target.value)}
      />

      <button
        style={buttonStyle}
        onClick={() => {
          if (!itineraryInput.trim()) return;
          setItineraryResult({
            destination: itineraryInput,
            risk: "Moderate",
            notes:
              "Review ingress/egress routes, nearby hospitals, choke points, valet/pickup exposure, and alternate routes before movement.",
          });
        }}
      >
        Generate Plan
      </button>

      {itineraryResult && (
        <div style={cardStyle}>
          <p style={{ fontSize: "20px", marginBottom: "10px" }}>
            <strong>Destination:</strong> {itineraryResult.destination}
          </p>
          <p style={{ fontSize: "20px", marginBottom: "10px" }}>
            <strong>Risk:</strong> {itineraryResult.risk}
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.7" }}>
            <strong>Notes:</strong> {itineraryResult.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div style={sectionStyle}>
      <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "12px" }}>
        Alerts Feed
      </h2>

      <ul style={{ lineHeight: "1.9", fontSize: "22px", paddingLeft: "28px" }}>
        {alerts.map((alert) => (
          <li key={alert.id} style={{ marginBottom: "6px" }}>
            {alert.level === "high" ? "🚨" : alert.level === "medium" ? "⚠️" : "ℹ️"}{" "}
            {alert.text}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "dashboard") return renderDashboard();
    if (activeTab === "intel") return renderIntel();
    if (activeTab === "itinerary") return renderItinerary();
    if (activeTab === "alerts") return renderAlerts();
    return null;
  };

  return (
    <div
      style={{
        background: "#0b0f1a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          textAlign: "center",
          marginBottom: "20px",
          lineHeight: "1.2",
        }}
      >
        🛡️ EP Command Dashboard
      </h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button style={navButtonStyle("dashboard")} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button style={navButtonStyle("intel")} onClick={() => setActiveTab("intel")}>
          Intel
        </button>
        <button style={navButtonStyle("itinerary")} onClick={() => setActiveTab("itinerary")}>
          Itinerary
        </button>
        <button style={navButtonStyle("alerts")} onClick={() => setActiveTab("alerts")}>
          Alerts
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
