import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Container,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
  
      <TextField
        fullWidth
        placeholder="Search products"
        variant="outlined"
        value={search}
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!loading && filtered.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms
          </Typography>
        </Box>
      )}

     
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
        {(loading ? Array.from(new Array(6)) : filtered).map((p, i) => (
          <Card
            key={p?._id || i}
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
           
            {loading ? (
              <Skeleton variant="rectangular" height={220} />
            ) : (
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
                  image={p?.image || `https://via.placeholder.com/400x220/f5f5f5/757575?text=${encodeURIComponent(p?.name || 'Product')}`}
                  alt={p?.name || "Product"}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x220/f5f5f5/757575?text=${encodeURIComponent(p?.name || 'Product')}`;
                  }}
                />
              </Box>
            )}

          
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
                pb: 2.5,
              }}
            >
              {loading ? (
                <>
                  <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
                  <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Skeleton width="30%" height={32} />
                    <Skeleton width="25%" height={24} />
                  </Box>
                  <Skeleton width="100%" height={40} />
                </>
              ) : (
                <>
                 
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
                      label={p.stock > 0 ? "In Stock" : "Out of Stock"}
                      color={p.stock > 0 ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    disabled={p.stock === 0}
                    onClick={() => handleAddToCart(p)}
                    sx={{
                      height: 40,
                      borderRadius: 1.5,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      background: "linear-gradient(90deg, #ff6f00, #ff9800)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #e65100, #f57c00)",
                      },
                      "&:disabled": {
                        background: "#bdbdbd",
                        color: "#757575"
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}