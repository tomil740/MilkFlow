import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./style/productCatalog.css";

interface ProductDialogProps {
  product: any;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, onClose }) => {
  const [amount, setAmount] = useState(1);

  const handleIncrease = () => setAmount((prev) => prev + 1);
  const handleDecrease = () => setAmount((prev) => Math.max(prev - 1, 1));

  return (
    <div className="product-dialog-overlay" onClick={onClose}>
      <div className="product-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <IconButton onClick={onClose} className="product-dialog-close-btn">
          <CloseIcon />
        </IconButton>
        <img
          src={product.imgUrl}
          alt={product.name}
          className="product-dialog-image"
        />
        <div className="product-dialog-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="product-dialog-price">{product.price} ₪</p>
        </div>
        <div className="amount-picker">
          <button onClick={handleDecrease}>-</button>
          <span>{amount}</span>
          <button onClick={handleIncrease}>+</button>
        </div>
        <button className="product-dialog-action" onClick={onClose}>
          הוסף לסל
        </button>
      </div>
    </div>
  );
};

export default ProductDialog;
