const getDB = require("../../database/db");

const seeMyUserCart = async (req, res) => {
  try {
    const idUser = req.userInfo.id;
    const connect = await getDB();

    // Verificar si el producto ya está en el carrito del usuario
    const [productsInCart] = await connect.query(
      `
        SELECT p.id as productId, p.name, p.price, p.description, p.type, c.date, p.sold
        FROM products p
        JOIN cart c ON p.id = c.product_id
        WHERE c.user_id = ?
        ORDER BY c.date DESC
    `,
      [idUser]
    );

    if (productsInCart.length === 0) {
      return res.status(200).send({
        status: "OK",
        message: "Tu carrito está vacío.",
      });
    }

    const productsCombine = await Promise.all(
      productsInCart.map(async (product) => {
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

    connect.release();

    res.status(200).send({
      status: "OK",
      products: productsCombine,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = seeMyUserCart;
