const deleteFavQuery = require("../../bbdd/queries/exercises/deleteFavQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectFavByIdQuery = require("../../bbdd/queries/exercises/selectFavByIdQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const { generateError } = require("../../helpers");

const deleteFav = async (req, res, next) => {
  try {
    const { idRutine, idExercise, idFav } = req.params;

    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);
    const exercise = await selectExerciseByIdQuery(req.user.id, idExercise);

    if (rutine.idUser != req.user.id) {
      throw generateError(
        "No eres el propietario de esta rutina. No puedes eliminar ejercicios.",
        403
      );
    }

    const fav = await selectFavByIdQuery(idFav);

    // Borramos el like.
    await deleteFavQuery(req.user.id, idRutine, idExercise, idFav);
    res.send({
      status: "ok",
      message: "Ejercicio eliminado de tu rutina",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteFav;
