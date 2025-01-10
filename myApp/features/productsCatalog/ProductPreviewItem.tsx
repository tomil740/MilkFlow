
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
       <img src={product.imgUrl} alt={product.name} className="product-image" />
       <div className="product-info">
         <div className="product-name">{product.name}</div>
         <div className="product-bottom">
           <div className="product-price">{product.price} ₪</div>
           <button className="product-action-button" onClick={onClick}>
             הוסף
           </button>
         </div>
       </div>
     </div>
   );
};

export default ProductPreviewItem;
