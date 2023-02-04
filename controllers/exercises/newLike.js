const insertLikeQuery = require("../../bbdd/queries/exercises/insertLikeQuery");

const newLike = async (req, res, next) => {
  try {
    const { idExercise } = req.params;

    // Insertamos el like.
    const msg = await insertLikeQuery(req.user.id, idExercise);
    console.log(msg);

    if (msg === "eliminado") {
      res.send({
        status: "ok",
        message: `Like eliminado`,
      });
    } else {
      res.send({
        status: "ok",
        message: `Like agregado`,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
