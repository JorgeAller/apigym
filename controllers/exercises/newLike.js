const insertLikeQuery = require("../../bbdd/queries/exercises/insertLikeQuery");
const selectAllExercisesQuery = require("../../bbdd/queries/exercises/selectAllExercisesQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const selectAllRutinesQuery = require("../../bbdd/queries/rutines/selectAllRutinesQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const newLike = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Insertamos el like.
    const msg = await insertLikeQuery(req.user.id, idExercise);

    const exercise = await selectExerciseByIdQuery(req.user.id, idExercise);

    const exercises = await selectAllExercisesQuery(req.user.id);

    const rutines = await selectAllRutinesQuery(req.user.id);

    if (msg === "eliminado") {
      res.send({
        status: "ok",
        message: `Like eliminado`,
        data: {
          rutines,
          exercises,
          exercise,
          id: exercise.id,
          likes: exercise.likes,
          likedByMe: exercise.likedByMe,
        },
      });
    } else {
      res.send({
        status: "ok",
        message: `Like agregado`,
        data: {
          rutines,
          exercises,
          exercise,
          id: exercise.id,
          likes: exercise.likes,
          likedByMe: exercise.likedByMe,
        },
      });
      console.log(exercise.likes);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
