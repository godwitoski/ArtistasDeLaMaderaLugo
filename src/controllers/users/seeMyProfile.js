const getDB = require("../../database/db");

const seeMyProfile = async (req, res, next) => {
  try {
    const idUser = req.userInfo.id;
    const connect = await getDB();

    const [user] = await connect.query(
      `SELECT name, email, username, address, phone
        FROM users 
        WHERE id=?
        `,
      [idUser]
    );
    connect.release();

    if (user.length === 0) {
      return res.status(404).send({
        status: "Error",
        message: "No se pudo encontrar tu usuario",
      });
    }
    connect.release();

    res.status(200).send({
      status: "OK",
      user: user,
    });

    connect.release();
  } catch (error) {
    next(error);
  }
};

module.exports = seeMyProfile;
