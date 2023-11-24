const express = require("express");

const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");
const validatorInfoUser = require("../middlewares/validatorInfoUser");
const canEditUser = require("../middlewares/canEditUser");

const {
  registerUser,
  loginUser,
  userInfo,
  seeMyUserCart,
  seeMyOrders,
  seeMyProfile,
  editMyUser,
  deleteMySingleOrder,
} = require("../controllers/users");

router.post("/register", validatorInfoUser, registerUser);
router.post("/login", loginUser);

router.get("/user/mycart", isUser, seeMyUserCart);
router.get("/user/myuser", isUser, seeMyProfile);
router.get("/user/myorders", isUser, seeMyOrders);

router.get("/users", isUser, isAdmin, userInfo);

router.put(
  "/user/editprofile",
  isUser,
  canEditUser,
  validatorInfoUser,
  editMyUser
);

router.delete("/user/myorders/:productId", isUser, deleteMySingleOrder);

module.exports = router;
