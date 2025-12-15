import { useEffect, useState } from "react";
import { socket } from "../webSocket";

export default function OrderTracking({orderId}) {
  const [order,setOrder] = useState(null);
  const stages = ["Placed","Accepted","Packed","Out for Delivery","Delivered"];

  useEffect(()=>{
    socket.on("orderStatusUpdated",updated=>{
      if(updated._id===orderId) setOrder(updated);
    });
  },[orderId]);

  return (
    <div>
      <h3>Order Status</h3>
      {stages.map(stage=>(
        <div key={stage}>
          {stage} {order?.status===stage?"🔴":""}
        </div>
      ))}
    </div>
  );
}
