import React, { useState } from "react";
import Chat from "./Chat.jsx";
import Navbar from "./Navbar.jsx";
import Result from "./Result.jsx";

const App = () => {
  const [activeTab, setActiveTab] = useState("Result");

  return (
    <>
      <Navbar activeLabel={activeTab} onNavClick={setActiveTab} />
      <Result activeTab={activeTab} />
      <Chat activeTab={activeTab} /> {/* Conditionally render Chat component */}
      {/* Example for other tabs - you would create these components */}
      {/* {activeTab === "Reviews" && <ReviewsComponent />} */}
      {/* {activeTab === "Explain" && <ExplainComponent />} */}
    </>
  );
};

export default App;
