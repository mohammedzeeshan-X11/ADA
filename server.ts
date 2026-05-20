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
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
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

// Benchmark Endpoint
app.get("/api/benchmark", (req, res) => {
  const results: any[] = [];
  const sizes = ["small", "medium", "large"];
  
  sizes.forEach(size => {
    const data = datasets[size as keyof typeof datasets];
    
    // Benchmarking Sorting
    const startSort = performance.now();
    const { comparisons: qComp, swaps: qSwap } = quickSort(data);
    const endSort = performance.now();

    results.push({
      size: data.length,
      category: 'Sorting',
      label: 'Quick Sort',
      time: endSort - startSort,
      comparisons: qComp,
      swaps: qSwap
    });

    const startBubble = performance.now();
    // Only bubble sort small if too large it hangs
    if (data.length <= 1000) {
      bubbleSort(data);
    }
    const endBubble = performance.now();

    results.push({
      size: data.length,
      category: 'Sorting',
      label: 'Bubble Sort',
      time: endBubble - startBubble,
      comparisons: data.length > 1000 ? 0 : (data.length * data.length) / 2, // approximated if skipped
      skipped: data.length > 1000
    });
  });

  res.json(results);
});

// Single Record Search Endpoint
app.post("/api/search", (req, res) => {
  const { plateNumber, algorithm, compareAll } = req.body;
  const data = datasets.medium; // Use consistent dataset (1000 records)
  
  // Sort for algorithms that need it
  const sortedData = [...data].sort((a, b) => a.plateNumber.localeCompare(b.plateNumber));
  
  const algorithms = [
    { id: 'linear', name: 'Linear Search', complexity: 'O(n)', space: 'O(1)', run: (d: any, p: string) => linearSearch(d, p) },
    { id: 'binary', name: 'Binary Search', complexity: 'O(log n)', space: 'O(1)', run: (d: any, p: string) => binarySearch(d, p) },
    { id: 'jump', name: 'Jump Search', complexity: 'O(√n)', space: 'O(1)', run: (d: any, p: string) => jumpSearch(d, p) },
    { id: 'interpolation', name: 'Interpolation Search', complexity: 'O(log log n)', space: 'O(1)', run: (d: any, p: string) => interpolationSearch(d, p) },
  ];

  if (compareAll) {
    const comparisons = algorithms.map(algo => {
      const source = algo.id === 'linear' ? data : sortedData;
      const start = performance.now();
      const result = algo.run(source, plateNumber);
      const end = performance.now();
      return {
        id: algo.id,
        name: algo.name,
        complexity: algo.complexity,
        space: algo.space,
        timeMs: end - start,
        comparisons: result.comparisons,
        iterations: result.iterations,
        found: result.index !== -1
      };
    });
    return res.json({ comparisons });
  }

  const selectedAlgo = algorithms.find(a => a.id === algorithm) || algorithms[0];
  const source = selectedAlgo.id === 'linear' ? data : sortedData;
  const start = performance.now();
  const result = selectedAlgo.run(source, plateNumber);
  const end = performance.now();

  res.json({
    found: result.index !== -1,
    record: result.index !== -1 ? source[result.index] : null,
    index: result.index,
    timeMs: end - start,
    comparisons: result.comparisons,
    iterations: result.iterations,
    complexity: selectedAlgo.complexity,
    space: selectedAlgo.space,
    name: selectedAlgo.name
  });
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
