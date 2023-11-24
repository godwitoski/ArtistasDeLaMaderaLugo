const getDB = require("../../database/db");

const deleteMySingleOrder = async (req, res, next) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;
    const { productId } = req.params;

    // Consulta para obtener las órdenes del usuario
    const [orders] = await connect.query(
      `
      SELECT o.product_id
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ? and o.product_id = ?
    `,
      [idUser, productId]
    );
    connect.release();

    if (orders.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "No has realizado ningún pedido",
      });
    }
    connect.release();

    console.log(orders, orders[0]);
    await connect.query(
      `
        DELETE FROM orders WHERE product_id = ? and user_id = ? 
        `,
      [orders[0].product_id, idUser]
    );

    connect.release();

    return res.status(200).send({
      status: "OK",
      message: "Articulo eliminado de tus pedidos",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteMySingleOrder;
