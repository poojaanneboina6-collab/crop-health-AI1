import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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
        { name: "Late Blight", treatment: "Copper-based fungicide" },
        { name: "Leaf Curl", treatment: "Neem oil application" },
        { name: "Healthy", treatment: "None needed" },
        { name: "Powdery Mildew", treatment: "Sulfur dust or potassium bicarbonate" }
      ];
      
      // Pick random disease to simulate AI output
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = 85 + (Math.random() * 14); // 85% to 99%
      
      // MOCK SEARCH SUPPLIER 
      // If coordinates are provided, pretend we found a place near them.
      let supplierName = "Global Ag-Supply Chain";
      let supplierAddress = "Online Delivery";
      
      if (input.latitude && input.longitude) {
         supplierName = "Local Farmers Co-op";
         supplierAddress = `${Math.abs(input.latitude).toFixed(2)}° N, ${Math.abs(input.longitude).toFixed(2)}° W - 2.4 miles away`;
      }
      
      // MOCK TRANSLATION
      // Outputting a translated string based on input.language
      let translatedOutput = `Disease detected: ${randomDisease.name}. Recommended treatment: ${randomDisease.treatment}. Supplier: ${supplierName}.`;
      
      if (input.language === 'es') {
        translatedOutput = `Enfermedad detectada: ${randomDisease.name}. Tratamiento recomendado: ${randomDisease.treatment}. Proveedor: ${supplierName}.`;
      } else if (input.language === 'fr') {
        translatedOutput = `Maladie détectée: ${randomDisease.name}. Traitement recommandé: ${randomDisease.treatment}. Fournisseur: ${supplierName}.`;
      } else if (input.language === 'hi') {
        translatedOutput = `बीमारी का पता चला: ${randomDisease.name}. अनुशंसित उपचार: ${randomDisease.treatment}. सप्लायर: ${supplierName}.`;
      }

      const newScan = await storage.createScan({
        imageUrl: input.image, // Ideally upload to S3/Cloud Storage, here just storing base64
        language: input.language,
        diseaseName: randomDisease.name,
        diseaseConfidence: confidence,
        treatment: randomDisease.treatment,
        supplierName,
        supplierAddress,
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
