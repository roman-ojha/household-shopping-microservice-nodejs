const express = require("express");

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.json());

app.use("/", (req, res) => {
  res.json({ msg: "Hello from Products" });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
