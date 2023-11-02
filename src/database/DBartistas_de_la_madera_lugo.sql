CREATE DATABASE IF NOT EXISTS artistas_de_la_madera_lugo;
USE artistas_de_la_madera_lugo;

DROP TABLE IF EXISTS temporaryorders;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS sales;

DROP TABLE IF EXISTS productPhotos;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(512) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL,
    name VARCHAR(512),
    username VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    phone varchar(40),
    role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
    lastAuthUpdate DATETIME
);

CREATE TABLE products (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(400),
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(400),
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    user_id INT UNSIGNED NOT NULL,
    sold BOOLEAN NOT NULL DEFAULT FALSE,
    ordered BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE productPhotos (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    photo VARCHAR(400) NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE cart (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    product_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE temporaryorders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    email VARCHAR(512) NOT NULL,
    name VARCHAR(512),
    address TEXT,
    phone varchar(40),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    product_id INT UNSIGNED NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


CREATE TABLE sales (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


INSERT INTO users (email, name, username, password, role) VALUES ('admin@mail.com','admin', 'admin', SHA2(123456,512), 'admin');
