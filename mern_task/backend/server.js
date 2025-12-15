// backend/server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mern_task");

app.set("io", io);

app.use("/api/products", require("./routes/productRoute"));

app.use("/api/orders", require("./routes/orderRoute"));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});


server.listen(5001, () => console.log("Server running"));
