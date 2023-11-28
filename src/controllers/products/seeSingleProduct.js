const getDB = require("../../database/db");

const seeSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const connect = await getDB();

    // Realiza la primera consulta para obtener los datos de productos
    const [products] = await connect.query(
      `
        SELECT p.id as productId, p.name, p.description, p.price, p.type, p.date, p.sold,  p.ordered
        FROM products p
        WHERE p.id = ?
    `,
      [productId]
    );

    connect.release();

    if (products.length === 0) {
      return res.status(404).send({
        status: "Error",
        message: "El producto no ha sido encontrado",
      });
    }
    connect.release();

    // Realiza la segunda consulta para obtener las fotos de productos
    const productsCombine = await Promise.all(
      products.map(async (product) => {
        const [photosProduct] = await connect.query(
          `
        SELECT id, photo
        FROM productPhotos 
        WHERE product_id = ?`,
          [product.productId]
        );
        product["photos"] = photosProduct;

        if (!product["photos"].length) {
          product["photos"] = [];
        }

        return product; // Devuelve el producto con las fotos agregadas
      })
    );

    res.status(200).send({
      status: "OK",
      products: productsCombine,
    });

    connect.release();
  } catch (error) {
    next(error);
  }
};

module.exports = seeSingleProduct;
