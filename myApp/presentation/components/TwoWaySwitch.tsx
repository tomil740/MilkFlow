import React from "react";
import "../style/utilSwitch.css";

interface TwoWaySwitchProps {
  value: boolean; // true for "Product", false for "Demand"
  onChange: (value: boolean) => void; // Callback to toggle the switch
}

const TwoWaySwitch: React.FC<TwoWaySwitchProps> = ({ value, onChange }) => {
  return (
    <div className="two-way-switch">
      <button
        className={`switch-option ${value ? "active" : ""}`}
        onClick={() => value && onChange(false)} // Only trigger when inactive
        aria-pressed={value}
      >
         📝 סיכום הזמנות
      </button>
      <button
        className={`switch-option ${!value ? "active" : ""}`}
        onClick={() => !value && onChange(true)} // Only trigger when active
        aria-pressed={!value}
      >
        🛍️ סיכום מוצרים
      </button>
      <div
        className="switch-indicator"
        style={{ transform: `translateX(${value ? "0%" : "100%"})` }}
      />
    </div>
  );
};

export default TwoWaySwitch;
