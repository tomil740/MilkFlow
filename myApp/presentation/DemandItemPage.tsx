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
  Dialog,
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
import { Demand } from "../domain/models/Demand";
import { DatePresentation } from "./components/DatePresentation";
import statusPresentation from "./util/statusPresentation";
import { checkInternetConnection } from "../data/remoteDao/util/checkInternetConnection";

const DemandItemPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success' | 'error' | 'info' | 'warning'
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const { demand } = location.state as { demand: Demand };
  const {
    allProducts,
    fetchProducts,
    loading: productsLoading,
  } = useProducts();
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
      setSnackbar({
        open: true,
        message: "Invalid navigation state. Redirecting...",
        severity: "error",
      });
      setTimeout(() => navigate("/demands"), 2000);
    }
  }, [demand, navigate]);

  useEffect(() => {
    if (demand) {
      const mappedProducts = demand.products
        .map((item) => {
          const product = allProducts.find((p) => p.id === item.productId);
          return product ? { ...product, amount: item.amount } : null;
        })
        .filter((item): item is Product & { amount: number } => item !== null);

      setCartProducts(mappedProducts);
    }
  }, [demand, allProducts]);

  const handleUpdateStatus = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setSnackbar({
        open: true,
        message: "אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב.",
        severity: "error",
      });
      return;
    }

    setDialogOpen(true);

    try {
      const newStatus = demand.status === "pending" ? "placed" : "completed";

      // Perform the status update and check the result
      const processCompleted = await updateStatus(
        demand.id,
        demand.status,
        newStatus
      );

      if (processCompleted) {
        setSnackbar({
          open: true,
          message: "סטטוס עודכן בהצלחה!",
          severity: "success",
        });
        setTimeout(() => navigate("/demandsView"), 2000);
      } else {
        setSnackbar({
          open: true,
          message: "נכשל בעדכון המצב",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setSnackbar({
        open: true,
        message: "נכשל בעדכון המצב",
        severity: "error",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const handleSnackbarClose = () =>
    setSnackbar({ ...snackbar, open: false, message: "" });

  return (
    <div className="demand-page-container">
      {/* Loading Dialog */}
      <Dialog open={dialogOpen}>
        <div className="loading-dialog">
          <CircularProgress />
          <Typography variant="body1">עדכון סטטוס דרישה...</Typography>
        </div>
      </Dialog>

      {/* Demand Header */}
      <Card className="demand-header">
        <CardContent>
          <div className="demand-header-row">
            <Typography variant="h6" className="demand-status">
              סטטוס:
              <strong className="status-text">
                {statusPresentation(demand.status)}
              </strong>
            </Typography>
            <div className="user-details-row">
              <UserHeader userId={demand.userId} />
              {demand.distributerId && (
                <UserHeader userId={demand.distributerId} />
              )}
            </div>
          </div>
          <DatePresentation
            createdAt={demand.createdAt}
            updatedAt={demand.updatedAt}
          />
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Product List */}
      {productsLoading ? (
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="body2">טעינת מוצרים...</Typography>
        </div>
      ) : (
        <List className="demand-products-list">
          {cartProducts.map((productItem, index) => (
            <ListItem key={index} className="demand-product-item">
              <img
                src={`/productsImages/regular/${productItem.imgKey}.webp`}
                alt={productItem.name}
                className="product-img"
                onError={(e) => {
                  e.currentTarget.src = `/productsImages/logos/large_logo.png`;
                }}
              />
              <div className="product-details">
                <Typography variant="subtitle1">{productItem.name}</Typography>
                <Typography variant="body2">
                  חבילות: {productItem.amount}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      )}

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbar.severity as "success" | "error" | "info" | "warning"
          }
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Update Status Button */}
      {auth?.isDistributer && demand.status !== "completed" && (
        <div className="update-status-button-container">
          <Button
            variant="contained"
            color="primary"
            className="update-status-button"
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            עדכן סטטוס ל{statusPresentation(demand.status)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DemandItemPage;
