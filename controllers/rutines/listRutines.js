const selectAllRutinesQuery = require("../../bbdd/queries/rutines/selectAllRutinesQuery");

const listRutines = async (req, res, next) => {
  try {
    const { keywordDesc, name, duration } = req.query;

    const rutines = await selectAllRutinesQuery(
      req.user?.id,
      name,
      keywordDesc,
      duration
    );
    if (keywordDesc || name || duration) {
      if (rutines.length < 1) {
        res.send({
          status: "ok",
          message: `No se han encontrado coincidencias. Hay un total de ${
            rutines.length
          } ${
            rutines.length === 1 ? "rutina" : "rutinas"
          } con tus parámetros de búsqueda`,
        });
      }
      res.send({
        status: "ok",
        message: `Aquí está tu búsqueda. Hay un total de ${rutines.length} ${
          rutines.length === 1 ? "rutina" : "rutinas"
        } con tus parámetros de búsqueda`,
        data: {
          rutines,
        },
      });
    }

    res.send({
      status: "ok",
      message: `Aquí tienes todas las rutinas. Hay un total de ${
        rutines.length
      } ${rutines.length === 1 ? "rutina" : "rutinas"}`,
      data: {
        rutines,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = listRutines;
