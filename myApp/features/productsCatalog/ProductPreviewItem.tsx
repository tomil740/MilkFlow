import "./style/productCatalog.css";

interface ProductPreviewItemProps {
  product: any;
  onClick: () => void;
}

const ProductPreviewItem: React.FC<ProductPreviewItemProps> = ({
  product,
  onClick,
}) => {
  return (
    <div className="product-preview-item">
      <img src={product.imgUrl} alt={product.name} />
      <div className="product-preview-content">
        <div className="product-preview-name">{product.name}</div>
        <div className="product-preview-price">{`${product.price} ₪`}</div>
        <button className="action-button" onClick={onClick}>
          בחר פריט
        </button>
      </div>
    </div>
  );
};

export default ProductPreviewItem;
