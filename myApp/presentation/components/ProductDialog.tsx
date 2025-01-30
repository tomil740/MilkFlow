import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "../style/productCatalog.css";
import Select from "react-select";
import BarcodeComponent from './BarcodeComponent';
import useEditCart from "../../domain/util/useEditCart";


interface CartItemRef {
  productId: number;
  amount: number;
}

interface ProductDialogProps {
  product: {
    id: number;
    barcode: number;
    name: string;
    imgKey: string;
    category: string;
    itemsPerPackage: number;
    weight: number;
    description: String;
  };
  onClose: () => void;
  isCartItem?: boolean; // Default to false
  amountInit?: number;
  addToCart: (item: CartItemRef) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  product,
  onClose,
  isCartItem = false,
  amountInit = 1,
  addToCart,
}) => {
  const editCartItem = useEditCart();
  const [amount, setAmount] = useState(amountInit);

  const handleIncrease = () => setAmount((prev) => prev + 1);
  const handleDecrease = () => setAmount((prev) => Math.max(prev - 1, 1));

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
    addToCart({ productId: product.id, amount });
    onClose();
  };

  function handleUpdateCart(toRemove: boolean) {
    if (isCartItem) {
      if (toRemove) {
        editCartItem({ productId: product?.id, amount: -1 });
      } else {
        editCartItem({ productId: product?.id, amount });
      }
    }
    onClose();
  }

  return (
    <div className="product-dialog-overlay" onClick={onClose}>
      <div className="product-dialog" onClick={(e) => e.stopPropagation()}>
        <IconButton onClick={onClose} className="product-dialog-close-btn">
          <CloseIcon />
        </IconButton>
        <img
          src={`productsImages/regular/${product.imgKey}.jpg`}
          alt={product.name}
          className="product-dialog-image"
          onError={(e) => {
            e.currentTarget.src = `productsImages/logos/large_logo.png`;
          }}
        />
        <div className="product-dialog-info">
          <h2>{product.name}</h2>
          <p className="product-dialog-description">{product.description}</p>

          <p className="product-dialog-weight">
            קטגורית מוצר: <strong>{product.category}</strong>
          </p>
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
        <p className="product-dialog-items">
          <strong>{product.itemsPerPackage}</strong> יחידות בכל אריזה
        </p>
        <span>
          {amount} אריזות ({amount * product.itemsPerPackage})
        </span>
        {/* Conditional rendering for action buttons */}
        {!isCartItem ? (
          <button className="product-dialog-action" onClick={handleAddToCart}>
            הוסף לסל
          </button>
        ) : (
          <div className="cart-item-actions">
            <button
              className="product-dialog-action update-cart-button"
              onClick={() => handleUpdateCart(false)}
            >
              עדכן את הסל
            </button>
            <button
              className="product-dialog-action remove-cart-button"
              onClick={() => handleUpdateCart(true)}
            >
              הסר מהסל
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDialog;
