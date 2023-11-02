const getDB = require("../../database/db");

const getSalesInfo = async (req, res, next) => {
  try {
    const connect = await getDB();

    // Obtener el año y mes de los parámetros de consulta (si se proporcionan)
    const { year, month } = req.query;

    // Consulta para obtener ventas con filtro opcional por año y mes
    let query = `
      SELECT s.user_id, s.product_id, p.name as productName, p.price, s.date as soldDate, u.name
      FROM sales s
      JOIN users u ON s.user_id = u.id
      JOIN products p ON s.product_id = p.id
      `;

    // Agregar filtro por año y mes si se proporcionan
    const params = [];

    if (year) {
      query += "WHERE YEAR(s.date) = ? ";
      params.push(year);

      if (month) {
        query += "AND MONTH(s.date) = ? ";
        params.push(month);
      }
    } else if (month) {
      query += "WHERE MONTH(s.date) = ? ";
      params.push(month);
    }

    query += "ORDER BY s.date DESC";

    // Ejecutar la consulta con los parámetros proporcionados
    const [sales] = await connect.query(query, params);
    if (sales.length === 0) {
      return res.status(404).send({
        status: "Error",
        sales: "No se encontraron ventas para estas fechas",
      });
    } else if (!params) {
      return res.status(404).send({
        status: "Error",
        sales: "Aún no hay ventas realizadas",
      });
    }

    connect.release();

    res.status(200).send({
      status: "OK",
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getSalesInfo;
