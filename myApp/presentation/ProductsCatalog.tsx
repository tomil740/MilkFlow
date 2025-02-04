import { useState } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Fab from "@mui/material/Fab";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ProductPreviewItem from "./components/ProductPreviewItem";
import ProductDialog from "./components/ProductDialog";
import CategoriesBar from "./components/CategoriesBar";
import { Product } from "../domain/models/Product";
import useProducts from "../domain/useCase/useProducts";
import "./style/productCatalog.css";
import useAddToCart from "../domain/util/useAddToCart";
import { authState } from "../domain/states/authState";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

const ProductsCatalog: React.FC = () => {
  const {products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const authState1 = useRecoilValue(authState);
  const addToCart = useAddToCart();
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const fabIcon = authState1?.isDistributer ? (
    <AssignmentIcon />
  ) : (
    <ShoppingCartIcon />
  );
  const fabLabel = authState1?.isDistributer ? "סיכום הזמנות" : "סיכום הזמנה";
  const fabRoute = authState1?.isDistributer ? "/demandsView" : "/cart";

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      {authState1 &&
        (authState1.productsCollection.length >= 25 || authState1.isDistributer) && (
          <CategoriesBar />
        )}
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

        {authState1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Fab
              variant="extended"
              onClick={() => handleNavigation(fabRoute)}
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "var(--color-primary-light)",
                },
              }}
            >
              {fabIcon}
              <span style={{ marginLeft: "8px" }}>{fabLabel}</span>
            </Fab>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ProductsCatalog;
