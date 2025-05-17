import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUserCircle, FaRobot } from 'react-icons/fa';

const Chat = ({ activeTab }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: 'bot', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');

    // Simulate bot reply
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        text: `You said: "${inputValue}". I am a simple bot.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (activeTab !== "Chat") {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 pt-20 pb-20 selection:bg-blue-500 selection:text-white">
      {/* Adjust pt-20 and pb-20 if your top/bottom navbars have different heights */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end space-x-3 max-w-xl lg:max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
            }`}
          >
            {msg.sender === 'bot' ? (
              <FaRobot className="text-blue-400 text-3xl mb-1 flex-shrink-0" />
            ) : (
              <FaUserCircle className="text-green-400 text-3xl mb-1 flex-shrink-0" />
            )}
            <div
              className={`p-3 rounded-xl shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'} text-opacity-80`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-800/80 backdrop-blur-md border-t border-gray-700/60 p-3 md:p-4">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
            className="flex-grow p-3 bg-gray-700/60 border border-gray-600 rounded-xl text-gray-100  focus-outline-none  outline-none resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700/50"
            style={{ minHeight: '48px', maxHeight: '120px' }} // Control min/max height
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Send message"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
