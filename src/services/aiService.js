// AI Factchecking service using Gemini and Google Search APIs

// API keys (in production, these should be environment variables)
const GEMINI_API_KEY = "AIzaSyBx8Y8iSXefc9lD96zdOMII4vnLTYKmfbI";
const GOOGLE_PSE_API_KEY = "AIzaSyAjUvGeUgWqHQnWAeY0yYac2WP0PJogZpM";
const GOOGLE_CSE_ID = "95e725a7a6dd04a28";

// Web search using Google Custom Search API
export async function webSearch(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_PSE_API_KEY}&cx=${GOOGLE_CSE_ID}&num=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("Google Search API error:", data.error);
      return {
        text: `Web search failed: ${data.error.message || "Unknown error"}`,
        sources: []
      };
    }

    // Extract snippets for AI processing
    const snippets = data.items?.map(item => item.snippet).filter(Boolean);
    
    // Format source information for display
    const sources = data.items?.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      displayLink: item.displayLink
    })) || [];
    
    return {
      text: snippets?.join('\n') || "No relevant info found on the web.",
      sources
    };
  } catch (error) {
    console.error("Web search error:", error);
    return {
      text: `Web search failed: ${error.message}`,
      sources: []
    };
  }
}

// Gemini API call using REST
export async function chatWithGemini(messages) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

  // Format the messages according to Gemini API requirements
  const payload = {
    contents: [
      {
        parts: messages.map(msg => ({
          text: msg.content
        }))
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log(data);
    
    if (data.error) {
      console.error("Gemini API returned an error:", data.error);
      return `Error: ${data.error.message || "Unknown error"}`;
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No response from Gemini.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Gemini request failed: ${error.message}`;
  }
}

// Function to fact check a claim
export async function factCheckClaim(claim) {
  try {
    // Get web search results
    const webSearchResult = await webSearch(claim);
    const webContext = webSearchResult.text;
    const sources = webSearchResult.sources;
    
    // Check if no relevant information was found
    if (webContext === "No relevant info found on the web." || 
        webContext.length < 50) {  // If very little information found
      return {
        isTrue: null, // Use null to indicate "can't verify"
        explanation: "There isn't enough relevant information to verify this claim.",
        fullResponse: "CAN'T VERIFY: Insufficient information available to fact-check this claim.",
        isLoading: false,
        error: null,
        sources
      };
    }
    
    // Prepare prompt for factchecking
    const messages = [
      { 
        role: "system", 
        content: "You are a factchecking assistant. Analyze the claim and determine if it's TRUE, FALSE, or CAN'T VERIFY based on web search results. Use CAN'T VERIFY if the claim is nonsensical, subjective, or if there's insufficient relevant information. Start your response with either 'TRUE', 'FALSE', or 'CAN'T VERIFY', then provide a summary explanation. Be objective and evidence-based."
      },
      { 
        role: "user", 
        content: `Claim to verify: ${claim}\n\nWeb search results:\n${webContext}` 
      }
    ];

    // Get response from Gemini
    const response = await chatWithGemini(messages);
    
    // Determine verification status
    let isTrue = null; // Default to "can't verify"
    if (response.trim().toUpperCase().startsWith("TRUE")) {
      isTrue = true;
    } else if (response.trim().toUpperCase().startsWith("FALSE")) {
      isTrue = false;
    }
    // Otherwise leave as null for "can't verify"
    
    // Split response into verdict and explanation
    let explanation = response;
    if (response.includes("\n")) {
      explanation = response.split("\n").slice(1).join("\n").trim();
    }
    
    console.log("response", response);
    return {
      isTrue,
      explanation,
      fullResponse: response,
      sources
    };
  } catch (error) {
    console.error("Factcheck error:", error);
    throw new Error(`Factchecking failed: ${error.message}`);
  }
}