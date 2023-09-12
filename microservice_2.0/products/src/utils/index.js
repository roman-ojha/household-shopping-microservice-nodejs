const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config");

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

/* Message Broker */

// '../../../05_Project_Queue.PNG'
// *) Publisher:
//     -> publisher will publish the some kind of message.
// *) Exchange Distributer:
//     -> It is a kind of distributer which will be able to distribute the message between the queues depends on the certain keys.
//     -> and we have to bind the key with the exchange
// *) Consumer:
//     -> Now consumer will just going to listen to the specific queue whenever publisher will publish to the exchange

// Rather then using Web API 'Publisher' to communicate with other service we will going to use Message Broker
// So we will going to Create the Message broker
// Create a channel
module.exports.CreateChannel = async () => {
  try {
    // Creating connection to rabbitMQ
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    // after connection we will create a channel
    const channel = await connection.createChannel();
    // So here we will just going to assert our exchange
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (err) {
    throw err;
  }
};

// Publish Message
module.exports.PublishMessage = async (channel, binding_key, message) => {
  try {
    // so here now we will going to publish the specific message using created 'channel' with the help of the 'EXCHANGE_NAME' and the 'binding_key'
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (err) {
    throw err;
  }
};

// Subscribe message
module.exports.SubscribeMessage = async (channel, service, binding_key) => {
  // So to subscribe message we need the same 'channel' that we create above
  // So we need a different Queue name for different Queues like in this case 'Shopping_Queue' & 'Customer_Queue'
  // where 'Shopping_Queue' is responsible for all the message will lay down to the Shopping Consumer
  // Same for 'Customer_Queue'
  const appQueue = await channel.assertQueue("QUEUE_NAME");
  // here whatever queue we are asserting we will going to bind with queue with 'EXCHANGE_NAME' & 'binding_key' so that we can be able to receive the data that what ever will get published by the publisher
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
  channel.consume(appQueue, (data) => {
    // now here we will consumer the data.
    console.log("received data");
    console.log(data.content.toString());
    channel.ack(data);
  });
};
