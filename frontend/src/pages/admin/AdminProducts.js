import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const role = localStorage.getItem("role");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showSnackbar("Failed to load products", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { role },
      });

      showSnackbar("Product deleted", "success");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("Delete failed", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
     
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Product Management
        </Typography>
      </Stack>

     
      <Stack direction="row" justifyContent="flex-end" mb={3}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          disabled={role !== "Admin"}
          onClick={() => {
            setEditProduct(null);
            setOpenForm(true);
          }}
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff6f00, #ff9800)",
            "&:hover": { background: "linear-gradient(90deg, #ff9800, #ff6f00)" },
          }}
        >
          Add Product
        </Button>
      </Stack>

      
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card sx={{ borderRadius: 3, "&:hover": { boxShadow: 6 } }}>
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
        showSnackbar={showSnackbar} 
      />

    
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
