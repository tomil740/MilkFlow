import {
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { authState } from "../domain/states/authState";
import UserHeader from "./components/UserHeader";
import useProducts from "../domain/useCase/useProducts";
import { useEffect, useState } from "react";
import { Product } from "../domain/models/Product";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateDemandStatus } from "../domain/useCase/useUpdateDemandStatus";
import "./style/demandItemPage.css";
import { Demand } from '../domain/models/Demand';
import { DatePresentation } from "./components/DatePresentation";


const DemandItemPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);

  const [snackMessage, setSnackMessage] = useState<string | null>(null);
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">();
 
  const { demand } = location.state as { demand: Demand };
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const [cartProducts, setCartProducts] = useState<
    (Product & { amount: number })[]
  >([]);
  const {
    updating,
    error: updateError,
    updateStatus,
  } = useUpdateDemandStatus();

  useEffect(() => {
    if (!demand) {
      console.error("Invalid navigation state.");
      navigate("/demands"); // Redirect to the demands list if state is missing
    }
  }, [demand, navigate]);

  // Fetch products and map demand products to cartProducts
  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts(); // Fetch all products
    };

    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (demand) {
      const mappedProducts = demand.products
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? { ...product, amount: item.amount } : null;
        })
        .filter((item): item is Product & { amount: number } => item !== null);

      setCartProducts(mappedProducts);
    }
  }, [demand, products]);

  if (!demand) {
    return null; // Avoid rendering until demand is confirmed
  }
  const handleUpdateStatus = async () => {
    try {
      const newStatus = demand.status === "pending" ? "placed" : "completed";
      await updateStatus(demand.demandId, newStatus);
      setSnackMessage(`Demand marked as ${newStatus}.`);
      setSnackSeverity("success");
      navigate("/demandsView");
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackMessage("Failed to update demand status.");
      setSnackSeverity("error");
    }
  };

  if (!demand) {
    return null;
  }

  return (
    <div className="demand-page-container">
      <Card className="demand-header">
        <CardContent>
          <div className="demand-header-row">
            <Typography variant="h6" className="demand-status">
              Status:{" "}
              {demand.status.charAt(0).toUpperCase() + demand.status.slice(1)}
            </Typography>
            <div className="user-details-row">
              <UserHeader userId={demand.userId} />
              {demand.distributerId && (
                <UserHeader userId={demand.distributerId} />
              )}
            </div>
          </div>
          <DatePresentation createdAt={demand.createdAt} updatedAt={demand.updatedAt}/>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {productsLoading ? (
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="body2">Loading products...</Typography>
        </div>
      ) : (
        <List className="demand-products-list">
          {cartProducts.map((productItem, index) => (
            <ListItem key={index} className="demand-product-item">
              <img
                src={productItem.imgUrl}
                alt={productItem.name}
                className="product-img"
              />
              <div className="product-details">
                <Typography variant="subtitle1">{productItem.name}</Typography>
                <Typography variant="body2">
                  Price: {productItem.price.toFixed(2)}₪
                </Typography>
                <Typography variant="body2">
                  Amount: {productItem.amount}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={Boolean(snackMessage)}
        autoHideDuration={2000}
        onClose={() => setSnackMessage(null)}
      >
        <Alert severity={snackSeverity} onClose={() => setSnackMessage(null)}>
          {snackMessage}
        </Alert>
      </Snackbar>

      {auth?.isDistributer && demand.status !== "completed" && (
        <div className="update-status-button-Container">
          <Button
            variant="contained"
            color="primary"
            className="update-status-button"
            onClick={handleUpdateStatus}
          >
            {demand.status === "pending"
              ? "Mark as Placed"
              : "Mark as Completed"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DemandItemPage;



