import { GoogleGenAI } from "@google/genai";
import { ModelType, AspectRatio, ImageSize, Language } from "../types";

// Helper to ensure we get a fresh client with the latest selected key
const getClient = () => {
  // process.env.API_KEY is automatically injected/updated by the environment when window.aistudio selects a key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

export interface GenerateImageParams {
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  referenceImages?: string[]; // Array of base64 strings
}

export const generateImage = async (params: GenerateImageParams): Promise<string> => {
  const ai = getClient();
  
  const parts: any[] = [];

  // Add reference images first if they exist
  if (params.referenceImages && params.referenceImages.length > 0) {
    params.referenceImages.forEach((base64Img) => {
      const base64Data = base64Img.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/png',
        }
      });
    });
  }

  // Add text prompt
  parts.push({ text: params.prompt });

  // Using generateContent for nano banana pro (gemini-3-pro-image-preview)
  const response = await ai.models.generateContent({
    model: ModelType.NANO_BANANA_PRO,
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio,
        imageSize: params.imageSize,
      },
    },
  });

  // Extract image from response
  // The output response may contain both image and text parts; iterate to find image.
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data found in response");
};

export interface EditImageParams {
  imageBase64: string; // Base64 string without data prefix if possible, or we strip it
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize; // Used for Upscaling/High-Res editing
}

export const editImage = async (params: EditImageParams): Promise<string> => {
  const ai = getClient();

  // Strip header if present
  const base64Data = params.imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const response = await ai.models.generateContent({
    model: ModelType.NANO_BANANA_PRO,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png', // Assuming PNG or standard image
          },
        },
        {
          text: params.prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio,
        imageSize: params.imageSize,
      },
    },
  });

   if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data found in response");
};

export const generatePromptFromImage = async (base64Image: string, lang: Language = 'en'): Promise<string> => {
  const ai = getClient();
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const promptRequest = lang === 'vi' 
    ? "Phân tích hình ảnh này và viết một câu lệnh prompt chi tiết để tái tạo nó bằng AI. Tập trung vào chủ thể, ánh sáng, phong cách và bố cục. Giữ ngắn gọn, tối đa 4 câu. Trả lời bằng Tiếng Việt."
    : "Analyze this image and write a detailed prompt to recreate it using AI. Focus on subject, lighting, style, and composition. Keep it concise, maximum 4 sentences.";

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest', // Using Flash for fast vision-to-text analysis
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          },
        },
        {
          text: promptRequest,
        },
      ],
    },
  });

  return response.text || "Could not generate prompt description.";
};