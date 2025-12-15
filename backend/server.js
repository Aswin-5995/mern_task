const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const connectDB = require("./config/db");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

/* ✅ THIS MUST COME BEFORE ROUTES */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* SOCKET CONNECTION */
io.on("connection", socket => {
  console.log("Socket connected:", socket.id);

  socket.on("joinOrder", orderId => {
    socket.join(orderId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

/* ROUTES */
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/orders", require("./routes/orderRoute"));

server.listen(5001, () =>
  console.log("Backend running on 5001")
);
