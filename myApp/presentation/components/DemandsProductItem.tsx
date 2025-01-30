import { SummarizedProduct } from "../../domain/models/SummarizedProduct";
import BarcodeComponent from "./BarcodeComponent";
import UserHeader from "./UserHeader";



interface DemandsProductItemProps { 
  product: SummarizedProduct;
  isDistributer:boolean;
}

const DemandsProductItem: React.FC<DemandsProductItemProps> = ({
  product,
  isDistributer,
}) => {
  return (
    <div className="demands-product-item">
      {/* Product Row */}
      <div className="product-row">
        {product.product?.imgKey && (
          <img
            src={`productsImages/regular/${product.product.imgKey}.jpg`}
            alt={product.product.name}
            className="product-image"
            onError={(e) => {
              e.currentTarget.src = `productsImages/logos/large_logo.png`;
            }}
          />
        )}
        <div className="product-info">
          <div className="product-name">{product.product?.name}</div>
          <div className="product-id">ID: {product.productId}</div>
        </div>
      </div>
      <div className="barcode-container">
        {/* Render BarcodeComponent only if product is not null */}
        {product &&
          product.product &&
          product.product.barcode &&
          isDistributer && <BarcodeComponent value={product.product.barcode} />}
      </div>

      {/* Total Amount */}
      <div className="total-amount">
        סך הכול כמות: <strong>{product.amount}</strong>
      </div>

      {/* User Description */}
      <div className="user-description">
        {product.usersAmounts.map((user) => (
          <div key={user.userId} className="user-row">
            <UserHeader userId={user.userId} />
            <div className="user-amount">
              כמות: <strong>{user.amount}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemandsProductItem;
