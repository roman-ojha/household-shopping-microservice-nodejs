const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { APP_SECRET } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// function that will interact with 'customer' microservice from 'product' microservice
// Here we are using API to interact with other microservice
module.exports.PublishCustomerEvent = async (payload) => {
  // we have to request to 'customer/app-events' endpoint to interact with 'customer'
  axios.post("https://locahost:8000/customer/app-events", {
    payload,
  });
};

module.exports.PublishShoppingEvent = async (payload) => {
  // we have to request to 'shopping/app-events' endpoint to interact with 'customer'
  axios.post("https://locahost:8000/shopping/app-events", {
    payload,
  });
};
