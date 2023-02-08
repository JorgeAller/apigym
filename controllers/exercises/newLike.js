const insertLikeQuery = require("../../bbdd/queries/exercises/insertLikeQuery");
const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");

const newLike = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Insertamos el like.
    const msg = await insertLikeQuery(req.user.id, idExercise);

    const exercise = await selectExerciseByIdQuery(req.user.id, idExercise);

    if (msg === "eliminado") {
      res.send({
        status: "ok",
        message: `Like eliminado`,
        data: {
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
          id: exercise.id,
          likes: exercise.likes,
          likedByMe: exercise.likedByMe,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
