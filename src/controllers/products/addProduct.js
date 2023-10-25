const getDB = require("../../database/db");
const savePhoto = require("../../service/savePhoto");
const fs = require("fs/promises");
const path = require("path");

const addProduct = async (req, res, next) => {
  try {
    const connect = await getDB();
    const { name, description, price, type } = req.body;
    const idUser = req.userInfo.id;

    if (!name || !description || !price || !type) {
      return res.status(400).send({
        status: "Error",
        message: "Todos los campos son obligatorios",
      });
    }

    //hacemos un post a una entrada
    const [result] = await connect.query(
      `
      INSERT INTO products (name, description, user_id, price, type)
      VALUES (?, ?, ?, ?, ?)
    `,
      [name, description, idUser, price, type]
    );

    const { insertId } = result;

    const photos = req.files.photos;

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).send({
        status: "Error",
        message: "Debes seleccionar al menos una foto.",
      });
    }

    const photoFolder = path.resolve(__dirname, "../../uploads/photos");

    const createFolderUser = async () => {
      try {
        await fs.access(`${photoFolder}/${name}`);
      } catch (error) {
        await fs.mkdir(`${photoFolder}/${name}`);
      }
    };

    for (const photo of photos) {
      createFolderUser();
      const savedPhoto = await savePhoto(photo, `/photos/${name}`);
      await connect.query(
        `
    INSERT INTO productPhotos (photo, product_id)
    VALUES (?, ?)
    `,
        [savedPhoto, insertId]
      );
    }

    connect.release();
    return res.status(200).send({
      status: "OK",
      message: "Las imágenes se cargaron correctamente.",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = addProduct;
