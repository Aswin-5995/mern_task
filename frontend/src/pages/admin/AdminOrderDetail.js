import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { socket } from "../../webSocket";

import {
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const STATUS = ["Placed", "Accepted", "Packed", "Out for Delivery", "Delivered"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [order, setOrder] = useState(null);
  const role = localStorage.getItem("role");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${API_URL}/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setSnackbar({ open: true, message: "Failed to load order", severity: "error" });
      }
    };

    fetchOrder();
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(
        `${API_URL}/orders/${id}/status`,
        { status },
        { headers: { role } }
      );

      setOrder(res.data);

      socket.emit("orderStatusUpdated", res.data);

      setSnackbar({ open: true, message: "Status updated", severity: "success" });
    } catch (error) {
      console.error("Status update failed:", error);
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  if (!order) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
   
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Order Details
        </Typography>

        <Stack spacing={1}>
          <Typography>👤 {order.customerName}</Typography>
          <Typography>📞 {order.phone}</Typography>
          <Typography>📍 {order.address}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {order.items.map((i) => (
          <Stack key={i._id} direction="row" justifyContent="space-between">
            <Typography>
              {i.name} × {i.qty}
            </Typography>
            <Typography>₹{i.price * i.qty}</Typography>
          </Stack>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">Total: ₹{order.total}</Typography>

        <Divider sx={{ my: 2 }} />

        <Select
          fullWidth
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={role !== "Admin" && role !== "Staff"}
        >
          {STATUS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
