import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const creds = [
      { username: "admin", password: "admin@123", role: "Admin" },
      { username: "staff", password: "staff@123", role: "Staff" },
    ];

    const user = creds.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("role", user.role);
      setSnackbar({ open: true, message: `Welcome ${user.role}`, severity: "success" });

      
      setTimeout(() => navigate("/admin/orders"), 1000);
    } else {
      setSnackbar({ open: true, message: "Invalid credentials", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ff6f00, #ff9800)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 380,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              sx={{
                bgcolor: "#ff6f00",
                width: 56,
                height: 56,
              }}
            >
              <AdminPanelSettingsIcon />
            </Avatar>
          </Box>

          <Typography variant="h5" textAlign="center" fontWeight="bold" mb={1}>
            Admin / Staff Login
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in to manage orders
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 2,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ff6f00, #ff9800)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff9800, #ff6f00)",
                },
              }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
