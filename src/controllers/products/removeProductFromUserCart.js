const getDB = require("../../database/db");

const removeProductFromUserCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const idUser = req.userInfo.id;
    const connect = await getDB();

    // Verificar si el producto existe en el carrito del usuario
    const [existingProduct] = await connect.query(
      `
      SELECT id
      FROM cart
      WHERE user_id = ? AND product_id = ?
    `,
      [idUser, productId]
    );

    if (existingProduct.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "El producto no existe en tu carrito.",
      });
    }
    connect.release();

    const [result] = await connect.query(
      `
        DELETE FROM cart
        WHERE user_id = ? AND product_id = ?
      `,
      [idUser, productId]
    );
    console.log(result);
    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Producto eliminado de tu carrito",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = removeProductFromUserCart;
