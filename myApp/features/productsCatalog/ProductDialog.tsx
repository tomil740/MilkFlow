import React, { useState } from "react";
import "./style/productCatalog.css";

interface ProductDialogProps {
  product: any;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, onClose }) => {
  const [amount, setAmount] = useState(1);

  const handleIncrement = () => setAmount(amount + 1);
  const handleDecrement = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  return (
    <div className="dialog">
      <div className="dialog-header">{product.name}</div>
      <div className="dialog-body">
        {product.description}
        <br />
        קטגוריה: {product.category}
      </div>
      <div className="amount-controls">
        <button className="amount-button" onClick={handleDecrement}>
          -
        </button>
        <span>{amount}</span>
        <button className="amount-button" onClick={handleIncrement}>
          +
        </button>
      </div>
      <button
        className="submit-button"
        onClick={() => {
          // Implement add to cart logic
          onClose();
        }}
      >
        הוסף לעגלה
      </button>
    </div>
  );
};

export default ProductDialog;
