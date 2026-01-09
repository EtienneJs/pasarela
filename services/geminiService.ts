
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const productSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      price: { type: Type.NUMBER },
      category: { type: Type.STRING },
      description: { type: Type.STRING },
      imageUrl: { type: Type.STRING }
    },
    required: ["id", "name", "price", "category", "description", "imageUrl"]
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING },
    description: { type: Type.STRING },
    suggestedPrice: { type: Type.NUMBER }
  },
  required: ["name", "category", "description", "suggestedPrice"]
};

export const fetchTrendingProducts = async (category: string = "electronics"): Promise<Product[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 8 unique, high-end trending products in the ${category} category. For imageUrl, use a high quality unsplash link like https://images.unsplash.com/photo-... with relevant keywords. Each product should have a unique, creative name and description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: productSchema
      }
    });

    const products = JSON.parse(response.text);
    return products;
  } catch (error) {
    console.error("Error fetching products from Gemini:", error);
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `fallback-${i}`,
      name: `Premium Product ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 99,
      category: category,
      description: "A high-quality product generated for your premium shopping experience.",
      imageUrl: `https://picsum.photos/seed/${i + 123}/600/400`
    }));
  }
};

export const analyzeProductImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: "Identify this product and provide a creative name, category, detailed description, and a suggested market price in USD." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    }
  });

  return JSON.parse(response.text);
};

export const generateProductScene = async (prompt: string, carBase64: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: carBase64,
              mimeType: 'image/png',
            },
          },
          {
            text: `Generate a hyper-realistic, professional automotive commercial scene. Place the car from the image into this environment: ${prompt}. Maintain the car's color and model accurately. 8k resolution, cinematic lighting, dramatic atmosphere.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const simulateDriveUpload = async (productData: any): Promise<string> => {
  // Simulating a network delay for Google Drive API integration
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const fakeUrl = `https://drive.google.com/file/d/${randomId}/view`;
      console.log("Uploaded to Drive:", productData, "URL:", fakeUrl);
      resolve(fakeUrl);
    }, 2500);
  });
};
