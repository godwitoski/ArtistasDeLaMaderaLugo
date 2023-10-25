const getDB = require("../database/db");

const isAdmin = async (req, res, next) => {
  try {
    const connect = await getDB();

    const [user] = await connect.query(
      `SELECT id, role
             FROM users
             WHERE id = ?`,
      [req.userInfo.id]
    );

    connect.release();
    if (user[0].role !== "admin") {
      return res.status(401).send({
        status: 401,
        message: "No tienes permisos suficientes para esta acción",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
