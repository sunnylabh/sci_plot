import { GoogleGenAI } from "@google/genai";
import { DataPoint, DataStats } from "../types";
import { downsampleData } from "../utils/dataUtils";

export const analyzeData = async (
  data: DataPoint[],
  stats: DataStats,
  xLabel: string,
  yLabel: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // Since we cannot ask for it, we return a gentle message if the env is missing in dev
        return "API Key not found in environment. Analysis unavailable.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Create a representative sample to avoid token limits
    const sampleData = downsampleData(data, 30);
    const sampleString = sampleData.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(', ');

    const prompt = `
      As a senior data scientist, analyze the following scientific dataset.
      
      Context:
      - X-Axis: ${xLabel}
      - Y-Axis: ${yLabel}
      
      Statistics:
      - Count: ${stats.count}
      - X Range: ${stats.minX.toFixed(4)} to ${stats.maxX.toFixed(4)}
      - Y Range: ${stats.minY.toFixed(4)} to ${stats.maxY.toFixed(4)}
      - Mean Y: ${stats.meanY.toFixed(4)}
      - Std Dev Y: ${stats.stdY.toFixed(4)}

      Sample Data Points (X, Y):
      [${sampleString}]

      Please provide a concise scientific interpretation. 
      1. Describe the general trend (linear, exponential, periodic, noise, peaks, etc.).
      2. Identify any potential anomalies or significant features (like peaks in spectra).
      3. Suggest what physical phenomenon might be represented based on the axis labels (e.g., if Wavenumber vs Intensity, discuss IR/Raman peaks).
      
      Keep the tone professional and scientific. Format with clear paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "An error occurred while analyzing the data. Please check your connection or API key quota.";
  }
};