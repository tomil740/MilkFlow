
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
       <img
         src={product.imgUrl}
         alt={product.name}
         className="product-image"
         onError={(e) => {
           e.currentTarget.src =
             "https://speed-market.co.il/wp-content/uploads/2020/04/7290000554457.jpg"; // Fallback image URL
         }}
       />
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
