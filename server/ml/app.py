from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model and requirements
model = joblib.load('server/ml/crop_model.joblib')
req_df = pd.read_csv('server/ml/crop_requirements.csv')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Required inputs: N, P, K, ph, temp, hum, rain
    inputs = [
        data.get('N'), data.get('P'), data.get('K'),
        data.get('ph'), data.get('temp'), data.get('hum'), data.get('rain')
    ]
    
    if any(v is None for v in inputs):
        return jsonify({"error": "Missing input parameters"}), 400
        
    # Predict top 3
    features = np.array([inputs])
    probs = model.predict_proba(features)[0]
    classes = model.classes_
    
    top_indices = np.argsort(probs)[-3:][::-1]
    recommendations = []
    
    for i in top_indices:
        crop_name = classes[i]
        confidence = float(probs[i])
        
        # Get ideal requirements for gap analysis
        ideal = req_df[req_df['crop'] == crop_name].iloc[0].to_dict()
        
        recommendations.append({
            "crop": crop_name,
            "confidence": confidence,
            "ideal": ideal
        })
        
    return jsonify({
        "status": "success",
        "recommendations": recommendations
    })

if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5001))
    app.run(host='0.0.0.0', port=port)
