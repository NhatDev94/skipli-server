const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const initSocketIO = require("./socket");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const port = 1994;

const server = http.createServer(app);
initSocketIO(server);

app.use(cors({ origin: "*", credentials: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
