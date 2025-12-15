import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../webSocket";

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const STAGES = [
  "Placed",
  "Accepted",
  "Packed",
  "Out for Delivery",
  "Delivered"
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // join order room
    socket.emit("joinOrder", id);

    // initial fetch
    axios
      .get(`http://localhost:5001/api/orders/${id}`)
      .then(res => setOrder(res.data));

    // listen for updates
    socket.on("orderStatusUpdated", updated => {
      if (updated._id === id) {
        setOrder(updated);
      }
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [id]);

  if (!order) return null;

  const currentIndex = STAGES.indexOf(order.status);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        
        {/* HEADER */}
        <Stack spacing={1} mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Order Tracking
          </Typography>
          <Typography color="text.secondary">
            Order ID: {order._id.slice(-6).toUpperCase()}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* TIMELINE */}
        <Stack spacing={3}>
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <Box
                key={stage}
                display="flex"
                alignItems="center"
                gap={2}
              >
                {/* DOT */}
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
                    animation: isActive
                      ? "pulse 1.5s infinite"
                      : "none"
                  }}
                />

                {/* TEXT */}
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
                  <CheckCircleIcon
                    fontSize="small"
                    color="success"
                  />
                )}
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* DELIVERY ETA */}
        <Stack direction="row" alignItems="center" gap={1}>
          <LocalShippingIcon color="primary" />
          <Typography fontWeight="bold">
            Estimated Delivery:
          </Typography>
          <Typography color="text.secondary">
            30 mins
          </Typography>
        </Stack>
      </Paper>

      {/* ANIMATION */}
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
