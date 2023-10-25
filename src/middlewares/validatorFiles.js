const hapiJoi = require("@hapi/joi");

const validatorFiles = (req, res, next) => {
  try {
    if (req.files) {
      if (Array.isArray(req.files.photos)) {
        for (const photo of req.files.photos) {
          if (
            !isValidImageType(photo.mimetype) ||
            !isValidImageName(photo.name)
          ) {
            return res.status(403).send({
              status: "Error",
              message:
                "Formato de imagen no soportado o nombre de archivo inválido. Introduce imágenes JPG, JPEG o PNG y asegúrate de que el nombre no supere los 120 caracteres.",
            });
          }
        }
      } else if (
        !isValidImageType(req.files.photos.mimetype) ||
        !isValidImageName(req.files.photos.name)
      ) {
        return res.status(403).send({
          status: "Error",
          message:
            "Formato de imagen no soportado o nombre de archivo inválido. Introduce imágenes JPG, JPEG o PNG y asegúrate de que el nombre no supere los 120 caracteres.",
        });
      }
    } else {
      return res
        .status(409)
        .send({ status: 409, message: "Faltan los archivos" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isValidImageType = (mimetype) => {
  return (
    mimetype === "image/jpeg" ||
    mimetype === "image/jpg" ||
    mimetype === "image/png"
  );
};

const isValidImageName = (name) => {
  const schema = hapiJoi
    .string()
    .max(120)
    .message("El nombre del archivo no puede superar los 120 caracteres")
    .required();
  const validation = schema.validate(name);

  return !validation.error;
};

module.exports = validatorFiles;
