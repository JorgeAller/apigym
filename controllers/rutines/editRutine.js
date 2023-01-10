const selectRutineByIdQuery = require("../../bbdd/queries/rutines/selectRutineByIdQuery");
const updateRutineQuery = require("../../bbdd/queries/rutines/updateRutineQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const { generateError } = require("../../helpers");

const editRutine = async (req, res, next) => {
  try {
    const { name, description, duration } = req.body;
    const { idRutine } = req.params;

    let newName, newDescription, newDuration;

    const rutine = await selectRutineByIdQuery(req.user.id, idRutine);
    const user = await selectUserByIdQuery(req.user.id);

    // Comprobamos que el usuario es dueño del ejercicio que quiere actualizar
    if (rutine.idUser != user.id) {
      throw generateError("No tienes suficientes permisos", 401);
    }

    // Si no hay ningun cambio lanzamos un error que diga que no se cambio nada
    if (!name && !description && !duration) {
      throw generateError("No has realizado ningún cambio. Faltan campos", 400);
    }

    // Si no cambiamos ninguno de estos campos, los dejamos como estaban antes del cambio
    if (name || description || duration) {
      newName = name || rutine.name;
      newDescription = description || rutine.description;
      newDuration = duration || rutine.duration;
    }

    // Actualizamos el ejercicio
    await updateRutineQuery(newName, newDescription, newDuration, idRutine);

    res.send({
      status: "ok",
      message: "Rutina actualizada",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editRutine;
