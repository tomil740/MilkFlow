import { useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import ProductPreviewItem from "./components/ProductPreviewItem";
import ProductDialog from "./components/ProductDialog";
import CategoriesBar from "./components/CategoriesBar";
import { Product } from "../domain/models/Product";
import { NavLink } from "react-router-dom";
import useProducts from "../domain/useCase/useProducts";
import "./style/productCatalog.css";
import useAddToCart from "../domain/util/useAddToCart";

const ProductsCatalog: React.FC = () => {
  const { products, fetchProducts, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addToCart = useAddToCart();
  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <CategoriesBar />
      <div className="products-catalog">
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {error && (
          <Snackbar
            open={true}
            message="Failed to load products."
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        )}
        <Grid container spacing={2}> 
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product.id}>
              <div onClick={() => handleProductClick(product)}>
                <ProductPreviewItem
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            </Grid>  
          ))} 
        </Grid>
        {selectedProduct && (
          <ProductDialog 
            product={selectedProduct}
            onClose={handleCloseDialog}
            addToCart={(cartItem: { productId: number; amount: number }) =>
              addToCart(cartItem)
            }
          />
        )}
      </div>
    </>
  );
};

export default ProductsCatalog;
