import React, { useState } from "react";
import Chat from "./Chat.jsx";
import Navbar from "./Navbar.jsx";
import Result from "./Result.jsx";

const App = () => {
  const [activeTab, setActiveTab] = useState("Result");
  const [factCheckResult, setFactCheckResult] = useState({
    isTrue: true,
    explanation: "The information has been verified.",
    fullResponse: "",
    isLoading: false,
    error: null
  });
  
  // Function to handle claim submission from Chat component
  const handleClaimSubmit = (result) => {
    setFactCheckResult(result);
    setActiveTab("Result"); // Switch to Result tab after processing
  };

  return (
    <>
      <Navbar activeLabel={activeTab} onNavClick={setActiveTab} />
      <Result 
        activeTab={activeTab} 
        factCheckResult={factCheckResult}
      />
      <Chat 
        activeTab={activeTab} 
        onClaimSubmit={handleClaimSubmit}
      /> {/* Pass onClaimSubmit to Chat component */}
      {/* Example for other tabs - you would create these components */}
      {/* {activeTab === "Reviews" && <ReviewsComponent />} */}
      {/* {activeTab === "Explain" && <ExplainComponent />} */}
    </>
  );
};

export default App;
