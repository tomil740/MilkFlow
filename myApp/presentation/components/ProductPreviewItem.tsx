import FetchImage from "../util/FetchImage";

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
         <FetchImage
           imgId={product.imgKey} // Only pass the image ID
           className="product-image"
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
