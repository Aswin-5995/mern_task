import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { cart, setCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p._id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={360}
        p={2}
        height="100%"
        display="flex"
        flexDirection="column"
      >
      
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Your Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

      
        {cart.length === 0 && (
          <Typography color="text.secondary" textAlign="center">
            Your cart is empty
          </Typography>
        )}

       
        <Box flex={1} overflow="auto">
          {cart.map((item) => (
            <Box key={item._id} mb={2}>
              <Typography fontWeight="bold">{item.name}</Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>
                  ₹{item.price} × {item.qty}
                </Typography>

                <Stack direction="row" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => decreaseQty(item._id)}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <IconButton size="small" onClick={() => addToCart(item)}>
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Box>

       
        {cart.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold" mb={1}>
              Total: ₹{total}
            </Typography>

            <Button
              fullWidth
              size="large"
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              sx={{
                borderRadius: 3,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ff6f00, #ff9800)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff9800, #ff6f00)",
                },
              }}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
}
