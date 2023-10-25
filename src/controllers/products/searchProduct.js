const getDB = require("../../database/db");

const searchProduct = async (req, res, next) => {
  const { name, type } = req.query;

  if (!name && !type) {
    return res.status(400).send({
      error: 'Falta al menos un parámetro de búsqueda: "name" o "type".',
    });
  }

  const searchQuery = `%${name || type}%`;

  try {
    const connect = await getDB();

    // Realiza la consulta para obtener los datos de productos con la condición OR
    const products = `
        SELECT p.id as productId, p.name, p.description, p.price, p.type, p.date, p.sold, p.ordered
        FROM products p
        WHERE p.name LIKE ? OR p.type LIKE ?;
    `;

    const [productData] = await connect.query(products, [
      searchQuery,
      searchQuery,
    ]);

    if (productData.length === 0) {
      return res.status(404).send({
        message:
          "No se encontraron productos que coincidan con los criterios de búsqueda.",
      });
    }

    // Realiza la segunda consulta para obtener las fotos de productos
    const productsCombine = await Promise.all(
      productData.map(async (product) => {
        const [photosProduct] = await connect.query(
          `
        SELECT product_id, photo
        FROM productPhotos 
        WHERE product_id = ?;
        `,
          [product.productId]
        );
        product["photos"] = photosProduct;

        if (!product["photos"].length) {
          product["photos"] = [];
        }

        return product; // Devuelve el producto con las fotos agregadas
      })
    );

    connect.release(); // Libera la conexión después de que se han resuelto todas las promesas

    res.status(200).send({
      status: "OK",
      products: productsCombine,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchProduct;
