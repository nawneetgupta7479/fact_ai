import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is used elsewhere or for context, not directly controlling Home visibility here.
import { FaCheckCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Result = ({ activeTab }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState("");

  const handleLike = () => {
    setFeedbackGiven(true);
    setShowThanksPopup(true);
    setTimeout(() => {
      setShowThanksPopup(false);
    }, 3000);
  };

  const handleDislikeClick = () => {
    setShowReasonInput(true);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmitReason = () => {
    console.log("Feedback Reason:", reason);
    setFeedbackGiven(true);
    setShowThanksPopup(true);
    setShowReasonInput(false);
    setTimeout(() => {
      setShowThanksPopup(false);
    }, 3000);
  };

  if (activeTab !== "Result") {
    return null; // Render nothing if Result tab is not active
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-12 pb-28 px-4 md:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Result Section */}
        <div className="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6 text-center border border-gray-700/50">
          <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-400">TRUE</h1>
          <p className="text-gray-400 mt-2">
            The information has been verified.
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">
            Summary of Information
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
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
                disabled={feedbackGiven || showReasonInput}
                className={`p-3 rounded-full transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${
                            feedbackGiven || showReasonInput
                              ? "bg-gray-600 cursor-not-allowed text-gray-400"
                              : "bg-green-500/20 hover:bg-green-500/40 text-green-400 hover:text-green-300 focus:ring-green-500"
                          }`}
              >
                <FaThumbsUp size={24} />
              </button>
              <button
                onClick={handleDislikeClick}
                disabled={feedbackGiven || showReasonInput}
                className={`p-3 rounded-full transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${
                            feedbackGiven || showReasonInput
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

          <p className="text-center text-gray-400 text-sm">
            {feedbackGiven
              ? "100% of users found this helpful!"
              : "0% of users found this helpful."}
          </p>
        </div>
      </div>

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
