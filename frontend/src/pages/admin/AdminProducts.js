import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";

const API = "http://localhost:5001/api/products";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const role = localStorage.getItem("role");

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    if (!form.name || form.price <= 0 || form.stock < 0) {
      toast.error("Invalid input");
      return;
    }

    await axios.post(API, form, { headers: { role } });
    toast.success("Product added");
    setForm({ name: "", description: "", price: "", stock: "", imageUrl: "" });
    fetchProducts();
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        Product Management
      </Typography>

      {/* ➕ Add Product */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Price" name="price" type="number" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Stock" name="stock" type="number" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Image URL" name="imageUrl" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>

          <Button sx={{ mt: 2 }} variant="contained" onClick={addProduct}>
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* 📦 Product List */}
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} sm={4} key={p._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography>₹{p.price}</Typography>
                <Typography color={p.stock > 0 ? "green" : "red"}>
                  {p.stock > 0 ? "In Stock" : "Out of Stock"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
