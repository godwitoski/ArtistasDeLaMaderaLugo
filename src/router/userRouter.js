const express = require("express");

const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");
const validatorInfoUser = require("../middlewares/validatorInfoUser");

const {
  registerUser,
  loginUser,
  userInfo,
  seeMyUserCart,
  seeMyOrders,
} = require("../controllers/users");

router.post("/register", validatorInfoUser, registerUser);
router.post("/login", loginUser);
router.get("/users", isUser, isAdmin, userInfo);
router.get("/user/mycart", isUser, seeMyUserCart);
router.get("/user/myorders", isUser, seeMyOrders);

module.exports = router;
