import { useEffect, useState } from "react";
import axios from "axios";
import {
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OrderDrawer({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


useEffect(() => {
  const fetchOrders = async () => {
    if (!open) return;

    try {
      const res = await axios.get(`${API_URL}/orders?me=true`);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  fetchOrders();
}, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          My Orders
        </Typography>

        {orders.length === 0 && (
          <Typography color="text.secondary">
            No orders yet
          </Typography>
        )}

        <Stack spacing={2}>
          {orders.map(o => (
            <Card
              key={o._id}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/order/${o._id}`);
                onClose();
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography fontWeight="bold">
                    Order #{o._id.slice(-6)}
                  </Typography>

                  <Typography>₹{o.total}</Typography>

                  <Chip
                    label={o.status}
                    size="small"
                    color={
                      o.status === "Delivered"
                        ? "success"
                        : "warning"
                    }
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
