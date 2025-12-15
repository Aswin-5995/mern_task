import React, { useContext, useState } from "react";
import CartDrawer from "./CartDrawer";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  useMediaQuery
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [openCart, setOpenCart] = useState(false);
  const role = localStorage.getItem("role");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #ff6f00, #ff9800)"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* LOGO */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <StorefrontIcon />
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Foodiee
            </Typography>
          </Box>

          {/* ACTIONS */}
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 2 }}>
            
            {/* ADMIN LOGIN */}
            {!isMobile && (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate("/admin/login")}
              >
                Admin
              </Button>
            )}

            {/* ADMIN PRODUCTS */}
            {role === "Admin" && !isMobile && (
              <Button
                color="inherit"
                onClick={() => navigate("/admin/products")}
              >
                Products
              </Button>
            )}

            {/* MOBILE ADMIN ICON */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => navigate("/admin/login")}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            )}

            {/* CART */}
            <IconButton
              color="inherit"
              onClick={() => setOpenCart(true)}
              sx={{ ml: 0.5 }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CART DRAWER */}
      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
}
