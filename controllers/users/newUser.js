const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const { generateError } = require("../../helpers");

const newUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      throw generateError("Faltan campos", 400);
    }

    // Si no mandamos en el body el role, por defecto será normal. Para facilitar crear usuarios que no sean ni coachs ni admins
    if (!role) {
      role = "normal";
    }

    // Insertamos el usuario en la base de datos.
    await insertUserQuery(username, email, password, role);

    res.send({
      status: "ok",
      message: "Usuario creado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
