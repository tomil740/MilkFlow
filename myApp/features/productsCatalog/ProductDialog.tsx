import React, { useState } from "react";
import Select from "react-select";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./style/productCatalog.css";

interface CartItemref{
  productId:string;
  amount:number;
}

interface ProductDialogProps {
  product: any;
  onClose: () => void;
  addToCart: (item:CartItemref) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onClose,
  addToCart,
}) => {
  const [amount, setAmount] = useState(1);

  const handleIncrease = () => setAmount((prev) => prev + 1);
  const handleDecrease = () => setAmount((prev) => Math.max(prev - 1, 1));

  // Values for the picker
  const values = [
    { value: 1, label: "1" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 1, label: "1" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  const handleSelectChange = (selectedOption: any) => {
    setAmount(selectedOption.value);
  };

  function onAddToCart(){
    addToCart({productId:product?.id,amount:amount});
    onClose()
  }

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

        {/* Adjust the + and - buttons */}
        <div className="amount-picker">
          <button onClick={handleDecrease}>-</button>
          <Select
            options={values}
            value={{ value: amount, label: amount.toString() }}
            onChange={handleSelectChange}
            classNamePrefix="amount-picker"
          />
          <button onClick={handleIncrease}>+</button>
        </div>

        {/* Add to cart action button */}
        <button className="product-dialog-action" onClick={onAddToCart}>
          הוסף לסל
        </button>
      </div>
    </div>
  );
};

export default ProductDialog;
