import random
from datetime import datetime

def generate_simulated_data(sensor_id):
    temperature = round(random.uniform(170, 230), 2)  # typical baking range
    return {
        "sensor_id": sensor_id,
        "timestamp": datetime.utcnow().isoformat(),
        "temperature": temperature
    }
