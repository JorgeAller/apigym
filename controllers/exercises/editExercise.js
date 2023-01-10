const selectExerciseByIdQuery = require("../../bbdd/queries/exercises/selectExerciseByIdQuery");
const updateExerciseQuery = require("../../bbdd/queries/exercises/updateExerciseQuery");
const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");

const { generateError, savePhoto, deletePhoto } = require("../../helpers");

const editExercise = async (req, res, next) => {
  try {
    let { name, description, muscleGroup } = req.body;
    const { idExercise } = req.params;

    let newName, newDescription, newMuscleGroup, newMedia;

    const exercise = await selectExerciseByIdQuery(req.user?.id, idExercise);
    const user = await selectUserByIdQuery(req.user.id);

    // ### WIP ###
    // Buscar otra manera para que admin pueda hacer de todo. Con un middleware, con un helper.js...
    if (user.role === "admin") {
      exercise.idUser = user.id;
    }

    // Comprobamos que el usuario es dueño del ejercicio que quiere actualizar y si es un coach o no
    if (exercise.idUser != user.id || user.role === "normal") {
      throw generateError("No tienes suficientes permisos", 401);
    }

    // Si no hay ningun cambio lanzamos un error que diga que no se cambio nada
    if (!name && !description && !muscleGroup && !req.files?.media) {
      throw generateError("No has realizado ningún cambio. Faltan campos", 400);
    }

    // ### WIP ###
    // Si ya existe contenido media, lo borramos (fotos de momento. Implementaremos vídeos y otros archivos)
    if (req.files?.media) {
      if (exercise.media.length) {
        await deletePhoto(exercise.media[0].nameMedia);
      }

      // Guardamos el nuevo contenido
      newMedia = await savePhoto(req.files.media);
    } else {
      // Si no se actualiza el media, dejamos el que estaba anteriormente, ya que este campo no puede estar vacío (NOT NULL)
      newMedia = exercise.media[0].nameMedia;
    }

    // Si no cambiamos ninguno de estos campos, los dejamos como estaban antes del cambio
    if (name || description || muscleGroup || req.files?.media) {
      newName = name || exercise.name;
      newDescription = description || exercise.description;
      newMuscleGroup = muscleGroup || exercise.muscleGroup;
    }

    // Actualizamos el ejercicio
    await updateExerciseQuery(
      newName,
      newDescription,
      newMuscleGroup,
      newMedia,
      idExercise
    );

    res.send({
      status: "ok",
      message: "Ejercicio actualizado",
      data: {
        Exercise: {
          id: idExercise,
          name: `'${exercise.name}' pasa a '${newName}'`,
          description: `'${exercise.description}' pasa a '${newDescription}'`,
          muscleGroup: `'${exercise.muscleGroup}' pasa a '${newMuscleGroup}'`,
          media: `'${exercise.media[0].nameMedia}' pasa a '${newMedia}'`,
          username: req.user.username,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editExercise;
