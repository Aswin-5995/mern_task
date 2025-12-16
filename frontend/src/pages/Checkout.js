import axios from "axios";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
  Stack,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    paymentMode: "COD",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const placeOrder = async () => {
    if (
      cart.length === 0 ||
      !form.customerName ||
      !form.phone ||
      !form.address
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all details",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/orders`, {
        ...form,
        items: cart,
        total,
      });

      setCart([]);
      setSnackbar({
        open: true,
        message: "Order placed successfully!",
        severity: "success",
      });

 
      setTimeout(() => navigate(`/`), 1500);
    } catch (error) {
      console.error("Order error:", error.response || error.message);
      setSnackbar({
        open: true,
        message: "Failed to place order",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Checkout
      </Typography>

      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <LocalShippingIcon color="primary" />
              <Typography variant="h6">Delivery Detail</Typography>
            </Stack>

            <TextField
              fullWidth
              label="Customer Name"
              margin="normal"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              margin="normal"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={1}>
              Payment Methods
            </Typography>

            <RadioGroup
              value={form.paymentMode}
              onChange={(e) =>
                setForm({ ...form, paymentMode: e.target.value })
              }
            >
              <FormControlLabel
                value="COD"
                control={<Radio />}
                label="Cash on Delivery"
              />
              <FormControlLabel
                value="ONLINE"
                control={<Radio />}
                label="Online Payment"
              />
            </RadioGroup>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            Order Summary
          </Typography>

          {cart.map((item) => (
            <Stack
              key={item._id}
              direction="row"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>
                {item.name} × {item.qty}
              </Typography>
              <Typography>₹{item.price * item.qty}</Typography>
            </Stack>
          ))}

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">₹{total}</Typography>
          </Stack>
        </Paper>

        <Button
          size="large"
          disabled={cart.length === 0}
          onClick={placeOrder}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff6f00, #ff9800)",
            color: "#fff",
          }}
        >
          Place Order
        </Button>
      </Stack>

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
