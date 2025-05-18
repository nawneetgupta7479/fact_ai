import express from 'express';
import { Feedback } from '../../models/Feedback.js';
import { connectDB } from '../../services/dbService.js';

const router = express.Router();

// Submit feedback
router.post('/api/feedback', async (req, res) => {
  try {
    const { claim, isPositive, reason, factCheckResult } = req.body;
    
    if (!claim) {
      return res.status(400).json({ error: 'Claim is required' });
    }
    
    // Normalize claim to ensure consistent storage/retrieval
    const normalizedClaim = claim.trim();
    
    const feedback = new Feedback({
      claim: normalizedClaim,
      isPositive,
      reason: reason || '',
      factCheckResult: factCheckResult || {}
    });
    
    await feedback.save();
    console.log('Feedback saved successfully for claim:', normalizedClaim);
    
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get feedback stats for a claim
router.get('/api/feedback/stats', async (req, res) => {
  try {
    const { claim } = req.query;
    
    if (!claim) {
      return res.status(400).json({ error: 'Claim is required' });
    }
    
    // Count likes and dislikes
    const likes = await Feedback.countDocuments({ claim, isPositive: true });
    const dislikes = await Feedback.countDocuments({ claim, isPositive: false });
    
    // Calculate percentages
    const total = likes + dislikes;
    const likePercentage = total > 0 ? Math.round((likes / total) * 100) : 0;
    const dislikePercentage = total > 0 ? Math.round((dislikes / total) * 100) : 0;
    
    res.json({
      likes,
      dislikes,
      total,
      likePercentage,
      dislikePercentage
    });
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    res.status(500).json({ error: 'Failed to get feedback stats' });
  }
});

// Get dislike reasons for a claim
router.get('/api/feedback/reasons', async (req, res) => {
  try {
    const { claim } = req.query;
    
    if (!claim) {
      return res.status(400).json({ error: 'Claim is required' });
    }
    
    // Get all dislike reasons for this claim
    const feedback = await Feedback.find({ 
      claim, 
      isPositive: false,
      reason: { $exists: true, $ne: '' } 
    }).select('reason -_id');
    
    const reasons = feedback.map(item => item.reason);
    
    res.json({ reasons });
  } catch (error) {
    console.error('Error getting feedback reasons:', error);
    res.status(500).json({ error: 'Failed to get feedback reasons' });
  }
});

export default router;