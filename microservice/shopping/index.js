const express = require("express");

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());

app.use("/", (req, res) => {
  res.json({ msg: "Hello from Shopping" });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
