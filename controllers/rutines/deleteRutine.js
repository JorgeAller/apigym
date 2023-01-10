const deleteRutineQuery = require("../../bbdd/queries/rutines/deleteRutineQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const { generateError } = require("../../helpers");

const deleteRutine = async (req, res, next) => {
  try {
    const { idRutine } = req.params;

    let user = await selectUserByIdQuery(req.user.id);
    let role = user.role;

    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);

    if (role === "admin") {
      user.id = rutine.idUser;
    }

    if (user.id !== rutine.idUser) {
      throw generateError(
        "No eres el creador de esta rutina. No tienes suficientes permisos",
        401
      );
    }

    await deleteRutineQuery(idRutine);

    res.send({
      status: "ok",
      message: "Rutina eliminada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteRutine;
