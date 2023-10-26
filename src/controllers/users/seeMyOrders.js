const getDB = require("../../database/db");

const seeMyOrders = async (req, res, next) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;

    // Consulta para obtener las órdenes del usuario
    const [orders] = await connect.query(
      `
      SELECT p.name , p.price, o.date AS orderDate, p.sold, p.ordered, p.cancelled
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.date DESC
    `,
      [idUser]
    );

    if (orders.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "No has realizado ningún pedido",
      });
    }
    connect.release();

    return res.status(200).send({
      status: "OK",
      products: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = seeMyOrders;
