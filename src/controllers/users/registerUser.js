const getDB = require("../../database/db");

const registerUser = async (req, res, next) => {
  try {
    const { email, name, username, pwd } = req.body;
    const connect = await getDB();

    const [userExist] = await connect.query(
      `SELECT id FROM users WHERE email=? OR username = ?`,
      [email, username]
    );

    if (userExist.length > 0) {
      return res.status(409).send({
        status: "ERROR",
        message: "El usuario ya existe",
      });
    }

    await connect.query(
      `INSERT INTO users (email, username, name, password) VALUES (?,?,?,SHA2(?,512))`,
      [email, username, name, pwd]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Usuario creado correctamente",
      newUser: {
        name: name,
        email: email,
        username: username,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
