const PORT = process.env.PORT || 3001;
const USER = process.env.USER || "demo";
const PASSWORD = process.env.PASSWORD || "password";
const HOST = process.env.HOST || "localhost";
const DATABASE = process.env.DATABASE || "artistas_de_la_madera_lugo";
const PORT_DB = process.env.PORT_DB || "3306";
const SECRET_TOKEN = process.env.SECRET_TOKEN || "secret";
const UPLOADS_DIRECTORY = "../uploads";

module.exports = {
  PORT,
  USER,
  PASSWORD,
  HOST,
  DATABASE,
  PORT_DB,
  SECRET_TOKEN,
  UPLOADS_DIRECTORY,
};
