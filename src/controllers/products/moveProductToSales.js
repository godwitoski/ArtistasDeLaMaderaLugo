const getDB = require("../../database/db");

const moveProductToSales = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { productId } = req.params;

    // Comprobar que no se ha vendido ya
    const [productInSales] = await connect.query(
      `
        SELECT id
        FROM sales
        WHERE product_id = ?
        `,
      [productId]
    );

    if (productInSales.length > 0) {
      await connect.query(
        `
      UPDATE products SET cancelled = TRUE 
      WHERE id = ?`,
        [productId]
      );

      return res.status(400).send({
        status: "Error",
        message: "Este producto ya ha sido vendido.",
      });
    }

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

    // Mover el producto a sales
    await connect.query(
      `INSERT INTO sales (user_id, product_id) 
      VALUES (?, ?)`,
      [productInTemporary[0].user_id, productInTemporary[0].id]
    );

    // Eliminar el producto de temporaryorders
    await connect.query(
      `
      DELETE FROM temporaryorders 
      WHERE id = ?`,
      [productInTemporary[0].id]
    );

    // Actualizar el campo "sold" en la tabla "products"
    await connect.query(
      `
      UPDATE products 
      SET sold = TRUE 
      WHERE id = ?`,
      [productId]
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      message: "Producto vendido con exito.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = moveProductToSales;
