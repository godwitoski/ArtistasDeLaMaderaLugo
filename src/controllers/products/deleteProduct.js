const getDB = require("../../database/db");
const fs = require("fs/promises");
const path = require("path");

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const connect = await getDB();

    // Comenzar una transacción para realizar cambios en varias tablas
    await connect.beginTransaction();

    // Comprobar si el producto existe antes de continuar
    const [productRows] = await connect.query(
      `SELECT * FROM products WHERE id = ?`,
      [productId]
    );

    if (productRows.length === 0) {
      // Si el producto no existe, finalizar la transacción y responder con un mensaje
      await connect.commit();
      connect.release();
      return res.status(200).send({
        status: "OK",
        message: "El producto no existe, no se realizó ninguna eliminación.",
      });
    }

    try {
      // Eliminar el producto de las tablas que tienen restricciones de clave foránea
      await connect.query(`DELETE FROM temporaryorders WHERE product_id = ?`, [
        productId,
      ]);
      await connect.query(`DELETE FROM cart WHERE product_id = ?`, [productId]);
      await connect.query(`DELETE FROM orders WHERE product_id = ?`, [
        productId,
      ]);
      await connect.query(`DELETE FROM sales WHERE product_id = ?`, [
        productId,
      ]);
      await connect.query(`DELETE FROM productPhotos WHERE product_id = ?`, [
        productId,
      ]);

      // Eliminar las fotos del servidor
      const [photoRows] = await connect.query(
        `SELECT pp.photo FROM productPhotos pp WHERE pp.product_id = ?`,
        [productId]
      );

      for (const photoRow of photoRows) {
        const photoPath = path.join(
          __dirname,
          "../../uploads/photos",
          productRows[0].name,
          photoRow.photo
        );

        // Comprobar si el archivo de imagen existe antes de eliminarlo
        try {
          await fs.access(photoPath);
          await fs.unlink(photoPath);
        } catch (error) {
          console.log(
            `La imagen ${photoRow.photo} no existe o no se pudo eliminar.`
          );
        }
      }

      // Eliminar la carpeta del servidor con el nombre del producto
      const productFolderPath = path.join(
        __dirname,
        "../../uploads/photos",
        productRows[0].name
      );

      try {
        await fs.rm(productFolderPath, { recursive: true });
      } catch (error) {
        console.log(`No se pudo eliminar la carpeta: ${productFolderPath}`);
      }

      // Finalizar la transacción y eliminar el producto de la tabla 'products'
      await connect.query(`DELETE FROM products WHERE id = ?`, [productId]);

      // Commit después de todas las eliminaciones exitosas
      await connect.commit();
      connect.release();

      return res.status(200).send({
        status: "OK",
        message: "Producto eliminado correctamente",
      });
    } catch (error) {
      // En caso de error, hacer un rollback para evitar cambios parciales
      await connect.rollback();
      connect.release();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deleteProduct;
