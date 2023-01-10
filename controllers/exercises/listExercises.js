const selectAllExercisesQuery = require("../../bbdd/queries/exercises/selectAllExercisesQuery");

const listExercises = async (req, res, next) => {
  try {
    const { keywordDesc, name, muscleGroup } = req.query;

    const exercises = await selectAllExercisesQuery(
      req.user?.id,
      name,
      keywordDesc,
      muscleGroup
    );
    if (keywordDesc || name || muscleGroup) {
      res.send({
        status: "ok",
        message: `Aquí están tus búsquedas. Hay un total de ${
          exercises.length
        } ${
          exercises.length === 1 ? "ejercicio" : "ejercicios"
        } con tus parámetros de búsqueda`,
        data: {
          exercises,
        },
      });
    }
    res.send({
      status: "ok",
      message: `Aquí tienes todos los ejercicios. Hay un total de ${exercises.length}`,
      data: {
        exercises,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listExercises;
