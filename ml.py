import pickle
import pandas as pd

def load_model(model_path):
    with open(model_path, "rb") as f:
        return pickle.load(f)

def make_prediction(model, timestamps):
    # Convert timestamps (list) into a DataFrame with 'ds' column
    future_df = pd.DataFrame(timestamps, columns=["ds"])
    
    # Prophet expects the 'ds' column to be datetime
    future_df["ds"] = pd.to_datetime(future_df["ds"])

    forecast = model.predict(future_df)
    return forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
