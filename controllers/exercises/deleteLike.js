// UTILIZAMOS QUERY DE DAR LIKE PARA ELIMINAR EL LIKE SI ES EXISTENTE

const deleteLikeQuery = require("../../bbdd/queries/exercises/deleteLikeQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const deleteLike = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Borramos el like.
    await deleteLikeQuery(req.user.id, idExercise);
    res.send({
      status: "ok",
      message: "Like eliminado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteLike;
