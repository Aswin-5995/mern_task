import { useEffect,useState } from "react";
import axios from "axios";
import { socket } from "../webSocket";
import { toast } from "react-toastify";

export default function AdminOrders(){
  const [orders,setOrders]=useState([]);
  const role = localStorage.getItem("role");

  useEffect(()=>{
    axios.get("http://localhost:5000/api/orders").then(res=>setOrders(res.data));
    socket.on("newOrderPlaced",o=>{ toast.info("New order"); setOrders(prev=>[o,...prev]) });
    socket.on("orderStatusUpdated",u=>{ setOrders(prev=>prev.map(o=>o._id===u._id?u:o)) });
    return ()=>{ socket.off("newOrderPlaced"); socket.off("orderStatusUpdated"); };
  },[]);

  const updateStatus = async (id,status)=>{
    try{ await axios.put(`http://localhost:5000/api/orders/${id}/status`,{status},{headers:{role}}); toast.success("Updated"); }
    catch{toast.error("Failed");}
  }

  return (
    <div>
      {orders.map(o=>(
        <div key={o._id}>
          <p>{o.customerName} - ₹{o.total}</p>
          <select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)}>
            {["Placed","Accepted","Packed","Out for Delivery","Delivered"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
