import axios from "axios";
import { useEffect, useState, useContext } from "react";
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
  Skeleton
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      
      {/* SEARCH BAR */}
      <TextField
        fullWidth
        placeholder="Search for products..."
        variant="outlined"
        sx={{ mb: 4 }}
        onChange={e => setSearch(e.target.value)}
      />

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <Typography align="center" color="text.secondary">
          No products found
        </Typography>
      )}

      {/* PRODUCTS GRID */}
      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(6)) : filtered).map((p, i) => (
          <Grid item xs={12} sm={6} md={4} key={p?._id || i}>
           <Card
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 3,
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: 6
    }
  }}
>
  {/* IMAGE */}
  {loading ? (
    <Skeleton variant="rectangular" height={160} />
  ) : (
    <CardMedia
      component="img"
      height="160"
      image={p.image}
      alt={p.name}
      sx={{ objectFit: "cover" }}
    />
  )}

  {/* CONTENT */}
  <CardContent
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column"
    }}
  >
    {loading ? (
      <>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </>
    ) : (
      <>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          noWrap
        >
          {p.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {p.description}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography fontWeight="bold">
            ₹{p.price}
          </Typography>

          <Chip
            label={p.stock > 0 ? "In Stock" : "Out of Stock"}
            color={p.stock > 0 ? "success" : "error"}
            size="small"
          />
        </Box>

        {/* PUSH BUTTON TO BOTTOM */}
        <Box mt="auto">
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            disabled={p.stock === 0}
            onClick={() => addToCart(p)}
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              background:
                "linear-gradient(90deg, #ff6f00, #ff9800)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #ff9800, #ff6f00)"
              }
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </>
    )}
  </CardContent>
</Card>

          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
