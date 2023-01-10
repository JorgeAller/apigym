const deleteOwnUserQuery = require("../../bbdd/queries/users/deleteOwnUserQuery");
const { generateError } = require("../../helpers");

const deleteOwnUser = async (req, res, next) => {
  try {
    let { verifyName } = req.body;

    if (!verifyName) {
      throw generateError("Faltan campos", 400);
    }

    // Eliminamos el usuario
    await deleteOwnUserQuery(req.user.id, verifyName);

    res.send({
      status: "ok",
      message: "Usuario eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteOwnUser;
