import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../webSocket";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

const STATUS_COLOR = {
  Placed: "default",
  Accepted: "info",
  Packed: "warning",
  "Out for Delivery": "primary",
  Delivered: "success",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setSnackbar({ open: true, message: "Failed to load orders", severity: "error" });
      }
    };

    fetchOrders();

    const handleNewOrder = (order) => {
      order._isNew = true;
      setOrders((prev) => [order, ...prev]);

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, _isNew: false } : o))
        );
      }, 5000);
    };

    const handleStatusUpdate = (updated) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setSnackbar({ open: true, message: `Order ${updated._id} updated`, severity: "info" });
    };

    socket.on("newOrderPlaced", handleNewOrder);
    socket.on("orderStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("newOrderPlaced", handleNewOrder);
      socket.off("orderStatusUpdated", handleStatusUpdate);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "delivered" && o.status !== "Delivered") return false;
    if (filter === "pending" && o.status === "Delivered") return false;
    if (filter === "today") {
      const today = new Date().toDateString();
      if (new Date(o.createdAt).toDateString() !== today) return false;
    }
    if (search && !o._id.includes(search) && !o.phone.includes(search)) return false;

    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Orders
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, v) => v && setFilter(v)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="today">Today</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="delivered">Delivered</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          placeholder="Search Order ID / Phone Number"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <Grid container spacing={3}>
        {filteredOrders.map((o) => (
          <Grid item xs={12} md={6} key={o._id}>
            <Card
              onClick={() => navigate(`/admin/orders/${o._id}`)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                bgcolor: o._isNew ? "#e3f2fd" : "#fff",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold">{o.customerName}</Typography>
                    <Chip
                      label={o.status}
                      color={STATUS_COLOR[o.status]}
                      size="small"
                    />
                  </Box>

                  <Typography color="text.secondary">📞 {o.phone}</Typography>

                  <Typography fontWeight="bold">₹{o.total}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
