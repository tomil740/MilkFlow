import React, { useState } from "react";
import Barcode from "react-barcode";
import "../style/barcodeComponent.css";
interface BarcodeProps {
  value: number; // barcode value
}

const BarcodeComponent: React.FC<BarcodeProps> = ({ value }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const renderBarcode = () => {
    try {
      if (typeof value !== "number" || value <= 0) {
        throw new Error("Invalid barcode value");
      }
      return <Barcode value={value.toString()} />;
    } catch (error) {
      handleError();
      return null;
    }
  };

  return (
    <div className="barcode-container">
      {hasError ? (
        <div className="barcode-error-message">Invalid barcode</div>
      ) : (
        <div className="barcode-presentation">{renderBarcode()}</div>
      )}
    </div>
  );
};

export default BarcodeComponent;
