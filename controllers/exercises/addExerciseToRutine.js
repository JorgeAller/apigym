const insertFavQuery = require("../../bbdd/queries/exercises/insertFavQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectAllRutinesQuery = require("../../bbdd/queries/rutines/selectAllRutinesQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const { generateError } = require("../../helpers");

const addExerciseToRutine = async (req, res, next) => {
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
    const rutines = await selectAllRutinesQuery(req.user.id);

    res.send({
      status: "ok",
      message: `El ejercicio '${exercise.name}' ha sido agregado a tu rutina '${rutine.name}' correctamente`,
      data: {
        id: exercise.id,

        favedByMe: exercise.favedByMe,
        exercisesOnRutine: rutine.exercisesOnRutine + 1,
        rutines,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = addExerciseToRutine;
