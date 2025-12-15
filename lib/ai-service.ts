import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AIAnalysisResult {
    title?: string;
    summary: string;
    tags: string[];
    isTextHeavy?: boolean;
    visualFocalPoint?: { x: number; y: number };
}

export async function generateCardMetadata(content: string, contextType: 'link' | 'text' | 'image' = 'text'): Promise<AIAnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set");
        return { summary: "AI Service Unavailable", tags: [] };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    let imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = [];

    if (contextType === 'image') {
        // Content is expected to be base64 string
        // Remove data URL prefix if present for clean base64
        const base64Data = content.replace(/^data:image\/\w+;base64,/, "");

        imageParts = [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg", // Assuming JPEG for now, or detect
                },
            },
        ];
        prompt = `
            You are a helpful assistant.
            Analyze this image.
            
            CRITICAL INSTRUCTION:
            1. Analyze visual vs text balance:
               - "isTextHeavy": Set to TRUE only if the image is a boring document, plain screenshot of text, code, or article WITHOUT significant interesting visuals. (These will get an abstract cover).
               - "isTextHeavy": Set to FALSE if the image contains photos, art, UI designs, or mixed content (even if it has text header). (These will keep their original image).

            2. Visual Focal Point (Smart Crop):
               - Identify the center of the MAIN VISUAL element (the photo, the art, the person).
               - Ignore header text, UI chrome, or surrounding whitespace.
               - Return "visualFocalPoint": { "x": percentage (0-100), "y": percentage (0-100) }.
               - Example: If the main photo is at the bottom, y might be 75 or 80.
               - If it's a general photo, use { "x": 50, "y": 50 }.

            3. Summary & Title Generation (OCR Priority):
               - Goal: Extract the MAIN text content (sentences/paragraphs) in its ORIGINAL LANGUAGE (e.g. Korean).
               - "summary": STRICTLY extract the main caption or body text.
                 - EXCLUDE: "Trending Searches", "Save", numbers (0-9...), "Get in for free", menus, or buttons.
                 - KEEP: The main message/article text. (e.g. "시간이 금방 가는...").
               - "title": Extract the headline from the text.
               - IF NO legible text (Pure Visual):
                 - "summary": Creative description of the visual.
                 - "title": Creative title.

            4. Tags:
               - Generate 5-7 tags in BOTH English and Korean (if applicable) for better searchability.
               - Mix of broad categories (e.g. "Design", "디자인") and specific topics (e.g. "Minimalism", "미니멀리즘").
            
            Return ONLY a JSON object:
            {
                "title": "...",
                "summary": "...",
                "tags": ["..."],
                "isTextHeavy": true/false,
                "visualFocalPoint": { "x": 50, "y": 50 }
            }
        `;
    } else {
        prompt = `
        You are a helpful assistant for a knowledge management app.
        Analyze the following content and provide a concise summary (max 2 sentences) and 3-5 relevant tags.
        Also provide a short, relevant title.
        
        Context Type: ${contextType}
        Content:
        """
        ${content}
        """

        Return ONLY a JSON object:
        {
            "title": "...",
            "summary": "...",
            "tags": ["tag1", "tag2"]
        }
        `;
    }

    try {
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr) as AIAnalysisResult;
    } catch (error) {
        console.error("AI Generation Error:", error);
        return {
            summary: contextType === 'image' ? "Image analysis failed" : content.slice(0, 50) + "...",
            tags: ["AI_Error"]
        };
    }
}

export async function generateCollections(cards: { title: string; tags: string[] }[]): Promise<string[]> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set");
        return ["Design", "Development", "Life", "Work"];
    }

    if (cards.length === 0) return ["All", "Design", "Development", "AI", "Inspiration"];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Limit to 50 cards to avoid token limits for MVP
    const cardSubset = cards.slice(0, 50);
    const cardData = cardSubset.map(c => `- Title: ${c.title}, Tags: ${c.tags.join(", ")}`).join("\n");

    const prompt = `
    You are an expert content curator. 
    Analyze the following list of User Cards (Title + Tags).
    
    Goal: Select the top 5-7 EXISTING TAGS that would serve as the best high-level "Collections" (Filter Categories) for this library.
    
    Rules:
    1. Return ONLY a JSON array of strings: string[].
    2. YOU MUST CHOOSE FROM THE EXISTING TAGS provided in the card data. DO NOT INVENT NEW NAMES.
    3. Example output: ["Design", "React", "Recipes", "Travel", "Inspiration"].
    4. Ensure "All" is NOT in the list (the UI adds it manually).
    5. The chosen tags should cover the majority of the cards (i.e. popular tags).
    
    Cards:
    ${cardData}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
        const collections = JSON.parse(jsonString);

        if (Array.isArray(collections)) {
            return collections;
        } else {
            console.error("AI returned invalid collection format:", text);
            return ["Design", "Development", "Life", "Work"]; // Fallback
        }
    } catch (error) {
        console.error("Collection generation failed:", error);
        return ["Design", "Development", "Life", "Work"]; // Fallback
    }
}
