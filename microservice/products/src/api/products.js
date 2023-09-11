const ProductService = require("../services/product-service");
// here Customer Service doesn't exist in this microservice so we will rather use Customer Event Publisher
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");
// So these 'PublishCustomerEvent' & 'PublishShoppingEvent' are event through which we will interact with other microservice.
const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    // here we will create the payload to pass on 'customer' microservice
    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST" // NOTE that this event name needs to match with the the Customer Service Event name
    );

    try {
      // Now here we are passing the return payload which is as 'data' to the Customer Event which will interact with customer microservice
      PublishCustomerEvent(data);
      // to send to customer service
      return res.status(200).json(data.data);
    } catch (err) {}
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const product = await service.GetProductById(productId);
      const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(wishlist);
    } catch (err) {
      next(err);
    }
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id, qty } = req.body;

    try {
      const product = await service.GetProductById(_id);

      const result = await customerService.ManageCart(
        req.user._id,
        product,
        qty,
        false
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const product = await service.GetProductById(req.params.id);
      const result = await customerService.ManageCart(_id, product, 0, true);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
