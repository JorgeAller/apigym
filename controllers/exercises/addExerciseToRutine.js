const insertFavQuery = require("../../bbdd/queries/exercises/insertFavQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const { generateError } = require("../../helpers");

const newFav = async (req, res, next) => {
  try {
    const { idExercise, idRutine } = req.params;
    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);

    if (rutine.idUser != req.user.id) {
      throw generateError(
        "No puedes añadir ejercicios a rutinas que no hayas creado. No tienes suficientes permisos",
        401
      );
    }
    // Insertamos el like.
    await insertFavQuery(req.user.id, idExercise, idRutine);

    const exercise = await selectExerciseByIdQuery(req.user.id, idExercise);

    res.send({
      status: "ok",
      message: `El ejercicio '${exercise.name}' ha sido agregado a tu rutina '${rutine.name}' correctamente`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newFav;
