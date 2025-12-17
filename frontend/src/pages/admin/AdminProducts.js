import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Chip
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
     
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Product Management
        </Typography>
      </Stack>

     
      <Stack direction="row" justifyContent="flex-end" mb={4}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          disabled={role !== "Admin"}
          onClick={() => {
            setEditProduct(null);
            setOpenForm(true);
          }}
          sx={{
            fontWeight: "600",
            px: 3,
            py: 1,
            borderRadius: 2,
            background: "linear-gradient(90deg, #ff6f00, #ff9800)",
            "&:hover": { background: "linear-gradient(90deg, #e65100, #f57c00)" },
            "&:disabled": {
              background: "#bdbdbd",
              color: "#757575"
            }
          }}
        >
          Add Product
        </Button>
      </Stack>

     
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {products.map((p) => (
          <Card
            key={p._id}
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              transition: "all 0.3s ease",
              boxShadow: 1,
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
                borderColor: "primary.main"
              },
            }}
          >
           
            <Box
              sx={{
                height: 220,
                width: "100%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderBottom: "1px solid",
                borderColor: "divider"
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                image={p.imageUrl || `https://via.placeholder.com/400x220/f5f5f5/757575?text=${encodeURIComponent(p.name || 'Product')}`}
                alt={p.name || "Product"}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x220/f5f5f5/757575?text=${encodeURIComponent(p.name || 'Product')}`;
                }}
              />
            </Box>

          
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
                pb: 2.5,
              }}
            >
             
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  height: 52,
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "26px",
                  fontSize: "1.1rem"
                }}
              >
                {p.name}
              </Typography>

            
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  height: 40,
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "20px",
                  fontSize: "0.875rem"
                }}
              >
                {p.description}
              </Typography>

             
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ height: 32, mb: 2.5 }}
              >
                <Typography
                  fontWeight="700"
                  variant="h5"
                  sx={{ color: "#ff6f00" }}
                >
                  ₹{p.price}
                </Typography>
                <Chip
                  label={`Stock: ${p.stock}`}
                  color={p.stock > 0 ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

            
              <Stack direction="row" spacing={1} sx={{ height: 40 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  disabled={role !== "Admin"}
                  onClick={() => {
                    setEditProduct(p);
                    setOpenForm(true);
                  }}
                  sx={{
                    height: 40,
                    borderRadius: 1.5,
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    borderColor: "#ff9800",
                    color: "#ff6f00",
                    "&:hover": {
                      borderColor: "#ff6f00",
                      backgroundColor: "rgba(255, 111, 0, 0.04)",
                    },
                    "&:disabled": {
                      borderColor: "#e0e0e0",
                      color: "#9e9e9e"
                    }
                  }}
                >
                  Edit
                </Button>

                <IconButton
                  disabled={role !== "Admin"}
                  onClick={() => deleteProduct(p._id)}
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "error.main",
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                    "&:disabled": {
                      borderColor: "#e0e0e0",
                      color: "#9e9e9e"
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

     
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