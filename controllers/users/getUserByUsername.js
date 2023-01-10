const selectUserByUsernameQuery = require("../../bbdd/queries/users/selectUserByUsernameQuery");

const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Obtener información de un usuario.
    const user = await selectUserByUsernameQuery(username);

    // Objeto con información básica del usuario.
    const userInfo = {
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    // Si soy el dueño de ese usuario agrego más información.
    if (username === req.user.username) {
      userInfo.email = user.email;
    }

    if (user.role != "admin") {
      userInfo.role = user.role;
    } else userInfo.role = `coach`;

    res.send({
      status: "ok",
      data: {
        user: userInfo,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getUserByUsername;
