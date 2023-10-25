const getDB = require("../../database/db");

const orderProductsFromCart = async (req, res, next) => {
  try {
    const connect = await getDB();
    const idUser = req.userInfo.id;
    const { email, name, address, phone, productIds } = req.body;

    if (!name || !email || !address || !phone || !productIds) {
      return res.status(400).send({
        status: "Error",
        message:
          "Todos los campos son obligatorios y debes seleccionar al menos un producto.",
      });
    }

    // Insertar productos del carrito en temporaryorders
    for (const productId of productIds) {
      const [productInCart] = await connect.query(
        `
        SELECT id 
        FROM cart
        WHERE user_id = ? AND product_id = ?
      `,
        [idUser, productId]
      );

      if (productInCart.length === 0) {
        return res.status(400).send({
          status: "Error",
          message: "Uno o más productos no están en tu carrito.",
        });
      }

      const [productTemporary] = await connect.query(
        `
        SELECT product_id 
        FROM temporaryorders
        WHERE user_id = ? AND product_id = ?
      `,
        [idUser, productId]
      );

      if (productTemporary.length > 0) {
        return res.status(400).send({
          status: "Error",
          message:
            "Este producto ya ha sido enviado y está pendiente de revisión.",
        });
      }

      // Insertar en temporaryorders
      await connect.query(
        `
        INSERT INTO temporaryorders (product_id, name, email, user_id, address, phone)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [productId, name, email, idUser, address, phone]
      );
    }

    // Registrar los productos en la tabla "orders"
    for (const productId of productIds) {
      await connect.query(
        `
        INSERT INTO orders (product_id, user_id)
        VALUES (?, ?)
      `,
        [productId, idUser]
      );

      // Actualizar el campo "ordered" en la tabla "products"
      await connect.query(
        `
        UPDATE products
        SET ordered = TRUE
        WHERE id = ?
      `,
        [productId]
      );
    }

    connect.release();

    return res.status(200).send({
      status: "OK",
      message:
        "Pedido realizado con éxito. En breves nos podremos en contacto contigo",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = orderProductsFromCart;
