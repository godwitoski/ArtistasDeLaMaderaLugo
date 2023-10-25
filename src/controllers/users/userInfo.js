const getDB = require("../../database/db");

const userInfo = async (req, res, next) => {
  try {
    const connect = await getDB();

    // Consulta para obtener los datos del usuario
    const [users] = await connect.query(`
      SELECT id, email, name, username, role
      FROM users
    `);

    // Consulta para obtener los productos vendidos por el usuario
    const soldProductsWithUsers = await Promise.all(
      users.map(async (user) => {
        const [productSold] = await connect.query(
          `
         SELECT p.id as productId, p.name, p.price, s.date as soldDate
            FROM products p
            JOIN sold s ON p.id = s.product_id
            WHERE s.user_id = ?`,
          [user.id]
        );
        user["purchasedProducts"] = productSold;

        if (!user["purchasedProducts"].length) {
          user["purchasedProducts"] = [];
        }

        return user; // Devuelve el producto con las fotos agregadas
      })
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      users: soldProductsWithUsers, // Tomamos el primer registro ya que solo debería haber uno
    });
  } catch (error) {
    next(error);
  }
};

module.exports = userInfo;
