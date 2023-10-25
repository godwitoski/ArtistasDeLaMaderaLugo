const getDB = require("../database/db");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../config");

const isUser = async (req, res, next) => {
  try {
    const connect = await getDB();
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return res.status(401).send({
        status: 401,
        message: "Falta header de autorización: authorization",
      });
    }

    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, SECRET_TOKEN);
    } catch (error) {
      return res.status(401).send({ status: 401, message: "Token Caducado" });
    }

    // Comprobar que la fecha del token sea válida respecto a lastAuthUpdate
    const [user] = await connect.query(
      `SELECT lastAuthUpdate
             FROM users
             WHERE id = ?`,
      [tokenInfo.id]
    );

    const lastAuthUpdate = new Date(user[0].lastAuthUpdate);
    const timeStampCreateToken = new Date(tokenInfo.iat * 1000);

    if (timeStampCreateToken < lastAuthUpdate) {
      return res.status(401).send({ status: 401, message: "Token Caducado" });
    }

    connect.release();

    // Añadimos la info del token a la request
    req.userInfo = tokenInfo;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUser;
