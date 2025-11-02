// Google Vision API service for image analysis
const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

interface VisionAnalysisResult {
  description: string;
  suggestedCategory: string;
  confidence: number;
  labels: string[];
}

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Analyze image using Google Vision API
export const analyzeImage = async (file: File): Promise<VisionAnalysisResult> => {
  try {
    const base64Image = await fileToBase64(file);
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10
            },
            {
              type: 'TEXT_DETECTION',
              maxResults: 5
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10
            }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.responses[0];

    // Extract labels and text
    const labels = annotations.labelAnnotations?.map((label: any) => label.description) || [];
    const textAnnotations = annotations.textAnnotations?.map((text: any) => text.description) || [];
    const objects = annotations.localizedObjectAnnotations?.map((obj: any) => obj.name) || [];

    // Generate description based on detected elements
    const description = generateDescription(labels, textAnnotations, objects);
    
    // Suggest category based on detected elements
    const suggestedCategory = suggestCategory(labels, objects);
    
    // Calculate confidence based on label scores
    const confidence = annotations.labelAnnotations?.[0]?.score || 0;

    return {
      description,
      suggestedCategory,
      confidence,
      labels: [...labels, ...objects].slice(0, 10)
    };

  } catch (error) {
    console.error('Vision API analysis failed:', error);
    throw new Error('Failed to analyze image. Please add description manually.');
  }
};

// Generate human-readable description from detected elements
const generateDescription = (labels: string[], texts: string[], objects: string[]): string => {
  const allElements = [...labels, ...objects].filter(Boolean);
  
  if (allElements.length === 0) {
    return "Issue detected in the uploaded image. Please provide additional details.";
  }

  // Prioritize infrastructure and problem-related terms
  const problemKeywords = allElements.filter(element => 
    element.toLowerCase().includes('damage') ||
    element.toLowerCase().includes('broken') ||
    element.toLowerCase().includes('crack') ||
    element.toLowerCase().includes('hole') ||
    element.toLowerCase().includes('leak') ||
    element.toLowerCase().includes('trash') ||
    element.toLowerCase().includes('garbage') ||
    element.toLowerCase().includes('pothole') ||
    element.toLowerCase().includes('road') ||
    element.toLowerCase().includes('street') ||
    element.toLowerCase().includes('sidewalk') ||
    element.toLowerCase().includes('building') ||
    element.toLowerCase().includes('infrastructure')
  );

  const mainElements = problemKeywords.length > 0 ? problemKeywords : allElements.slice(0, 3);
  
  // Add any detected text for context
  const contextText = texts.length > 0 ? ` Text visible: "${texts[0].substring(0, 50)}"` : '';
  
  return `Issue involving ${mainElements.join(', ').toLowerCase()}. ${contextText}`.trim();
};

// Suggest category based on detected elements
const suggestCategory = (labels: string[], objects: string[]): string => {
  const allElements = [...labels, ...objects].map(el => el.toLowerCase());
  
  // Category mapping based on detected elements
  if (allElements.some(el => 
    el.includes('road') || el.includes('street') || el.includes('pothole') || 
    el.includes('asphalt') || el.includes('pavement') || el.includes('sidewalk')
  )) {
    return 'infrastructure';
  }
  
  if (allElements.some(el => 
    el.includes('water') || el.includes('leak') || el.includes('pipe') || 
    el.includes('drain') || el.includes('flooding')
  )) {
    return 'water';
  }
  
  if (allElements.some(el => 
    el.includes('light') || el.includes('lamp') || el.includes('electric') || 
    el.includes('wire') || el.includes('pole')
  )) {
    return 'streetlight';
  }
  
  if (allElements.some(el => 
    el.includes('trash') || el.includes('garbage') || el.includes('waste') || 
    el.includes('litter') || el.includes('bin')
  )) {
    return 'waste';
  }
  
  if (allElements.some(el => 
    el.includes('tree') || el.includes('park') || el.includes('garden') || 
    el.includes('green') || el.includes('plant')
  )) {
    return 'parks';
  }
  
  if (allElements.some(el => 
    el.includes('building') || el.includes('construction') || el.includes('wall') || 
    el.includes('structure')
  )) {
    return 'building';
  }
  
  if (allElements.some(el => 
    el.includes('vehicle') || el.includes('car') || el.includes('traffic') || 
    el.includes('transport')
  )) {
    return 'transportation';
  }
  
  if (allElements.some(el => 
    el.includes('safety') || el.includes('danger') || el.includes('hazard') || 
    el.includes('security')
  )) {
    return 'safety';
  }
  
  return 'others';
};

// Batch analyze multiple images
export const analyzeMultipleImages = async (files: File[]): Promise<VisionAnalysisResult[]> => {
  const results = await Promise.allSettled(
    files.map(file => analyzeImage(file))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to analyze image ${index + 1}:`, result.reason);
      return {
        description: `Image ${index + 1}: Unable to analyze automatically. Please add description manually.`,
        suggestedCategory: 'others',
        confidence: 0,
        labels: []
      };
    }
  });
};

// Combine multiple image analyses into a single description
export const combineImageAnalyses = (analyses: VisionAnalysisResult[]): { description: string; category: string } => {
  const validAnalyses = analyses.filter(analysis => analysis.confidence > 0.3);
  
  if (validAnalyses.length === 0) {
    return {
      description: "Multiple images uploaded. Please provide detailed description of the issue.",
      category: 'others'
    };
  }
  
  // Combine descriptions
  const descriptions = validAnalyses.map((analysis, index) => 
    `Image ${index + 1}: ${analysis.description}`
  );
  
  // Find most confident category
  const bestCategory = validAnalyses.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  ).suggestedCategory;
  
  return {
    description: descriptions.join(' | '),
    category: bestCategory
  };
};