const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  // Creating RabbitMQ channel
  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`Running on http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
