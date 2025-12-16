const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const connectDB = require("./config/db");

const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Socket is connected:", socket.id);

  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
  });

  socket.on("disconnect", () => {
    console.log("Socket is disconnected");
  });
});

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

server.listen(5001, () => console.log("Backend running in 5001"));
