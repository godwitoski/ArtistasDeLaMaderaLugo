const addProduct = require("./addProduct");
const searchProduct = require("./searchProduct");
const seeProducts = require("./seeProducts");
const addProductToUserCart = require("./addProductToUserCart");
const seeSingleProduct = require("./seeSingleProduct");
const orderProductsFromCart = require("./orderProductsFromCart");
const moveProductToSales = require("./moveProductToSales");
const getSalesInfo = require("./getSalesInfo");
const removeProductFromUserCart = require("./removeProductFromUserCart");

module.exports = {
  addProduct,
  searchProduct,
  seeProducts,
  addProductToUserCart,
  seeSingleProduct,
  orderProductsFromCart,
  moveProductToSales,
  getSalesInfo,
  removeProductFromUserCart,
};
