import { useState, useEffect } from "react";

export default function App() {
  const locations = ["Rolex Rodeo", "Patek Rodeo", "Rolex Century City"];
  const categories = ["Local Crime", "Local Alert", "Suspicious Activity", "Traffic / Movement"];

  const [tab, setTab] = useState("dashboard");
  const [location, setLocation] = useState(localStorage.getItem("location") || "Rolex Rodeo");
  const [alerts, setAlerts] = useState(JSON.parse(localStorage.getItem("alerts")) || []);
  const [mode, setMode] = useState("auto");
  const [manualLevel, setManualLevel] = useState("LOW");

  const [newAlert, setNewAlert] = useState({
    title: "",
    category: "Local Alert",
    level: "Medium",
    location: location,
    notes: ""
  });

  const [intelInput, setIntelInput] = useState({
    name: "",
    role: "",
    visibility: "Moderate",
    location: "",
    notes: ""
  });

  const [intelOutput, setIntelOutput] = useState(null);

  const [itineraryInput, setItineraryInput] = useState({
    hotel: "",
    route: "",
    venue: "",
    poc: "",
    notes: ""
  });

  const [itineraryOutput, setItineraryOutput] = useState(null);

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);

  const getThreatLevel = () => {
    if (mode === "manual") return manualLevel;

    if (alerts.some(a => a.level === "High")) return "HIGH";
    if (alerts.some(a => a.level === "Medium")) return "MEDIUM";
    return "LOW";
  };

  const threat = getThreatLevel();

  const addAlert = () => {
    if (!newAlert.title) return;
    const alert = {
      ...newAlert,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      status: "Active"
    };
    setAlerts([alert, ...alerts]);
    setNewAlert({ ...newAlert, title: "", notes: "" });
  };

  const runIntel = () => {
    setIntelOutput({
      ...intelInput,
      risk: intelInput.visibility === "Very High" ? "High" : "Medium"
    });
  };

  const generateItinerary = () => {
    setItineraryOutput(itineraryInput);
  };

  const buttonStyle = {
    padding: "10px 16px",
    margin: "6px",
    borderRadius: "10px",
    border: "1px solid #555",
    background: "#2c3440",
    color: "white"
  };

  return (
    <div style={{ background: "#0b1320", color: "white", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>🛡️ EP Command Dashboard</h1>

      <div style={{ textAlign: "center" }}>
        {["dashboard", "intel", "itinerary", "alerts"].map(t => (
          <button key={t} style={buttonStyle} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ textAlign: "center" }}>
          <h2>{location}</h2>

          <select value={location} onChange={e => setLocation(e.target.value)}>
            {locations.map(l => <option key={l}>{l}</option>)}
          </select>

          <h2>Threat Level</h2>
          <h1 style={{
            color: threat === "HIGH" ? "red" : threat === "MEDIUM" ? "orange" : "green"
          }}>
            {threat}
          </h1>

          <div>
            <button style={buttonStyle} onClick={() => setMode("auto")}>AUTO</button>
            <button style={buttonStyle} onClick={() => setMode("manual")}>MANUAL</button>
          </div>

          {mode === "manual" && (
            <div>
              {["LOW", "MEDIUM", "HIGH"].map(l => (
                <button key={l} style={buttonStyle} onClick={() => setManualLevel(l)}>
                  {l}
                </button>
              ))}
            </div>
          )}

          <p>Mode: {mode}</p>

          <h3>Active Alerts</h3>

          {alerts.length === 0 && <p>No active alerts</p>}

          {alerts.map(a => (
            <div key={a.id} style={{
              border: "1px solid #444",
              padding: 10,
              margin: 10,
              borderRadius: 10
            }}>
              <b>{a.title}</b>
              <p>{a.category} | {a.level}</p>
              <p>{a.location} - {a.timestamp}</p>
              <p>{a.notes}</p>
            </div>
          ))}

          <h3>Add Alert</h3>

          <input
            placeholder="Title"
            value={newAlert.title}
            onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
          />

          <select onChange={e => setNewAlert({ ...newAlert, category: e.target.value })}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select onChange={e => setNewAlert({ ...newAlert, level: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <textarea
            placeholder="Notes"
            value={newAlert.notes}
            onChange={e => setNewAlert({ ...newAlert, notes: e.target.value })}
          />

          <button style={buttonStyle} onClick={addAlert}>Add</button>
        </div>
      )}

      {/* INTEL */}
      {tab === "intel" && (
        <div>
          <h2>Client Intel</h2>

          <input placeholder="Name" onChange={e => setIntelInput({ ...intelInput, name: e.target.value })} />
          <input placeholder="Role" onChange={e => setIntelInput({ ...intelInput, role: e.target.value })} />
          <select onChange={e => setIntelInput({ ...intelInput, visibility: e.target.value })}>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
            <option>Very High</option>
          </select>

          <textarea placeholder="Notes" onChange={e => setIntelInput({ ...intelInput, notes: e.target.value })} />

          <button style={buttonStyle} onClick={runIntel}>Run Intel</button>

          {intelOutput && (
            <div>
              <h3>{intelOutput.name}</h3>
              <p>Risk: {intelOutput.risk}</p>
              <p>Visibility: {intelOutput.visibility}</p>
              <p>{intelOutput.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ITINERARY */}
      {tab === "itinerary" && (
        <div>
          <h2>Itinerary Builder</h2>

          <input placeholder="Hotel" onChange={e => setItineraryInput({ ...itineraryInput, hotel: e.target.value })} />
          <input placeholder="Route" onChange={e => setItineraryInput({ ...itineraryInput, route: e.target.value })} />
          <input placeholder="Venue" onChange={e => setItineraryInput({ ...itineraryInput, venue: e.target.value })} />
          <input placeholder="POC" onChange={e => setItineraryInput({ ...itineraryInput, poc: e.target.value })} />

          <textarea placeholder="Notes" onChange={e => setItineraryInput({ ...itineraryInput, notes: e.target.value })} />

          <button style={buttonStyle} onClick={generateItinerary}>Generate</button>

          {itineraryOutput && (
            <div>
              <h3>Movement Plan</h3>
              <p>Hotel: {itineraryOutput.hotel}</p>
              <p>Route: {itineraryOutput.route}</p>
              <p>Venue: {itineraryOutput.venue}</p>
              <p>POC: {itineraryOutput.poc}</p>
              <p>{itineraryOutput.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ALERTS TAB */}
      {tab === "alerts" && (
        <div>
          <h2>All Alerts</h2>
          {alerts.map(a => (
            <div key={a.id}>{a.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}