const deleteExerciseQuery = require("../../bbdd/queries/exercises/deleteExerciseQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const selectAllExercisesQuery = require("../../bbdd/queries/exercises/selectAllExercisesQuery");

const { generateError } = require("../../helpers");

const deleteExercise = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    let user = await selectUserByIdQuery(req.user.id);
    let role = user.role;

    // Comprobamos si la persona que está intentando eliminar el ejercicio es un admin o un coach,
    // y si es la propietaria del ejercicio

    if (role === "normal") {
      throw generateError(
        "Rol incorrecto. No tienes suficientes permisos.",
        401
      );
    }

    const exercise = await selectExerciseByIdQuery(req.user.id, idExercise);

    if (role === "coach") {
      if (user.id !== exercise.idUser) {
        throw generateError(
          "No eres el creador de este Ejercicio. No tienes suficientes permisos",
          401
        );
      }
    }

    // Eliminamos el ejercicio
    await deleteExerciseQuery(req.user.id, idExercise);

    const name = "";
    const keywordDesc = "";
    const muscleGroup = "";
    const exercises = await selectAllExercisesQuery(
      req.user?.id,
      name,
      keywordDesc,
      muscleGroup
    );

    console.log(exercises);
    res.send({
      status: "ok",
      message: "Ejercicio eliminado",
      data: exercises,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteExercise;
