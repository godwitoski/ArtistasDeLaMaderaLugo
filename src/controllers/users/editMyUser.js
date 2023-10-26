const getDB = require("../../database/db");

const editMyUser = async (req, res, next) => {
  try {
    const idUser = req.userInfo.id;
    const { email, name, username, pwd, pwdNew, address, phone } = req.body;

    const connect = await getDB();
    const [user] = await connect.query(
      `
      SELECT id, email, username, name, phone, address 
      FROM users WHERE id=?
      `,
      [idUser]
    );

    const [oldPwd] = await connect.query(
      `
      SELECT id FROM users 
      WHERE id=? AND password=SHA2(?,512)
      `,
      [idUser, pwd]
    );
    if (oldPwd.length === 0) {
      connect.release();
      return res.status(401).send({
        status: 401,
        message: "No coincide la contraseña con la actual",
      });
    }

    if (email && email !== user[0].email) {
      const [existingEmail] = await connect.query(
        `
        SELECT id
        FROM users
        WHERE email=?
        `,
        [email]
      );
      if (existingEmail.length > 0) {
        connect.release();
        return res.status(409).send({
          status: "ERROR",
          message:
            "Ya existe un usuario registrado con ese email. Usa otro email",
        });
      }

      await connect.query(
        `
        UPDATE users
        SET email = ?, name=?
        WHERE id = ?
        `,
        [email, name, idUser]
      );
    }

    if (username && username !== user[0].username) {
      const [existingusername] = await connect.query(
        `
        SELECT id
        FROM users
        WHERE username=?
        `,
        [username]
      );
      if (existingusername.length > 0) {
        connect.release();
        return res.status(409).send({
          status: "ERROR",
          message:
            "Ya existe un usuario registrado con ese nombre de usuario. Usa otro.",
        });
      }
      await connect.query(
        `
        UPDATE users
        SET username = ? ,email = ?, name=?
        WHERE id = ?
        `,
        [username, email, name, idUser]
      );
    }

    if (email && email === user[0].email) {
      await connect.query(
        `
        UPDATE users
        SET name=? , username=?
        WHERE id = ?
        `,
        [name, username, idUser]
      );
    }

    if (phone && phone !== user[0].phone) {
      await connect.query(
        `
        UPDATE users
        SET phone = ? 
        WHERE id = ?
        `,
        [phone, idUser]
      );
    }

    if (address && address !== user[0].address) {
      await connect.query(
        `
        UPDATE users
        SET phone = ? 
        WHERE id = ?
        `,
        [phone, idUser]
      );
    }

    if (
      email &&
      email === user[0].email &&
      username &&
      username === user[0].username
    ) {
      await connect.query(
        `
        UPDATE users
        SET name=?
        WHERE id = ?
        `,
        [name, idUser]
      );
    }

    if (pwdNew) {
      await connect.query(
        `
        UPDATE users 
        SET password = SHA2(?,512), lastAuthUpdate=?
        WHERE id=?
        `,
        [pwdNew, new Date(), idUser]
      );
    }

    connect.release();

    return res.status(200).send({
      status: "OK",
      message: "Usuario modificado correctamente",
      newUser: {
        name,
        email,
        username,
        phone,
        address,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editMyUser;
