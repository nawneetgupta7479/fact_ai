import { chatWithGemini } from './aiService.js';

// Define the API base URL - must match your Express server
const API_BASE_URL = 'http://localhost:3000'; 

// Submit feedback
export async function submitFeedback(claim, isPositive, reason, factCheckResult) {
  try {
    // Ensure we have the complete claim text for proper identification
    const claimText = claim.trim();
    
    // Extract essential factCheckResult data
    const simplifiedResult = {
      isTrue: factCheckResult.isTrue,
      explanation: factCheckResult.explanation
    };
    
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claim: claimText,
        isPositive,
        reason,
        factCheckResult: simplifiedResult
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
}

// Get feedback stats
export async function getFeedbackStats(claim) {
  try {
    if (!claim) {
      return { likes: 0, dislikes: 0, total: 0, likePercentage: 0, dislikePercentage: 0 };
    }
    
    const response = await fetch(`${API_BASE_URL}/api/feedback/stats?claim=${encodeURIComponent(claim)}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return {
      likes: 0,
      dislikes: 0,
      total: 0,
      likePercentage: 0,
      dislikePercentage: 0
    };
  }
}

// Get summarized dislike reasons using Gemini
export async function getSummarizedReasons(claim) {
  try {
    if (!claim) {
      return "No feedback available";
    }
    
    // Fetch all dislike reasons
    const response = await fetch(`${API_BASE_URL}/api/feedback/reasons?claim=${encodeURIComponent(claim)}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.reasons || data.reasons.length === 0) {
      return "No reasons provided";
    }
    
    return data.reasons.join("; ");
  } catch (error) {
    console.error('Error fetching feedback reasons:', error);
    return "Error retrieving feedback";
  }
}