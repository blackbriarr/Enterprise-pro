from fastapi import FastAPI, Query
from simulator import generate_simulated_data
from db import get_connection
from ml import load_model, make_prediction
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# ✅ Allow requests from React frontend (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load ML model
model = load_model("models/prophet_r01.pkl")  # Example model

@app.get("/")
def root():
    return {"message": "Rakusens Sensor API running"}

@app.get("/api/realtime/{sensor_id}")
def realtime(sensor_id: str):
    return generate_simulated_data(sensor_id)

@app.get("/api/historical/{sensor_id}")
def historical(sensor_id: str, start: str = Query(...), end: str = Query(...)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT timestamp, temperature FROM sensor_data
        WHERE sensor_id = %s AND timestamp BETWEEN %s AND %s
    """
    cursor.execute(query, (sensor_id, start, end))
    data = cursor.fetchall()
    conn.close()
    return data

@app.post("/api/predict")
def predict(payload: dict):
    timestamps = payload.get("timestamps", [])
    result = make_prediction(model, timestamps)
    return result.to_dict(orient="records")

@app.get("/api/test-db")
def test_db():
    try:
        conn = get_connection()
        return {"message": "Connected to DB successfully!"}
    except Exception as e:
        return {"error": str(e)}
