import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import ProductPreviewItem from "./ProductPreviewItem";
import ProductDialog from "./ProductDialog";
import useProducts from "../../domain/useCase/useProducts";
import "./style/productCatalog.css";
import CategoriesBar from "./CategoriesBar";
import { useCart } from '../../domain/useCase/useCart';
import { Product } from "../../domain/models/Product";
import { Navigate, NavLink } from "react-router-dom";
import { to } from '../../../node_modules/typescript/lib/_tsc';

const ProductsCatalog: React.FC = () => {
  const { products, fetchProducts, loading, error } = useProducts();
  const { addToCart, syncCart } = useCart(); // Use cart hook
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Sync cart state on component unmount or page leave
    return () => {
      syncCart();
    };
  }, [syncCart]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
    <NavLink to = {"cart"}>Cart</NavLink>
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
            addToCart={(cartItem: { productId: string; amount: number }) =>
              addToCart(cartItem.productId, cartItem.amount)
            }
          />
        )}
      </div>
    </>
  );
};

export default ProductsCatalog;
