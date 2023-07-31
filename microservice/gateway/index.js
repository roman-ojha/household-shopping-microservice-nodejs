const express = require("express");
const cors = require("cors");

// this proxy will redirect our request, the request that is coming to the gateway and it will redirect the request to other microservices based on api routes
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/customer", proxy("http://locahost"));

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
