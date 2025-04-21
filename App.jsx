import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./App.css";
import Navbar from "./components/Navbar";

const SENSOR_LINE_MAP = {
  line4: Array.from({ length: 8 }, (_, i) => `r${(i + 1).toString().padStart(2, "0")}`),
  line5: Array.from({ length: 18 }, (_, i) => `r${(i + 1).toString().padStart(2, "0")}`),
};

const getAlertColorClass = (temp) => {
  if (temp > 220) return "bg-red-500";
  if (temp > 200) return "bg-yellow-400";
  return "bg-green-500";
};

const getAlertText = (temp) => {
  if (temp > 220) return "Critical";
  if (temp > 200) return "Warning";
  return "Normal";
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [sensorDataMap, setSensorDataMap] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [sensorDateRange, setSensorDateRange] = useState({});
  const [activeTab, setActiveTab] = useState("live");
  const [selectedLine, setSelectedLine] = useState("line4");

  const SENSOR_IDS = SENSOR_LINE_MAP[selectedLine];

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "live") return;

    const fetchAllSensorData = async () => {
      const updated = {};
      await Promise.all(
        SENSOR_IDS.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:8000/api/realtime/${id}`);
            updated[id] = [...(sensorDataMap[id] || []).slice(-19), res.data];
          } catch (err) {
            console.error(`Error fetching ${id}:`, err);
          }
        })
      );
      setSensorDataMap((prev) => ({ ...prev, ...updated }));
    };

    const interval = setInterval(fetchAllSensorData, 3000);
    return () => clearInterval(interval);
  }, [isLoggedIn, activeTab, selectedLine]);

  const fetchHistoricalData = async (sensorId) => {
    const { startDate, endDate } = sensorDateRange[sensorId] || {};
    if (!startDate || !endDate) {
      alert("Select both start and end dates.");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8000/api/historical/${sensorId}?start=${startDate}&end=${endDate}`
      );
      setHistoricalData((prev) => ({ ...prev, [sensorId]: res.data }));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch historical data.");
    }
  };

  const handleDateChange = (sensorId, dateType, dateValue) => {
    setSensorDateRange((prev) => ({
      ...prev,
      [sensorId]: { ...prev[sensorId], [dateType]: dateValue },
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Client Login</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (username === "admin" && password === "1234") {
                setIsLoggedIn(true);
              } else {
                alert("❌ Invalid credentials");
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 font-sans text-gray-800">
      <Navbar setIsLoggedIn={setIsLoggedIn} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container">
        <div className="mb-6 flex items-center gap-4">
          <label className="text-lg font-semibold">Select Line:</label>
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="line4">Line 4</option>
            <option value="line5">Line 5</option>
          </select>
        </div>

        {activeTab === "live" && (
          <div className="grid md:grid-cols-2 gap-8">
            {SENSOR_IDS.map((sensorId) => {
              const data = sensorDataMap[sensorId] || [];
              const lastTemp = data.length > 0 ? data[data.length - 1].temperature : null;

              return (
                <div key={sensorId} className="card">
                  <h3>📡 {sensorId.toUpperCase()}</h3>
                  {lastTemp !== null && (
                    <div className={`temp ${getAlertColorClass(lastTemp)}`}>
                      {getAlertText(lastTemp)}: {lastTemp.toFixed(2)}°C
                    </div>
                  )}
                  <div className="plot">
                    <Plot
                      data={[{
                        x: data.map((d) => d.timestamp),
                        y: data.map((d) => d.temperature),
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "#2563eb" },
                      }]}
                      layout={{
                        height: 250,
                        title: "Live Temperature",
                        margin: { t: 30, l: 40, r: 10, b: 40 },
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "past" && (
          <div className="grid md:grid-cols-2 gap-8">
            {SENSOR_IDS.map((sensorId) => {
              const history = historicalData[sensorId] || [];
              return (
                <div key={sensorId} className="card">
                  <h3>📡 {sensorId.toUpperCase()}</h3>
                  <div className="date-picker-container">
                    <input
                      type="date"
                      value={sensorDateRange[sensorId]?.startDate || ""}
                      onChange={(e) => handleDateChange(sensorId, "startDate", e.target.value)}
                    />
                    <input
                      type="date"
                      value={sensorDateRange[sensorId]?.endDate || ""}
                      onChange={(e) => handleDateChange(sensorId, "endDate", e.target.value)}
                    />
                    <button className="button" onClick={() => fetchHistoricalData(sensorId)}>
                      Load Historical
                    </button>
                  </div>
                  {history.length > 0 && (
                    <Plot
                      data={[{
                        x: history.map((d) => d.timestamp),
                        y: history.map((d) => d.temperature),
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "#f97316" },
                      }]}
                      layout={{
                        height: 250,
                        title: "Historical Data",
                        margin: { t: 30, l: 40, r: 10, b: 40 },
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
