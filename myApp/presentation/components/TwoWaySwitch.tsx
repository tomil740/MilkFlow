import React from "react";
import "../style/utilSwitch.css"

interface TwoWaySwitchProps {
  value: boolean; // true for "Product", false for "Demand"
  onChange: (value: boolean) => void; // Callback to toggle the switch
}

const TwoWaySwitch: React.FC<TwoWaySwitchProps> = ({ value, onChange }) => {
  return (
    <div className="two-way-switch">
      <button
        className={`switch-option ${value ? "active" : ""}`}
        onClick={() => onChange(true)}
        aria-pressed={value}
      >
        תצוגת דרישה
      </button>
      <button
        className={`switch-option ${!value ? "active" : ""}`}
        onClick={() => onChange(false)}
        aria-pressed={!value}
      >
        תצוגת מוצר
      </button>
      <div
        className="switch-indicator"
        style={{ transform: `translateX(${value ? "0%" : "100%"})` }}
      />
    </div>
  );
};

export default TwoWaySwitch;
