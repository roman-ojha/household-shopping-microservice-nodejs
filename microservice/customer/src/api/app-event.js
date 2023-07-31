const CustomerService = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();
  // so here we are create one we hook where the other service so that other service can call this service by using 'this_service_base_url/customer/app-events'
  app.use("/app-events", async (req, res, next) => {
    //   here now it will require some payload
    // and on the payload other service need to pass { event, data }
    const { payload } = req.body;
    //   and then that payload is subscribe by other services
    // we can see all of the SubscriptEvent logic on '../services/customer-service.js', 'SubscriptEvent' service method
    service.SubscribeEvents(payload);

    console.log("============= Shopping Service received event ==========");
    return res.status(200).json(payload);
  });
};
