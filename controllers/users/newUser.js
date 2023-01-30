const insertUserQuery = require("../../bbdd/queries/users/insertUserQuery");

const { generateError } = require("../../helpers");

const newUser = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      throw generateError("Faltan campos", 400);
    }

    // Comprobar los datos que llegan desde fuera con el validator de JOI

    // Si no mandamos en el body el role, por defecto será normal. Para facilitar crear usuarios que no sean ni coachs ni admins
    if (!role) {
      role = "normal";
    }

    // Insertamos el usuario en la base de datos.
    await insertUserQuery(username, email, password, role);

    res.send({
      status: "ok",
      message: "Usuario creado",
      data: {
        User: {
          username,
          email,
          password,
          role,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newUser;
