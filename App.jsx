import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

// 🚦 Helper: Get color class based on temp
const getAlertColor = (temp) => {
  if (temp > 220) return "bg-red-500";
  if (temp > 200) return "bg-yellow-400";
  return "bg-green-500";
};

function App() {
  // 🔐 Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🌡️ Realtime and historical data
  const [sensorData, setSensorData] = useState([]);
  const [sensorId, setSensorId] = useState("sensor01");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historicalData, setHistoricalData] = useState([]);

  // 🔄 Fetch real-time data every 3 seconds
  useEffect(() => {
    if (!isLoggedIn) return; // Only fetch if logged in
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/realtime/${sensorId}`);
        console.log("🌡️ New temp:", res.data.temperature);
        setSensorData((prev) => [...prev.slice(-20), res.data]);
      } catch (err) {
        console.error("Failed to fetch sensor data:", err);
      }
    };

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [sensorId, isLoggedIn]);

  // 📊 Fetch historical data based on date range
  const fetchHistoricalData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/historical/${sensorId}?start=${startDate}&end=${endDate}`
      );
      setHistoricalData(response.data);
      console.log("📊 Historical data:", response.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      alert("Could not fetch historical data. Check backend or date range.");
    }
  };

  // 🔐 Login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-sm mx-auto mt-20 border rounded shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">🔐 Login to Dashboard</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 mb-2 w-full border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-4 w-full border rounded"
        />
        <button
          onClick={() => {
            if (username === "admin" && password === "1234") {
              setIsLoggedIn(true);
            } else {
              alert("❌ Invalid credentials");
            }
          }}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  // ✅ Dashboard (shown only when logged in)
  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      {/* 🔓 Logout */}
      <div className="text-right mb-4">
        <button
          onClick={() => {
            setIsLoggedIn(false);
            setUsername("");
            setPassword("");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">🌡️ Rakusens Realtime Dashboard</h1>

      {/* 🚨 Traffic Light Alert */}
      {sensorData.length > 0 && (
        <div
          className={`p-4 rounded mb-4 text-white text-lg font-medium border-2 ${getAlertColor(
            sensorData[sensorData.length - 1].temperature
          )}`}
        >
          🚨 Current Temperature:{" "}
          {sensorData[sensorData.length - 1].temperature.toFixed(2)}°C
        </div>
      )}

      {/* Sensor Selector */}
      <label className="block mb-2 text-lg font-medium">Select Sensor:</label>
      <select
        value={sensorId}
        onChange={(e) => setSensorId(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="sensor01">Sensor 01</option>
        <option value="sensor02">Sensor 02</option>
        <option value="r01">Sensor R01</option>
        <option value="r02">Sensor R02</option>
      </select>

      {/* 📈 Live Plot */}
      <Plot
        data={[
          {
            x: sensorData.map((d) => d.timestamp),
            y: sensorData.map((d) => d.temperature),
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          width: 700,
          height: 400,
          title: `Live Temperature - ${sensorId}`,
        }}
      />

      {/* 📅 Historical Date Picker */}
      <label className="block mt-6 mb-2 font-medium">Select Date Range:</label>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={fetchHistoricalData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load History
        </button>
      </div>

      {/* 📊 Historical Chart */}
      {historicalData.length > 0 && (
        <Plot
          data={[
            {
              x: historicalData.map((d) => d.timestamp),
              y: historicalData.map((d) => d.temperature),
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "orange" },
            },
          ]}
          layout={{
            width: 700,
            height: 400,
            title: `Historical Data - ${sensorId}`,
          }}
        />
      )}
    </div>
  );
}

export default App;
