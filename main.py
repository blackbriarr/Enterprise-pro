from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection
import traceback
import mysql.connector

app = FastAPI()

# CORS Configuration
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_table(sensor_id: str) -> str:
    """
    Determine the table based on sensor ID.
    r01 - r08 -> line4
    r09 - r18 -> line5
    """
    try:
        sensor_num = int(sensor_id[1:])
        if 1 <= sensor_num <= 8:
            return "line4"
        elif 9 <= sensor_num <= 18:
            return "line5"
        else:
            raise ValueError("Sensor number out of expected range.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid sensor ID format.")

@app.get("/api/realtime/{sensor_id}")
def get_realtime_data(sensor_id: str):
    try:
        table = get_table(sensor_id)
        query = f"SELECT timestamp, {sensor_id} FROM {table} ORDER BY timestamp DESC LIMIT 1"

        print(f"[DEBUG] Executing Query: {query}")
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(query)

        result = cursor.fetchone()
        if not result:
            print(f"[DEBUG] No data found for sensor: {sensor_id}")
            raise HTTPException(status_code=404, detail="No data found for this sensor.")

        timestamp, temperature = result
        print(f"[DEBUG] Result -> Timestamp: {timestamp}, Temperature: {temperature}")

        return {
            "sensor_id": sensor_id,
            "timestamp": timestamp,
            "temperature": temperature,
        }

    except mysql.connector.Error as sql_err:
        print("[ERROR] MySQL Error:", sql_err)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"MySQL error: {sql_err}")

    except Exception as e:
        print("[ERROR] Unexpected Error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Server error occurred.")

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
