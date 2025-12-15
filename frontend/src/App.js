import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";


export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<ProductList />} />
<Route path="/checkout" element={<Checkout />} />
<Route path="/track/:id" element={<OrderTracking />} />
<Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/orders" element={<AdminOrders />} />
<Route path="/admin/products" element={<AdminProducts />} />
</Routes>
</BrowserRouter>
);
}