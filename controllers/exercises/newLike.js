const insertLikeQuery = require("../../bbdd/queries/exercises/insertLikeQuery");

const newLike = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Insertamos el like.
    await insertLikeQuery(req.user.id, idExercise);

    res.send({
      status: "ok",
      message: "Like agregado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
