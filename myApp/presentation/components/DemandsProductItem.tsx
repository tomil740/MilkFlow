import { SummarizedProduct } from "../../domain/models/SummarizedProduct";
import UserHeader from "./UserHeader";


interface DemandsProductItemProps {
  product: SummarizedProduct;
}

const DemandsProductItem: React.FC<DemandsProductItemProps> = ({ product }) => {
  return (
    <div className="demands-product-item">
      {/* Product Row */}
      <div className="product-row">
        {product.product?.imgUrl && (
          <img
            src={product.product?.imgUrl}
            alt={product.product.name}
            className="product-image"
          />
        )}
        <div className="product-info">
          <div className="product-name">{product.product?.name}</div>
          <div className="product-id">ID: {product.productId}</div>
        </div>
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
