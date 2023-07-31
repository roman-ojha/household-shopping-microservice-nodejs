const express = require("express");
const cors = require("cors");

// this proxy will redirect our request, the request that is coming to the gateway and it will redirect the request to other microservices based on api routes
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// redirecting request to it's specific apis
app.use("/customer", proxy(process.env.CUSTOMER_API_BASE_URL));
app.use("/shopping", proxy(process.env.SHOPPING_API_BASE_URL));
app.use("/", proxy(process.env.PRODUCTS_API_BASE_URL)); // product endpoint

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
