import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaThumbsUp, FaThumbsDown, FaQuestionCircle, FaInfoCircle, FaGlobe } from "react-icons/fa";
import { submitFeedback, getFeedbackStats, getSummarizedReasons } from "./services/feedbackService.js";

const Result = ({ activeTab, factCheckResult }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState("");
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showSourcesDialog, setShowSourcesDialog] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState({ likes: 0, dislikes: 0, total: 0 });
  const [reasonSummary, setReasonSummary] = useState("");
  const [showReasonSummary, setShowReasonSummary] = useState(false);

  const { isTrue, explanation, isLoading, error, sources = [] } = factCheckResult;
  
  // Get current claim from factCheckResult more reliably
  const currentClaim = factCheckResult.fullResponse 
    ? factCheckResult.fullResponse.split("\n")[0].replace(/^(TRUE|FALSE|CAN'T VERIFY):?\s*/i, '').trim()
    : "";

  useEffect(() => {
    if (currentClaim) {
      // Fetch feedback stats when claim changes
      const fetchFeedbackData = async () => {
        try {
          const stats = await getFeedbackStats(currentClaim);
          setFeedbackStats(stats);
          
          // Reset feedback state for new claims
          setFeedbackGiven(false);
          
          // Only fetch reasons if there are dislikes
          if (stats.dislikes > 0) {
            const summary = await getSummarizedReasons(currentClaim);
            setReasonSummary(summary);
          }
        } catch (error) {
          console.error("Error fetching feedback data:", error);
        }
      };
      
      fetchFeedbackData();
    }
  }, [currentClaim]);

  const handleLike = async () => {
    try {
      await submitFeedback(currentClaim, true, "", factCheckResult);
      
      // Update local stats without refetching
      setFeedbackStats(prev => ({
        likes: prev.likes + 1,
        dislikes: prev.dislikes,
        total: prev.total + 1,
        likePercentage: Math.round(((prev.likes + 1) / (prev.total + 1)) * 100),
        dislikePercentage: Math.round((prev.dislikes / (prev.total + 1)) * 100)
      }));
      
      setFeedbackGiven(true);
      setShowThanksPopup(true);
      setTimeout(() => {
        setShowThanksPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting like feedback:", error);
    }
  };

  const handleDislikeClick = () => {
    setShowReasonInput(true);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmitReason = async () => {
    try {
      await submitFeedback(currentClaim, false, reason, factCheckResult);
      
      // Update local stats without refetching
      setFeedbackStats(prev => ({
        likes: prev.likes,
        dislikes: prev.dislikes + 1,
        total: prev.total + 1,
        likePercentage: Math.round((prev.likes / (prev.total + 1)) * 100),
        dislikePercentage: Math.round(((prev.dislikes + 1) / (prev.total + 1)) * 100)
      }));
      
      setFeedbackGiven(true);
      setShowThanksPopup(true);
      setShowReasonInput(false);
      setTimeout(() => {
        setShowThanksPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting dislike feedback:", error);
    }
  };
  
  const toggleSummaryDialog = () => {
    setShowSummaryDialog(!showSummaryDialog);
    if (showSourcesDialog) setShowSourcesDialog(false);
  };

  const toggleSourcesDialog = () => {
    setShowSourcesDialog(!showSourcesDialog);
    if (showSummaryDialog) setShowSummaryDialog(false);
  };

  const toggleReasonSummary = () => {
    setShowReasonSummary(!showReasonSummary);
  };

  if (activeTab !== "Result") {
    return null; // Render nothing if Result tab is not active
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-28 px-4 md:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Result Section */}
        <div className="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6 text-center border border-gray-700/50 relative">
          {isLoading ? (
            <>
              <FaSpinner className="text-blue-400 text-6xl mx-auto mb-4 animate-spin" />
              <h1 className="text-4xl font-bold text-blue-400">CHECKING...</h1>
              <p className="text-gray-400 mt-2">
                Verifying the information...
              </p>
            </>
          ) : error ? (
            <>
              <FaTimesCircle className="text-yellow-400 text-6xl mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-yellow-400">ERROR</h1>
              <p className="text-gray-400 mt-2">
                {error}
              </p>
            </>
          ) : isTrue === null ? (
            <>
              <FaQuestionCircle className="text-yellow-400 text-6xl mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-yellow-400 bg-yellow-400/10 inline-block px-4 py-1 rounded-lg">
                CAN'T VERIFY
              </h1>
              <p className="text-gray-400 mt-2">
                Not enough information to determine if this claim is true or false.
              </p>
            </>
          ) : (
            <>
              {isTrue ? (
                <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
              ) : (
                <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
              )}
              <h1 className={`text-4xl font-bold ${isTrue ? 'text-green-400' : 'text-red-400'}`}>
                {isTrue ? 'TRUE' : 'FALSE'}
              </h1>
              <p className="text-gray-400 mt-2">
                {isTrue ? 'The information has been verified.' : 'The information is incorrect.'}
              </p>
            </>
          )}

          {/* Summary & Sources Buttons */}
          {!isLoading && !error && (
            <div className="flex justify-between mt-6">
              <button
                onClick={toggleSummaryDialog}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-md"
              >
                <FaInfoCircle /> Summary
              </button>
              
              <button
                onClick={toggleSourcesDialog}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-md"
              >
                <FaGlobe /> Sources
              </button>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-blue-400 mb-5 text-center">
            Was this information helpful?
          </h3>

          {!showReasonInput && (
            <div className="flex justify-center space-x-6 mb-5">
              <button
                onClick={handleLike}
                disabled={feedbackGiven || showReasonInput || isLoading || error}
                className={`p-3 rounded-full transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${
                            feedbackGiven || showReasonInput || isLoading || error
                              ? "bg-gray-600 cursor-not-allowed text-gray-400"
                              : "bg-green-500/20 hover:bg-green-500/40 text-green-400 hover:text-green-300 focus:ring-green-500"
                          }`}
              >
                <FaThumbsUp size={24} />
              </button>
              <button
                onClick={handleDislikeClick}
                disabled={feedbackGiven || showReasonInput || isLoading || error}
                className={`p-3 rounded-full transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${
                            feedbackGiven || showReasonInput || isLoading || error
                              ? "bg-gray-600 cursor-not-allowed text-gray-400"
                              : "bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 focus:ring-red-500"
                          }`}
              >
                <FaThumbsDown size={24} />
              </button>
            </div>
          )}

          {showReasonInput && (
            <div className="mt-4 mb-5 space-y-3">
              <textarea
                value={reason}
                onChange={handleReasonChange}
                placeholder="Please tell us why..."
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows="3"
              ></textarea>
              <button
                onClick={handleSubmitReason}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Submit Reason
              </button>
            </div>
          )}

          {/* Feedback percentage display */}
          <p className="text-center text-gray-400 text-sm flex items-center justify-center gap-2">
            {feedbackGiven || feedbackStats.total > 0 ? (
              <>
                <span>{feedbackStats.likePercentage}% of users found this helpful</span>
                {feedbackStats.dislikes > 0 && (
                  <div className="relative">
                    <button 
                      onMouseEnter={toggleReasonSummary}
                      onMouseLeave={toggleReasonSummary}
                      className="text-blue-400 hover:text-blue-300 focus:outline-none ml-1 font-medium"
                    >
                      Why?
                    </button>
                    
                    {showReasonSummary && reasonSummary && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-64 p-3 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                        <div className="text-xs text-gray-300 text-left">
                          {reasonSummary}
                        </div>
                        <div className="absolute w-3 h-3 bg-gray-800 border-r border-b border-gray-700 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              "No feedback yet."
            )}
          </p>
        </div>
      </div>

      {/* Summary Dialog */}
      {showSummaryDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400">Summary</h3>
              <button 
                onClick={toggleSummaryDialog}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-300 leading-relaxed">
                {explanation}
              </p>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button 
                onClick={toggleSummaryDialog}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Dialog */}
      {showSourcesDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400">Web Sources</h3>
              <button 
                onClick={toggleSourcesDialog}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {sources && sources.length > 0 ? (
                <div className="space-y-4">
                  {sources.map((source, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          {source.title && (
                            <h4 className="text-blue-300 font-medium mb-1">{source.title}</h4>
                          )}
                          <p className="text-gray-300 text-sm">{source.snippet}</p>
                          <a 
                            href={source.link || source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block"
                          >
                            {source.displayLink || source.link || source.url}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No source information available.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button 
                onClick={toggleSourcesDialog}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thanks Popup */}
      {showThanksPopup && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-500 text-white py-3 px-6 rounded-lg shadow-2xl transition-all duration-300 ease-out animate-fadeInUp">
          Thanks for your feedback!
        </div>
      )}
    </div>
  );
};

export default Result;

// Add this to your Tailwind CSS config or a global CSS file for the animation:
/*

*/
