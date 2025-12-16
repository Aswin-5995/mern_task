import { useState } from "react";
import { Fab, Badge } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import OrderDrawer from "./OrderDrawer";

export default function OrderBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          background: "linear-gradient(90deg,#ff6f00,#ff9800)",
        }}
      >
        <Badge color="error" variant="dot">
          <ReceiptLongIcon />
        </Badge>
      </Fab>

      <OrderDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
