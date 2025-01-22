
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
       <div className="product-image-container">
         <img
           src={`productsImages/regular/${product.imgKey}.jpg`}
           alt={product.name}
           className="product-image"
           onError={(e) => {
             e.currentTarget.src = `productsImages/logos/large_logo.png`;
           }}
         />
       </div>
       <div className="product-info">
         <div className="product-name">{product.name}</div>
         <div className="product-bottom">
           <button className="product-action-button" onClick={onClick}>
             הוסף
           </button>
         </div>
       </div>
     </div>
   );
};

export default ProductPreviewItem;
