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
  FormControlLabel
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    paymentMode: "COD"
  });

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const placeOrder = async () => {
  if (cart.length === 0) return;
  if (!form.customerName || !form.phone || !form.address) return;

  try {
    console.log("workingg");

    const res = await axios.post(
      "http://localhost:5001/api/orders",
      {
        ...form,
        items: cart,
        total
      }
    );

    setCart([]);
    navigate(`/order/${res.data._id}`);
  } catch (err) {
    console.error("Order error:", err.response || err.message);
  }
};


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Checkout
      </Typography>

      <Stack spacing={3}>
        
        {/* DELIVERY DETAILS */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <LocalShippingIcon color="primary" />
              <Typography variant="h6">Delivery Details</Typography>
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
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              margin="normal"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </CardContent>
        </Card>

        {/* PAYMENT MODE */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={1}>
              Payment Method
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
                label="Online Payment (Dummy)"
              />
            </RadioGroup>
          </CardContent>
        </Card>

        {/* ORDER SUMMARY */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>
            Order Summary
          </Typography>

          {cart.map(item => (
            <Stack
              key={item._id}
              direction="row"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>
                {item.name} × {item.qty}
              </Typography>
              <Typography>
                ₹{item.price * item.qty}
              </Typography>
            </Stack>
          ))}

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">₹{total}</Typography>
          </Stack>
        </Paper>

        {/* PLACE ORDER */}
        <Button
          size="large"
          disabled={cart.length === 0}
          onClick={placeOrder}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff6f00, #ff9800)",
            color: "#fff"
          }}
        >
          Place Order
        </Button>
      </Stack>
    </Container>
  );
}
