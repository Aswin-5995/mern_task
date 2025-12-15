import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProductList from "./pages/ProductList";
import Checkout from "./pages/Checkout";
import AdminLogin from "./admin/AdminLogin";
import AdminOrders from "./admin/AdminOrders";
import OrderTracking from "./pages/OrderTracking";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Customer */}
          <Route path="/" element={<ProductList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
