import { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function ProductForm({ open, onClose, editProduct, refresh, showSnackbar }) {
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (editProduct) {
      setForm(editProduct);
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: ""
      });
    }
  }, [editProduct]);

  const submit = async () => {
    if (!form.name) return showSnackbar("Name required", "error");
    if (form.price <= 0) return showSnackbar("Price must be > 0", "error");
    if (form.stock < 0) return showSnackbar("Stock cannot be negative", "error");

    try {
      if (editProduct) {
        await axios.put(
          `${API_URL}/products/${editProduct._id}`,
          form,
          { headers: { role } }
        );
        showSnackbar("Product updated", "success");
      } else {
        await axios.post(
          `${API_URL}/products`,
          form,
          { headers: { role } }
        );
        showSnackbar("Product added", "success");
      }

      refresh();
      onClose();
    } catch (error) {
      console.error("Product submit failed:", error);
      showSnackbar("Operation failed", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Product Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <TextField
            label="Stock Quantity"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />

          <TextField
            label="Image URL (optional)"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />

          <Button
            variant="contained"
            onClick={submit}
            disabled={role !== "Admin"}
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff6f00, #ff9800)",
              "&:hover": { background: "linear-gradient(90deg, #ff9800, #ff6f00)" },
            }}
          >
            {editProduct ? "Update" : "Add"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
