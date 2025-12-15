import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [customerName,setCustomerName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [paymentMode,setPaymentMode] = useState("COD");

  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);

  const placeOrder = async () => {
    if(cart.length===0){ toast.error("Cart empty"); return; }
    if(!customerName||!phone||!address){ toast.error("Fill all fields"); return; }

    try {
      await axios.post("http://localhost:5000/api/orders",{customerName,phone,address,items:cart,total,paymentMode});
      toast.success("Order placed"); setCart([]);
    } catch(e){ toast.error("Failed"); }
  };

  return (
    <div>
      {cart.map(item=>(<div key={item._id}>{item.name} x {item.qty} = ₹{item.qty*item.price}</div>))}
      <h3>Total: ₹{total}</h3>
      <input placeholder="Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <textarea placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
      <select value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
        <option value="COD">COD</option>
        <option value="ONLINE">Online</option>
      </select>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
