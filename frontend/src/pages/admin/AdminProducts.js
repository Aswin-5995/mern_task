import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  IconButton
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ProductForm from "./ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost:5001/api/products")
      .then(res => setProducts(res.data));
  };

  const deleteProduct = async id => {
    if (!window.confirm("Delete product?")) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/products/${id}`,
        { headers: { role } }
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Product Management
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          disabled={role !== "Admin"}
          onClick={() => {
            setEditProduct(null);
            setOpenForm(true);
          }}
        >
          Add Product
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardMedia
                component="img"
                height="160"
                image={p.image || "https://via.placeholder.com/300"}
              />
              <CardContent>
                <Typography fontWeight="bold">{p.name}</Typography>
                <Typography color="text.secondary" noWrap>
                  {p.description}
                </Typography>

                <Typography mt={1}>
                  ₹{p.price} | Stock: {p.stock}
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <IconButton
                    disabled={role !== "Admin"}
                    onClick={() => {
                      setEditProduct(p);
                      setOpenForm(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    disabled={role !== "Admin"}
                    onClick={() => deleteProduct(p._id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ProductForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        editProduct={editProduct}
        refresh={fetchProducts}
      />
    </Container>
  );
}
