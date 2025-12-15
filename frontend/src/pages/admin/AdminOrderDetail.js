import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "../../webSocket";
import { toast } from "react-toastify";

import {
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Select,
  MenuItem
} from "@mui/material";

const STATUSES = [
  "Placed",
  "Accepted",
  "Packed",
  "Out for Delivery",
  "Delivered"
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get(`http://localhost:5001/api/orders/${id}`)
      .then(res => setOrder(res.data));
  }, [id]);

  const updateStatus = async status => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/orders/${id}/status`,
        { status },
        { headers: { role } }
      );
      setOrder(res.data);
      toast.success("Status updated");
    } catch {
      toast.error("Failed");
    }
  };

  if (!order) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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

        {order.items.map(i => (
          <Stack
            key={i._id}
            direction="row"
            justifyContent="space-between"
          >
            <Typography>
              {i.name} × {i.qty}
            </Typography>
            <Typography>
              ₹{i.price * i.qty}
            </Typography>
          </Stack>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">
          Total: ₹{order.total}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Select
          fullWidth
          value={order.status}
          onChange={e => updateStatus(e.target.value)}
          disabled={role !== "Admin"}
        >
          {STATUSES.map(s => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </Paper>
    </Container>
  );
}
