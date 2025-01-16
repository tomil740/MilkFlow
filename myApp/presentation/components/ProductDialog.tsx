import { useState } from "react";
import Select from "react-select";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "../style/productCatalog.css";
import useEditCart from "../../domain/util/useEditCart";

interface CartItemRef {
  productId: string;
  amount: number;
}

interface ProductDialogProps {
  product: any;
  onClose: () => void;
  isCartItem?: boolean; // Default to false
  amountInit?:number;
  addToCart: (item: CartItemRef) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onClose,
  isCartItem = false,
  amountInit = 1,
  addToCart,
}) => {
  const [amount, setAmount] = useState(amountInit);

  const handleIncrease = () => setAmount((prev) => prev + 1);
  const handleDecrease = () => setAmount((prev) => Math.max(prev - 1, 1));
  
  const editCartItem = useEditCart()

  const values = [
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

  const handleAddToCart = () => {
    addToCart({ productId: product?.id, amount });
    onClose();
  };

  function handleUpdateCart(toRemove:boolean){
    if (isCartItem) {
      if(toRemove){
        editCartItem({ productId: product?.id, amount: -1 });
      }else{
        editCartItem({ productId: product?.id, amount });
      }
    }
    onClose();
  };

  return (
    <div className="product-dialog-overlay" onClick={onClose}>
      <div className="product-dialog" onClick={(e) => e.stopPropagation()}>
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
          <Select
            options={values}
            value={{ value: amount, label: amount.toString() }}
            onChange={handleSelectChange}
            classNamePrefix="amount-picker"
          />
          <button onClick={handleIncrease}>+</button>
        </div>

        {/* Conditional rendering for action buttons */}
        {!isCartItem ? (
          <button className="product-dialog-action" onClick={handleAddToCart}>
            הוסף לסל
          </button>
        ) : (
          <div className="cart-item-actions">
            <button className="update-cart-button" onClick={()=>handleUpdateCart(false)}>
              עדכן
            </button>
            <button className="remove-cart-button" onClick={()=>handleUpdateCart(true)}>
              הוסר
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDialog;
