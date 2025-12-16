import { BrowserRouter, Routes, Route } from "react-router-dom";

import Products from "./pages/ProductList";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import AdminRoute from "./routes/AdminRoute";
import AdminProducts from "./pages/admin/AdminProducts";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderTracking />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders/:id"
            element={
              <AdminRoute>
                <AdminOrderDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
