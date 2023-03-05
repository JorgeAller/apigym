const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");

const getRutine = async (req, res, next) => {
  try {
    const { idRutine } = req.params;

    const rutine = await selectRutineByIdQuery(req.user?.id, idRutine);
    console.log("pepitp", rutine);

    res.send({
      status: "ok",
      data: {
        rutine,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getRutine;
