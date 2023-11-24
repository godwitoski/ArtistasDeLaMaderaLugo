const getDB = require("../../database/db");

const cancelOrder = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { productId } = req.params;

    // Verificar si el producto existe en la tabla temporaryorders
    const [productInTemporary] = await connect.query(
      `
      SELECT id, user_id, product_id
      FROM temporaryorders
      WHERE product_id = ?
    `,
      [productId]
    );

    if (productInTemporary.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "El producto no pudo ser encontrado.",
      });
    }
    connect.release();

    const [cancelledProductInOrder] = await connect.query(
      `
      SELECT user_id, product_id
      FROM orders
      WHERE product_id = ? and user_id = ?
    `,
      [productInTemporary[0].product_id, productInTemporary[0].user_id]
    );
    if (cancelledProductInOrder.length > 0) {
      cancelledProductInOrder[0].cancelado = true;
    }

    connect.release();

    // Eliminar el producto de temporaryorders
    await connect.query(
      `
      DELETE FROM temporaryorders
      WHERE id = ?`,
      [productInTemporary[0].id]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Venta cancelada",
      data: cancelledProductInOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = cancelOrder;
