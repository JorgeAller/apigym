const deleteLikeQuery = require("../../bbdd/queries/rutines/deleteLikeQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const deleteLikeRutine = async (req, res, next) => {
  try {
    const { idRutine } = req.params;
    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);
    const user = await selectUserByIdQuery(req.user.id);

    if (user.role === "admin") {
      req.user.id = rutine.idUser;
    }

    // Borramos el like.
    await deleteLikeQuery(req.user.id, idRutine);
    res.send({
      status: "ok",
      message: "Like eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteLikeRutine;
