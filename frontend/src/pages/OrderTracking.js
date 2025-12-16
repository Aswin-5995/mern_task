import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../webSocket";

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const STAGES = [
  "Placed",
  "Accepted",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!id) return;

    socket.emit("joinOrder", id);

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    fetchOrder();

    const handleStatusUpdate = (updated) => {
      if (updated._id === id) {
        setOrder(updated);
      }
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleStatusUpdate);
    };
  }, [id]);

  if (!order) return null;

  const currentIndex = STAGES.indexOf(order.status);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Order Tracking
        </Typography>
      </Stack>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={1} mb={3}>
          <Typography color="text.secondary">
            Order ID: {order._id.slice(-6).toUpperCase()}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <Box key={stage} display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: isCompleted
                      ? "success.main"
                      : isActive
                      ? "warning.main"
                      : "grey.400",
                    animation: isActive ? "pulse 1.5s infinite" : "none",
                  }}
                />

                <Typography
                  fontWeight={isActive ? "bold" : "normal"}
                  color={
                    isCompleted
                      ? "success.main"
                      : isActive
                      ? "warning.main"
                      : "text.secondary"
                  }
                >
                  {stage}
                </Typography>

                {isCompleted && (
                  <CheckCircleIcon fontSize="small" color="success" />
                )}
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" alignItems="center" gap={1}>
          <LocalShippingIcon color="primary" />
          <Typography fontWeight="bold">Estimated Delivery:</Typography>
          <Typography color="text.secondary">30 mins</Typography>
        </Stack>
      </Paper>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Container>
  );
}
