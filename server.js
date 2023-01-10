require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");

const { PORT, UPLOADS_DIR } = process.env;

// Creamos un servidor express.
const app = express();

// Middleware que permite conectar el backend con el frontend
app.use(cors());

// Middleware que indica cuál es el directorio de ficheros estáticos.
app.use(express.static(UPLOADS_DIR));

// Middleware que deserializa un body en formato "raw" creando la propiedad
// "body" en el objeto "request".
app.use(express.json());

// Middleware que deserializa un body en formato "form-data" creando la propiedad
// "files" en el objeto "request".
app.use(fileUpload());

// Middleware que muestra información acerca de la petición.
app.use(morgan("dev"));

/**
 * ###############################
 * ## Controladores intermedios ##
 * ###############################
 */

const isAuth = require("./middlewares/isAuth");
const isAuthOptional = require("./middlewares/isAuthOptional");
const exerciseExists = require("./middlewares/exerciseExists");
const rutineExists = require("./middlewares/rutineExists");

/**
 * ##########################
 * ## Middlewares usuarios ##
 * ##########################
 */

const {
  newUser,
  loginUser,
  getUserById,
  getUserByUsername,
  editUser,
  deleteOwnUser,
} = require("./controllers/users");

// Registrar un nuevo usuario
app.post("/users", newUser);

// Login de usuario.
app.post("/users/login", loginUser);

// Obtener info de un usuario por su id.
app.get("/users/id/:idUser", isAuth, getUserById);

// Obtener info de un usuario por su username.
app.post("/users/name/:username", isAuth, getUserByUsername);

// Editar el role, el email o el avatar de usuario.
app.patch("/users", isAuth, editUser);

// Elimina tu propio usuario.
app.delete("/users", isAuth, deleteOwnUser);

// Elimina un usuario por su username (solo usuarios admin)
// app.delete("/users/delete/:username", deleteUser)
// Implementar esta función mas adelante.

/**
 * ###########################
 * ## Middlewares exercises ##
 * ###########################
 */

const {
  newExercise,
  listExercises,
  getExercise,
  newLike,
  deleteLike,
  editExercise,
  deleteExercise,
  addExerciseToRutine,
  deleteExerciseFromRutine,
} = require("./controllers/exercises");

// Crear un nuevo ejercicio.
app.post("/exercises", isAuth, newExercise);

// Listar ejercicios.
app.get("/exercises", isAuthOptional, listExercises);

// Obtener un ejercicio por su ID
app.get("/exercises/:idExercise", isAuthOptional, getExercise);

// Editar los datos de un ejercicio existente. Name, media, description y muscleGroup
app.patch("/exercises/:idExercise", isAuth, exerciseExists, editExercise);

// Eliminar un ejercicio por su id. Solo pueden borrar admins y coachs, ya que los usuarios "normal" no tienen permiso ni para crear los ejercicios
app.delete("/exercises/:idExercise", isAuth, exerciseExists, deleteExercise);

// Darle like a un ejercicio existente
app.post("/exercises/:idExercise/likes", isAuth, exerciseExists, newLike);

// Eliminar un like existente de un ejercicio existente.
app.delete("/exercises/:idExercise/likes", isAuth, exerciseExists, deleteLike);

// Añadir un ejercicio a una rutina (darle fav)
app.post(
  "/exercises/:idExercise/rutines/:idRutine/favorites",
  isAuth,
  exerciseExists,
  rutineExists,
  addExerciseToRutine,
  deleteExerciseFromRutine
);

// Eliminar un ejercicio de una rutina (quitar el fav). Pasamos el id del Fav (:idFav) que queremos eliminar,
// ya que al poder estar las veces que sea, hay que seleccionar cual queremos borrar de la rutina
app.delete(
  "/exercises/:idExercise/rutines/:idRutine/favorites/:idFav",
  isAuth,
  exerciseExists,
  rutineExists,
  deleteExerciseFromRutine
);

/**
 * #########################
 * ## Middlewares rutines ##
 * #########################
 */

const {
  newRutine,
  getRutine,
  listRutines,
  newLikeRutine,
  deleteLikeRutine,
  editRutine,
  deleteRutine,
} = require("./controllers/rutines");

// Crear una nueva rutina
app.post("/rutines", isAuth, newRutine);

// Listar todas las rutinas
app.get("/rutines", isAuthOptional, listRutines);

// Obtener una rutina por su id
app.get("/rutines/:idRutine", isAuthOptional, getRutine);

// Editar los datos de una rutina existente. Name, description y duration.
app.patch("/rutines/:idRutine", isAuth, rutineExists, editRutine);

// Eliminar una rutina exsitente (y borrar todos los ejercicios y likes que esta tenga)
app.delete("/rutines/:idRutine", isAuth, rutineExists, deleteRutine);

// Dar like a una rutina existente
app.post("/rutines/:idRutine/likes", isAuth, rutineExists, newLikeRutine);

// Eliminar un like a una rutina existente
app.delete("/rutines/:idRutine/likes", isAuth, rutineExists, deleteLikeRutine);

/**
 * #####################################
 * ## Middleware de error / not found ##
 * #####################################
 */

// Middleware de error.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
});

// Middleware de ruta no encontrada.
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Ruta no encontrada",
  });
});

// Ponemos el servidor a escuchar peticiones en un puerto.
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
