import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fetch from "node-fetch";
import { insertRecommendationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/recommend", async (req, res) => {
    try {
      const { N, P, K, ph, location, rainfall } = req.body;

      // Real-world logic: In a production app, we would use a Weather API key here.
      // For now, we use realistic Indian climate simulation based on typical state averages.
      const temp = 22 + Math.random() * 12; // 22-34°C typical range
      const hum = 40 + Math.random() * 50; // 40-90% humidity
      const rain = rainfall || (50 + Math.random() * 250); // 50-300mm range

      // Call Python ML service for prediction
      const mlResponse = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ N, P, K, ph, temp, hum, rain })
      });

      if (!mlResponse.ok) {
        throw new Error("ML service error");
      }

      const result = await mlResponse.json();
      
      // Persist the recommendation
      await storage.createRecommendation({
        location,
        n: Number(N),
        p: Number(P),
        k: Number(K),
        ph: Number(ph),
        rainfall: Number(rain),
        temp,
        humidity: hum,
        recommendedCrops: JSON.stringify(result.recommendations)
      });

      res.json(result);
    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ message: "Failed to get crop recommendations" });
    }
  });

  app.get(api.scans.list.path, async (req, res) => {
    const scansList = await storage.getScans();
    res.json(scansList);
  });

  app.get(api.scans.get.path, async (req, res) => {
    const scan = await storage.getScan(Number(req.params.id));
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    res.json(scan);
  });

  app.post(api.scans.create.path, async (req, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);
      
      // MOCK AI DETECTION & DB LOOKUP
      // For the prototype, we are generating a mock response.
      // In a real system, you would pass input.image to a CV model.
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const diseases = [
        { name: "Late Blight", treatment: "Copper-based fungicide", name_te: "లేట్ బ్లైట్", treatment_te: "రాగి ఆధారిత శిలీంద్ర సంహారిణి", name_hi: "पछेती झुलसा", treatment_hi: "तांबा आधारित कवकनाशी" },
        { name: "Leaf Curl", treatment: "Neem oil application", name_te: "ఆకు ముడత", treatment_te: "వేప నూనె వాడకం", name_hi: "लीफ कर्ल", treatment_hi: "नीम के तेल का उपयोग" },
        { name: "Healthy", treatment: "None needed", name_te: "ఆరోగ్యకరమైనది", treatment_te: "ఏమీ అవసరం లేదు", name_hi: "स्वस्थ", treatment_hi: "किसी उपचार की आवश्यकता नहीं है" },
        { name: "Powdery Mildew", treatment: "Sulfur dust or potassium bicarbonate", name_te: "బూజు తెగులు", treatment_te: "సల్ఫర్ పొడి లేదా పొటాషియం బైకార్బోనేట్", name_hi: "पाउडरी मिल्ड्यू", treatment_hi: "सल्फर डस्ट या पोटेशियम बाइकार्बोनेट" },
        { name: "Rice Blast", treatment: "Tricyclazole spray", name_te: "వరి అగ్గి తెగులు", treatment_te: "ట్రైసైక్లాజోల్ స్ప్రే", name_hi: "धान का ब्लास्ट", treatment_hi: "ट्राइसाइक्लाज़ोल स्प्रे" },
        { name: "Bacterial Blight", treatment: "Streptocycline spray", name_te: "బాక్టీరియల్ బ్లైట్", treatment_te: "స్ట్రెప్టోసైక్లిన్ స్ప్రే", name_hi: "बैक्टीरियल ब्लाइट", treatment_hi: "स्ट्रेप्टोसाइक्लिन स्प्रे" },
        { name: "Rust", treatment: "Mancozeb application", name_te: "తుప్పు తెగులు", treatment_te: "మాంకోజెబ్ వాడకం", name_hi: "रस्ट (गेरूआ)", treatment_hi: "मैंकोजेब का उपयोग" },
        { name: "Tomato Early Blight", treatment: "Chlorothalonil fungicide", name_te: "టమోటా ముందస్తు తెగులు", treatment_te: "క్లోరోథలోనిల్ శిలీంద్ర సంహారిణి", name_hi: "टमाटर अगेती झुलसा", treatment_hi: "क्लोरोथालोनिल कवकनाशी" },
        { name: "Citrus Canker", treatment: "Pruning and copper spray", name_te: "నిమ్మ గజ్జి తెగులు", treatment_te: "కత్తిరింపు మరియు రాగి స్ప్రే", name_hi: "सिट्रस कैंकर", treatment_hi: "छंटाई और तांबा स्प्रे" },
        { name: "Black Rot", treatment: "Crop rotation and clean seeds", name_te: "నలుపు కుళ్లు తెగులు", treatment_te: "పంట మార్పిడి మరియు శుభ్రమైన విత్తనాలు", name_hi: "ब्लैक रॉट", treatment_hi: "फसल चक्र और साफ बीज" }
      ];

      // Simulate 50+ diseases by generating variants if needed, but here we provide a solid base
      // For the prototype, we use a rich list and random selection.
      
      // Pick random disease to simulate AI output
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = 85 + (Math.random() * 14); // 85% to 99%
      
      // MOCK SEARCH SUPPLIER 
      // Supported Indian States list for location mocking
      const indianStates = [
        "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", 
        "Gujarat", "Rajasthan", "Punjab", "Haryana", "Uttar Pradesh", "Bihar", 
        "West Bengal", "Madhya Pradesh", "Odisha", "Kerala", "Assam"
      ];
      const randomState = indianStates[Math.floor(Math.random() * indianStates.length)];

      let supplierName = "Bharat Agri-Supply Chain";
      let supplierAddress = "Pan-India Delivery";
      
      if (input.latitude && input.longitude) {
         supplierName = `${randomState} Farmers Cooperative`;
         supplierAddress = `${randomState}, India - Nearest Hub: 5km away`;
      }
      
      // MOCK TRANSLATION
      // Outputting a translated string based on input.language
      let dName = randomDisease.name;
      let dTreatment = randomDisease.treatment;
      let sName = supplierName;
      let sAddress = supplierAddress;

      if (input.language === 'te') {
        dName = randomDisease.name_te || randomDisease.name;
        dTreatment = randomDisease.treatment_te || randomDisease.treatment;
        sName = `${randomState} రైతు సహకార సంఘం`;
        sAddress = `${randomState}, భారతదేశం - సమీప కేంద్రం: 5 కి.మీ దూరంలో`;
      } else if (input.language === 'hi') {
        dName = randomDisease.name_hi || randomDisease.name;
        dTreatment = randomDisease.treatment_hi || randomDisease.treatment;
        sName = `${randomState} किसान सहकारी समिति`;
        sAddress = `${randomState}, भारत - निकटतम केंद्र: 5 किमी दूर`;
      }

      let translatedOutput = `Disease detected: ${dName}. Recommended treatment: ${dTreatment}. Supplier: ${sName}. Address: ${sAddress}.`;
      
      if (input.language === 'te') {
        translatedOutput = `గుర్తించబడిన వ్యాధి: ${dName}. సిఫార్సు చేయబడిన చికిత్స: ${dTreatment}. సరఫరాదారు: ${sName}. చిరునామా: ${sAddress}.`;
      } else if (input.language === 'hi') {
        translatedOutput = `पहचानी गई बीमारी: ${dName}। अनुशंसित उपचार: ${dTreatment}। आपूर्तिकर्ता: ${sName}। पता: ${sAddress}।`;
      }

      const newScan = await storage.createScan({
        imageUrl: input.image,
        language: input.language,
        diseaseName: dName,
        diseaseConfidence: confidence,
        treatment: dTreatment,
        supplierName: sName,
        supplierAddress: sAddress,
        translatedOutput
      });

      res.status(201).json(newScan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
