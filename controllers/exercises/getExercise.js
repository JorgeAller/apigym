const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");

const getExercise = async (req, res, next) => {
  try {
    const { idExercise } = req.params;
    const exercise = await selectExerciseByIdQuery(req.user?.id, idExercise);

    res.send({
      status: "ok",
      data: {
        exercise,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getExercise;
