const express = require("express");
const cors = require("cors");
const { products, appEvent } = require("./api");
const HandleErrors = require("./utils/error-handler");

module.exports = async (app, channel) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //api
  // on product api we are passing rabbitMQ channel so that it can use it.
  products(app, channel);

  // error handling
  app.use(HandleErrors);
};
