const selectAllExercisesQuery = require("../../bbdd/queries/exercises/selectAllExercisesQuery");
const insertLikeQuery = require("../../bbdd/queries/rutines/insertLikeQuery");
const selectAllRutinesQuery = require("../../bbdd/queries/rutines/selectAllRutinesQuery");
const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const newLike = async (req, res, next) => {
  try {
    const { idRutine } = req.params;

    // Insertamos el like.
    const msg = await insertLikeQuery(req.user.id, idRutine);
    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);
    const rutines = await selectAllRutinesQuery(req.user.id);

    const exercises = await selectAllExercisesQuery(req.user.id);

    if (msg === "eliminado") {
      res.send({
        status: "ok",
        message: `Like eliminado`,
        data: {
          rutine,
          id: rutine.id,
          likes: rutine.likes,
          likedByMe: rutine.likedByMe,
          rutines,
          exercises,
        },
      });
    } else {
      res.send({
        status: "ok",
        message: `Like agregado`,
        data: {
          rutine,
          rutines,
          exercises,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
