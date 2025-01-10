import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import ProductPreviewItem from "./ProductPreviewItem";
import ProductDialog from "./ProductDialog";
import useProducts from '../../domain/useCase/useProducts';
import "./style/productCatalog.css";
import CategoriesBar from "./CategoriesBar";

 

const ProductsCatalog: React.FC = () => {
  const { products, fetchProducts, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <CategoriesBar/>
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
          />
        )}
      </div>
    </>
  );
};

export default ProductsCatalog;
