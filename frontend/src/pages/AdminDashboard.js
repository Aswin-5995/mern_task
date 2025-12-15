import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function OrderTracking() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    socket.on("orderStatusUpdated", (updated) => {
      setOrder(updated);
    });
  }, []);

  return <h2>Order Status: {order?.status}</h2>;
}
