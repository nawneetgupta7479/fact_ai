import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  // Store the original claim
  claim: {
    type: String,
    required: true,
    index: true
  },
  // Store if this was a like or dislike
  isPositive: {
    type: Boolean,
    required: true
  },
  // Store the reason for dislike (if provided)
  reason: String,
  // Metadata for analytics
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Save the factcheck result
  factCheckResult: {
    isTrue: Boolean,
    explanation: String
  }
});

// Create a compound index for faster queries
FeedbackSchema.index({ claim: 1, isPositive: 1 });

// If the model already exists, use it, otherwise create it
export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);