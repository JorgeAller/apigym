const insertLikeQuery = require("../../bbdd/queries/rutines/insertLikeQuery");

const newLike = async (req, res, next) => {
  try {
    const { idRutine } = req.params;

    // Insertamos el like.
    await insertLikeQuery(req.user.id, idRutine);

    res.send({
      status: "ok",
      message: "Like agregado",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newLike;
