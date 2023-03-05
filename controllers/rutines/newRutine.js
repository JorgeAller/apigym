const insertRutineQuery = require("../../bbdd/queries/rutines/insertRutineQuery");
const selectAllRutinesQuery = require("../../bbdd/queries/rutines/selectAllRutinesQuery");

const { generateError } = require("../../helpers");

const newRutine = async (req, res, next) => {
  try {
    let { name, description, duration } = req.body;

    if (!name || !description) {
      throw generateError("Faltan campos", 400);
    }

    if (!duration) duration = "";

    // Insertamos la rutina y obtenemos el id que se le ha asignado
    // en la base de datos.
    const idRutine = await insertRutineQuery(
      name,
      description,
      duration,
      req.user.id
    );
    const rutines = await selectAllRutinesQuery(req.user.id);

    res.send({
      status: "ok",
      data: {
        Rutine: {
          id: idRutine,
          name,
          description,
          duration,
          idUser: req.user.id,
          username: req.user.username,
          createdAt: new Date(),
        },
        rutines,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newRutine;
