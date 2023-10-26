const getDB = require("../../database/db");

const addProductToUserCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const idUser = req.userInfo.id;
    const connect = await getDB();

    // Verificar si el producto existe
    const [product] = await connect.query(
      `
        SELECT id 
        FROM products 
       WHERE id = ?
    `,
      [productId]
    );

    if (product.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "El producto no existe.",
      });
    }

    // Verificar si el producto ya está en el carrito del usuario
    const [existingProduct] = await connect.query(
      `
      SELECT id
      FROM cart
      WHERE user_id = ? AND product_id = ?
    `,
      [idUser, productId]
    );

    if (existingProduct.length > 0) {
      return res.status(400).send({
        status: "Error",
        message: "El producto ya está su carrito.",
      });
    }

    const [result] = await connect.query(
      `
            INSERT INTO cart (user_id, product_id)
            VALUES (?, ?)
        `,
      [idUser, productId]
    );
    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Producto añadido a tu carrito",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addProductToUserCart;
