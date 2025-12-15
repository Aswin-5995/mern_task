const express = require("express");
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const connectDB = require("./config/db");


connectDB();


const app = express();
const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
req.io = io;
next();
});


app.use("/api/products", require("./routes/productRoute"));
app.use("/api/orders", require("./routes/orderRoute"));


server.listen(5001, () => console.log("Backend running on 5001"));