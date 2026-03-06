import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Create a sample dataset with 50+ crops based on ideal requirements
crops_data = [
    {"crop": "Rice", "N": 90, "P": 42, "K": 43, "ph": 6.5, "temp": 25, "hum": 80, "rain": 200},
    {"crop": "Maize", "N": 80, "P": 40, "K": 20, "ph": 6.2, "temp": 24, "hum": 65, "rain": 75},
    {"crop": "Chickpea", "N": 40, "P": 60, "K": 80, "ph": 7.0, "temp": 20, "hum": 15, "rain": 80},
    {"crop": "Kidneybeans", "N": 20, "P": 60, "K": 20, "ph": 5.8, "temp": 20, "hum": 20, "rain": 100},
    {"crop": "Pigeonpeas", "N": 20, "P": 70, "K": 20, "ph": 6.5, "temp": 28, "hum": 50, "rain": 150},
    {"crop": "Mothbeans", "N": 20, "P": 40, "K": 20, "ph": 7.0, "temp": 28, "hum": 55, "rain": 50},
    {"crop": "Mungbean", "N": 20, "P": 40, "K": 20, "ph": 6.8, "temp": 28, "hum": 85, "rain": 50},
    {"crop": "Blackgram", "N": 40, "P": 60, "K": 20, "ph": 7.2, "temp": 28, "hum": 65, "rain": 70},
    {"crop": "Lentil", "N": 20, "P": 60, "K": 20, "ph": 6.5, "temp": 22, "hum": 65, "rain": 50},
    {"crop": "Pomegranate", "N": 20, "P": 10, "K": 40, "ph": 6.2, "temp": 22, "hum": 90, "rain": 100},
    {"crop": "Banana", "N": 100, "P": 80, "K": 50, "ph": 6.0, "temp": 27, "hum": 80, "rain": 200},
    {"crop": "Mango", "N": 20, "P": 25, "K": 30, "ph": 5.5, "temp": 30, "hum": 50, "rain": 100},
    {"crop": "Grapes", "N": 25, "P": 125, "K": 200, "ph": 6.0, "temp": 23, "hum": 82, "rain": 70},
    {"crop": "Watermelon", "N": 100, "P": 20, "K": 50, "ph": 6.5, "temp": 25, "hum": 85, "rain": 50},
    {"crop": "Muskmelon", "N": 100, "P": 20, "K": 50, "ph": 6.5, "temp": 28, "hum": 90, "rain": 25},
    {"crop": "Apple", "N": 20, "P": 125, "K": 200, "ph": 6.0, "temp": 22, "hum": 92, "rain": 125},
    {"crop": "Orange", "N": 20, "P": 10, "K": 10, "ph": 7.5, "temp": 24, "hum": 92, "rain": 110},
    {"crop": "Papaya", "N": 50, "P": 50, "K": 50, "ph": 6.5, "temp": 33, "hum": 92, "rain": 150},
    {"crop": "Coconut", "N": 20, "P": 10, "K": 30, "ph": 6.0, "temp": 27, "hum": 95, "rain": 175},
    {"crop": "Jute", "N": 80, "P": 40, "K": 40, "ph": 6.8, "temp": 25, "hum": 80, "rain": 175},
    {"crop": "Cotton", "N": 120, "P": 40, "K": 20, "ph": 6.0, "temp": 24, "hum": 55, "rain": 80},
    {"crop": "Coffee", "N": 100, "P": 20, "K": 30, "ph": 5.5, "temp": 25, "hum": 55, "rain": 150},
    {"crop": "Tea", "N": 80, "P": 20, "K": 20, "ph": 5.0, "temp": 22, "hum": 80, "rain": 200},
    {"crop": "Rubber", "N": 50, "P": 30, "K": 60, "ph": 5.0, "temp": 28, "hum": 80, "rain": 250},
    {"crop": "Turmeric", "N": 60, "P": 50, "K": 50, "ph": 6.0, "temp": 25, "hum": 75, "rain": 150},
    {"crop": "Cumin", "N": 30, "P": 20, "K": 20, "ph": 7.5, "temp": 28, "hum": 40, "rain": 30},
    {"crop": "Tobacco", "N": 80, "P": 40, "K": 100, "ph": 5.5, "temp": 26, "hum": 70, "rain": 100},
    {"crop": "Sugarcane", "N": 150, "P": 60, "K": 60, "ph": 6.5, "temp": 28, "hum": 60, "rain": 150},
    {"crop": "Wheat", "N": 120, "P": 60, "K": 40, "ph": 6.5, "temp": 15, "hum": 40, "rain": 60},
    {"crop": "Barley", "N": 60, "P": 30, "K": 30, "ph": 7.0, "temp": 15, "hum": 30, "rain": 50},
    {"crop": "Mustard", "N": 80, "P": 40, "K": 20, "ph": 6.5, "temp": 18, "hum": 50, "rain": 40},
    {"crop": "Soybean", "N": 20, "P": 60, "K": 40, "ph": 6.5, "temp": 25, "hum": 60, "rain": 80},
    {"crop": "Sunflower", "N": 60, "P": 40, "K": 20, "ph": 7.0, "temp": 25, "hum": 50, "rain": 70},
    {"crop": "Potato", "N": 120, "P": 80, "K": 150, "ph": 5.5, "temp": 18, "hum": 70, "rain": 60},
    {"crop": "Tomato", "N": 100, "P": 60, "K": 80, "ph": 6.2, "temp": 24, "hum": 65, "rain": 75},
    {"crop": "Onion", "N": 80, "P": 40, "K": 60, "ph": 6.5, "temp": 20, "hum": 60, "rain": 50},
    {"crop": "Garlic", "N": 60, "P": 40, "K": 40, "ph": 6.5, "temp": 18, "hum": 55, "rain": 40},
    {"crop": "Ginger", "N": 60, "P": 50, "K": 50, "ph": 6.0, "temp": 25, "hum": 75, "rain": 150},
    {"crop": "Cardamom", "N": 40, "P": 40, "K": 60, "ph": 5.5, "temp": 20, "hum": 85, "rain": 250},
    {"crop": "Coriander", "N": 40, "P": 30, "K": 20, "ph": 7.0, "temp": 22, "hum": 50, "rain": 40},
    {"crop": "Chilli", "N": 80, "P": 40, "K": 40, "ph": 6.5, "temp": 26, "hum": 60, "rain": 80},
    {"crop": "Brinjal", "N": 100, "P": 60, "K": 40, "ph": 6.5, "temp": 25, "hum": 65, "rain": 80},
    {"crop": "Okra", "N": 80, "P": 40, "K": 40, "ph": 6.5, "temp": 28, "hum": 70, "rain": 100},
    {"crop": "Cabbage", "N": 120, "P": 60, "K": 60, "ph": 6.5, "temp": 18, "hum": 75, "rain": 60},
    {"crop": "Cauliflower", "N": 120, "P": 60, "K": 60, "ph": 6.5, "temp": 18, "hum": 75, "rain": 60},
    {"crop": "Carrot", "N": 60, "P": 40, "K": 80, "ph": 6.0, "temp": 18, "hum": 70, "rain": 50},
    {"crop": "Radish", "N": 60, "P": 40, "K": 60, "ph": 6.5, "temp": 18, "hum": 65, "rain": 40},
    {"crop": "Spinach", "N": 80, "P": 40, "K": 40, "ph": 6.5, "temp": 18, "hum": 70, "rain": 50},
    {"crop": "Peas", "N": 40, "P": 60, "K": 40, "ph": 6.5, "temp": 15, "hum": 60, "rain": 60},
    {"crop": "Guava", "N": 50, "P": 30, "K": 40, "ph": 6.5, "temp": 28, "hum": 60, "rain": 100},
    {"crop": "Sapota", "N": 40, "P": 30, "K": 40, "ph": 6.5, "temp": 28, "hum": 70, "rain": 120}
]

# Create augmented data for training
def augment_data(base_data, samples_per_crop=100):
    augmented = []
    for item in base_data:
        crop = item["crop"]
        for _ in range(samples_per_crop):
            row = {
                "N": max(0, item["N"] + np.random.normal(0, 5)),
                "P": max(0, item["P"] + np.random.normal(0, 5)),
                "K": max(0, item["K"] + np.random.normal(0, 5)),
                "ph": max(0, min(14, item["ph"] + np.random.normal(0, 0.2))),
                "temp": item["temp"] + np.random.normal(0, 2),
                "hum": max(0, min(100, item["hum"] + np.random.normal(0, 5))),
                "rain": max(0, item["rain"] + np.random.normal(0, 20)),
                "label": crop
            }
            augmented.append(row)
    return pd.DataFrame(augmented)

df = augment_data(crops_data)
X = df.drop('label', axis=1)
y = df['label']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the model and the crop requirement table
os.makedirs('server/ml', exist_ok=True)
joblib.dump(model, 'server/ml/crop_model.joblib')
pd.DataFrame(crops_data).to_csv('server/ml/crop_requirements.csv', index=False)

print("Model trained and saved with 50+ crops.")
