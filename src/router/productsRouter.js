const express = require("express");

//enrutador
const router = express.Router();

//Middlewares
const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");
const validatorFiles = require("../middlewares/validatorFiles");

const {
  addProduct,
  searchProduct,
  addProductToUserCart,
  seeSingleProduct,
  orderProductsFromCart,
  moveProductToSales,
  getSalesInfo,
  removeProductFromUserCart,
} = require("../controllers/products");

router.get("/products/sales", isUser, isAdmin, getSalesInfo);

router.get("/products/search?", searchProduct);
router.get("/products/:productId", seeSingleProduct);

router.post("/products/:productId/saveProduct", isUser, addProductToUserCart);
router.post("/products/sendOrder", isUser, orderProductsFromCart);

router.post("/products/addNew", isUser, isAdmin, validatorFiles, addProduct);
router.post("/products/:productId/sales", isUser, isAdmin, moveProductToSales);

router.delete("/products/:productId", isUser, removeProductFromUserCart);

module.exports = router;
