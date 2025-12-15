import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack
} from "@mui/material";

export default function ProductForm({ open, onClose, editProduct, refresh }) {
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  });

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
    if (!form.name) return toast.error("Name required");
    if (form.price <= 0) return toast.error("Price must be > 0");
    if (form.stock < 0) return toast.error("Stock cannot be negative");

    try {
      if (editProduct) {
        await axios.put(
          `http://localhost:5001/api/products/${editProduct._id}`,
          form,
          { headers: { role } }
        );
        toast.success("Product updated");
      } else {
        await axios.post(
          "http://localhost:5001/api/products",
          form,
          { headers: { role } }
        );
        toast.success("Product added");
      }
      refresh();
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {editProduct ? "Edit Product" : "Add Product"}
      </DialogTitle>

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
          >
            {editProduct ? "Update" : "Add"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
