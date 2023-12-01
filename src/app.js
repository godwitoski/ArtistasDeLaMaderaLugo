const express = require("express");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const server = express();

const createStaticDir = require("../src/service/createStaticDir");

const userRouter = require("../src/router/userRouter");
const productsRouter = require("../src/router/productsRouter");
const seeProducts = require("../src/controllers/products/seeProducts");

server.use(cors({ origin: "*" }));

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(morgan("dev"));
server.use(fileupload());

// Configuración de archivos estáticos dinámicos
const staticDir = path.join(__dirname, "uploads");
server.use(express.static(staticDir));
createStaticDir(staticDir);

// Middleware para servir archivos estáticos desde carpetas dinámicas
server.use("/uploads/:folder/:name", (req, res, next) => {
  const { folder, name } = req.params;
  const userStaticDir = path.join(staticDir, folder, name);

  express.static(userStaticDir)(req, res, next);
});

// Rutas y middlewares
server.get("/", seeProducts);
server.use(userRouter);
server.use(productsRouter);

// Middleware de manejo de errores 404
server.use((req, res, next) => {
  res
    .status(404)
    .send({ status: "Error 404:", message: "Página no encontrada" });
});

// Middleware de manejo de errores generales
server.use(async (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  console.error(err);

  // Realiza el release de la conexión si está disponible
  if (req.db) {
    req.db.release();
  }

  res.status(status).send({ status, message });
});

module.exports = server;
