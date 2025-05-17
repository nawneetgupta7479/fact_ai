import React from "react";
import { FaRegStar, FaRegCommentDots, FaGem, FaHome } from "react-icons/fa";

const Navbar = ({ activeLabel, onNavClick }) => {
  const navItems = [
    { icon: <FaRegCommentDots size={23} />, label: "Chat" },
    {
      icon: <FaGem size={23} />,
      label: "Explain",
    },
    { icon: <FaHome size={23} />, label: "Result" },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full 
                    bg-gradient-to-b from-gray-900 via-black to-gray-900/80 
                    backdrop-blur-xl border-b border-gray-700/40 shadow-lg z-50"
    >
      <div className="flex justify-around items-stretch max-w-screen-sm mx-auto">
        {navItems.map((item, index) => {
          const isActive = item.label === activeLabel;
          return (
            <button
              key={index}
              onClick={() => onNavClick(item.label)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 relative transition-colors duration-300 ease-out group focus:outline-none
                ${
                  isActive
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-blue-400 focus:text-blue-400"
                }`}
            >
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-blue-500 transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "w-8 opacity-100"
                      : "w-0 opacity-0 group-hover:opacity-50"
                  }`}
              />
              <div
                className={`transform transition-all duration-300 ease-out mb-0.5 
                  ${
                    isActive
                      ? "scale-[1.15] -translate-y-0.5 drop-shadow-lg"
                      : "group-hover:scale-110"
                  }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[11px] font-medium tracking-normal transition-colors duration-300 ease-out
                  ${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-500 group-hover:text-blue-400"
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
