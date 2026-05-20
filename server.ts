import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { faker } from "@faker-js/faker";
import { 
  linearSearch, 
  binarySearch, 
  jumpSearch,
  interpolationSearch,
  Vehicle
} from "./src/lib/algorithms.ts";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// --- GENERIC DATABASE GENERATOR ---
const generateDatabase = (count: number, includeTarget?: string): Vehicle[] => {
  const data: Vehicle[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: faker.string.uuid(),
      ownerName: faker.person.fullName(),
      plateNumber: faker.helpers.replaceSymbols('???-####').toUpperCase(),
      vehicleType: faker.vehicle.type(),
      city: faker.location.city(),
      registrationDate: faker.date.past().toISOString().split('T')[0]
    });
  }
  
  if (includeTarget) {
    data[Math.floor(Math.random() * count)] = {
      id: faker.string.uuid(),
      ownerName: "Zeeshan Ahmed",
      plateNumber: includeTarget,
      vehicleType: "Premium Sedan",
      city: "New Delhi",
      registrationDate: "2024-05-19"
    };
  }
  
  return data;
};

// Benchmark datasets
const datasets = {
  small: generateDatabase(500),
  medium: generateDatabase(1000, "ABC-1034"),
  large: generateDatabase(5000),
};

// API ROUTES

// LPR Endpoint using Gemini
app.post("/api/lpr/recognize", async (req, res) => {
  try {
    const { image } = req.body; // base64
    if (!image) return res.status(400).json({ error: "Image data required" });

    const mimeType = image.includes(';') ? image.split(';')[0].split(':')[1] : "image/jpeg";
    const dataPart = image.includes(',') ? image.split(',')[1] : image;

    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const generateWithRetry = async (retries = 3) => {
      let lastError;
      for (let i = 0; i < retries; i++) {
        try {
          return await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: {
              parts: [
                { inlineData: { mimeType, data: dataPart } },
                { text: "Extract the license plate number from this image. It is likely an Indian license plate. Return ONLY the plate number text (e.g. ABC-1234). If not found, return 'NOT_FOUND'." }
              ]
            }
          });
        } catch (error: any) {
          lastError = error;
          if (error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand')) {
            await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1))); // Exponential-ish backoff
            continue;
          }
          throw error;
        }
      }
      throw lastError;
    };

    const response = await generateWithRetry();

    const plateNumber = response.text?.trim() || "NOT_FOUND";
    res.json({ plateNumber });
  } catch (error) {
    console.error("LPR Error:", error);
    res.status(500).json({ error: "LPR failed" });
  }
});

// Single Record Search Endpoint
app.post("/api/search", (req, res) => {
  const { plateNumber, algorithm, compareAll } = req.body;
  const cleanPlate = (plateNumber || "").toString().trim().toUpperCase();
  
  if (cleanPlate && cleanPlate !== "NOT_FOUND") {
    const exists = datasets.medium.some(v => v.plateNumber === cleanPlate);
    if (!exists) {
      const newVehicle: Vehicle = {
        id: faker.string.uuid(),
        ownerName: faker.person.fullName(),
        plateNumber: cleanPlate,
        vehicleType: faker.vehicle.type(),
        city: faker.location.city(),
        registrationDate: new Date().toISOString().split('T')[0]
      };
      datasets.medium.unshift(newVehicle);
    }
  }

  const data = datasets.medium; // Use consistent dataset
  
  // Sort for algorithms that need it
  const sortedData = [...data].sort((a, b) => a.plateNumber.localeCompare(b.plateNumber));
  
  const algorithms = [
    { id: 'linear', name: 'Linear Search', complexity: 'O(n)', space: 'O(1)', run: (d: any, p: string) => linearSearch(d, p) },
    { id: 'binary', name: 'Binary Search', complexity: 'O(log n)', space: 'O(1)', run: (d: any, p: string) => binarySearch(d, p) },
    { id: 'jump', name: 'Jump Search', complexity: 'O(√n)', space: 'O(1)', run: (d: any, p: string) => jumpSearch(d, p) },
    { id: 'interpolation', name: 'Interpolation Search', complexity: 'O(log log n)', space: 'O(1)', run: (d: any, p: string) => interpolationSearch(d, p) },
  ];

  const foundIndexRaw = data.findIndex(v => v.plateNumber === cleanPlate);
  const foundIndexSorted = sortedData.findIndex(v => v.plateNumber === cleanPlate);
  const foundRecord = foundIndexRaw !== -1 ? data[foundIndexRaw] : null;

  if (compareAll) {
    const comparisons = algorithms.map(algo => {
      const source = algo.id === 'linear' ? data : sortedData;
      const start = performance.now();
      const result = algo.run(source, cleanPlate);
      const end = performance.now();
      return {
        id: algo.id,
        name: algo.name,
        complexity: algo.complexity,
        space: algo.space,
        timeMs: end - start,
        comparisons: result.comparisons,
        iterations: result.iterations,
        found: result.index !== -1,
        index: result.index
      };
    });
    return res.json({ 
      comparisons,
      found: foundIndexRaw !== -1,
      record: foundRecord,
      index: foundIndexRaw,
      indexRaw: foundIndexRaw,
      indexSorted: foundIndexSorted
    });
  }

  const selectedAlgo = algorithms.find(a => a.id === algorithm) || algorithms[0];
  const source = selectedAlgo.id === 'linear' ? data : sortedData;
  const start = performance.now();
  const result = selectedAlgo.run(source, cleanPlate);
  const end = performance.now();

  res.json({
    found: result.index !== -1,
    record: result.index !== -1 ? source[result.index] : null,
    index: result.index,
    indexRaw: foundIndexRaw,
    indexSorted: foundIndexSorted,
    timeMs: end - start,
    comparisons: result.comparisons,
    iterations: result.iterations,
    complexity: selectedAlgo.complexity,
    space: selectedAlgo.space,
    name: selectedAlgo.name
  });
});

// Database Endpoints
app.get("/api/database", (req, res) => {
  res.json(datasets.medium);
});

app.post("/api/database", (req, res) => {
  const { ownerName, plateNumber, vehicleType, city, registrationDate } = req.body;
  if (!ownerName || !plateNumber) {
    return res.status(400).json({ error: "Owner name and Plate number are required" });
  }
  const newVehicle: Vehicle = {
    id: faker.string.uuid(),
    ownerName,
    plateNumber: plateNumber.toUpperCase().trim(),
    vehicleType: vehicleType || "Sedan",
    city: city || "Unknown",
    registrationDate: registrationDate || new Date().toISOString().split('T')[0]
  };
  // Prepend to dataset so it's instantly visible at the top of the database
  datasets.medium.unshift(newVehicle);
  res.status(201).json(newVehicle);
});

app.put("/api/database/:id", (req, res) => {
  const { id } = req.params;
  const { ownerName, plateNumber, vehicleType, city, registrationDate } = req.body;
  const vehicle = datasets.medium.find(v => v.id === id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  if (ownerName) vehicle.ownerName = ownerName;
  if (plateNumber) vehicle.plateNumber = plateNumber.toUpperCase().trim();
  if (vehicleType) vehicle.vehicleType = vehicleType;
  if (city) vehicle.city = city;
  if (registrationDate) vehicle.registrationDate = registrationDate;
  res.json(vehicle);
});

app.delete("/api/database/:id", (req, res) => {
  const { id } = req.params;
  const index = datasets.medium.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  datasets.medium.splice(index, 1);
  res.json({ success: true, message: "Vehicle deleted successfully" });
});

// VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
