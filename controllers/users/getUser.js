const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const getUser = async (req, res, next) => {
  try {
    const { idUser } = req.params;

    // Obtener información de un usuario.
    const user = await selectUserByIdQuery(idUser);

    // Objeto con información básica del usuario.
    const userInfo = {
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    };

    // Si soy el dueño de ese usuario agrego más información.
    if (Number(idUser) === req.user.id) {
      userInfo.email = user.email;
    }

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

module.exports = getUser;
