const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const selectUserByUsernameQuery = require("../../bbdd/queries/users/selectUserByUsernameQuery");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateError } = require("../../helpers");

const loginUser = async (req, res, next) => {
  try {
    const { user, password } = req.body;

    let foundUser;

    if (!user || !password) {
      throw generateError("Faltan campos", 400);
    }

    if (user.email) {
      foundUser = await selectUserByEmailQuery(user.email);
    } else {
      foundUser = await selectUserByUsernameQuery(user.username);
    }

    // Comprobamos si la contraseña es válida.
    const validPassword = await bcrypt.compare(password, foundUser.password);

    if (!validPassword) {
      throw generateError("Constraseña incorrecta", 401);
    }

    // Objeto con los datos que queremos guardar en el token.
    // Añadimos el username en el token, para poder comprobar a la hora de hacer busquedas por username
    const tokenInfo = {
      id: foundUser.id,

      username: foundUser.username,
    };

    // Creamos el token.
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
