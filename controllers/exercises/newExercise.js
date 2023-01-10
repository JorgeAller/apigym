const insertExerciseQuery = require("../../bbdd/queries/exercises/insertExerciseQuery");
const insertMediaQuery = require("../../bbdd/queries/exercises/insertMediaQuery");

const { generateError, saveFile, savePhoto } = require("../../helpers");

const newExercise = async (req, res, next) => {
  try {
    const { name, description, muscleGroup } = req.body;

    if (!name || !description || !muscleGroup) {
      throw generateError("Faltan campos", 400);
    }

    if (req.user.role === "normal") {
      throw generateError(
        "No tienes los permisos necesarios para subir un ejercicio. Debes ser un entrenador para añadir nuevos ejercicios",
        401
      );
    }
    // Insertamos la entrada y obtenemos el id que se le ha asignado
    // en la base de datos.
    const idExercise = await insertExerciseQuery(
      name,
      description,
      muscleGroup,
      req.user.id
    );

    let media;

    if (!req.files?.media) {
      throw generateError("Faltan campos", 400);
    } else {
      media = await saveFile(req.files.media);
    }

    await insertMediaQuery(media, idExercise);

    res.send({
      status: "ok",
      data: {
        Exercise: {
          id: idExercise,
          name,
          description,
          muscleGroup,
          media,
          idUser: req.user.id,
          username: req.user.username,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = newExercise;
