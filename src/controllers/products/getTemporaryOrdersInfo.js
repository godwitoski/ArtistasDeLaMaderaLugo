const getDB = require("../../database/db");

const getTemporaryOrdersInfo = async (req, res, next) => {
  try {
    const connect = await getDB();

    // Ejecutar la consulta para obtener los pedidos temporales
    const [temporaryOrders] = await connect.query(`
      SELECT
        te.date,
        te.user_id,
        te.email,
        te.name as user,
        te.address,
        te.phone,
        P.id AS productId,
        P.name,
        P.type,
        P.description,
        P.price
      FROM temporaryorders AS te
      JOIN products AS P ON te.product_id = P.id
    `);

    if (temporaryOrders.length === 0) {
      return res.status(404).send({
        status: "Error",
        message: "No hay pedidos pendientes.",
      });
    }
    connect.release();

    // Ejecutar la consulta para obtener las fotos de los productos
    const temporaryOrdersWithPhotos = await Promise.all(
      temporaryOrders.map(async (order) => {
        const [photos] = await connect.query(
          `
          SELECT id, photo
          FROM productPhotos
          WHERE product_id = ?`,
          [order.productId]
        );
        order["photos"] = photos;
        return order; // Devuelve el pedido con las fotos de los productos
      })
    );

    connect.release();

    res.status(200).send({
      status: "OK",
      products: temporaryOrdersWithPhotos,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getTemporaryOrdersInfo;
