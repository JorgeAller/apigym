const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");

// Obtenemos las variables de entorno necesarias.
const { UPLOADS_DIR } = process.env;

/**
 * ##################
 * ## Muscle Group ##
 * ##################
 */

/* const getMuscleGroup = (muscleGroup) => {
  const muscleGroupsString = process.env.MUSCLE_GROUPS;
  const muscleGroups = JSON.parse(muscleGroupsString);
  const hola = muscleGroup;
  return muscleGroups.hola;
}; */

/**
 * ####################
 * ## Generate Error ##
 * ####################
 */

const generateError = (msg, status) => {
  const err = new Error(msg);
  err.statusCode = status;
  return err;
};

/**
 * ################
 * ## Save Photo ##
 * ################
 */

const savePhoto = async (img, imgType = 0) => {
  // Ruta absoluta al directorio de subida de archivos.
  const uploadsPath = path.join(__dirname, UPLOADS_DIR);

  try {
    // Intentamos acceder al directorio uploads.
    await fs.access(uploadsPath);
  } catch {
    // Si no es posible acceder al directorio "access" lanzará un error.
    // Por tanto, si entramos en el catch creamos el directorio.
    await fs.mkdir(uploadsPath);
  }

  // Para poder redimensionar la imagen necesitamos crear un objeto Sharp a
  // partir de la imagen dada.
  const sharpImg = sharp(img.data);

  // Si se trata de un avatar lo redimensionaremos a 150px, de lo contrario,
  // redimensionaremos a 500px.
  if (!imgType) {
    // Redimensionamos a 150px.
    sharpImg.resize(150);
  } else {
    // Redimensionamos a 500px.
    sharpImg.resize(500);
  }

  // Generamos un nombre aleatorio para la imagen.
  const imgName = `${uuid()}.jpg`;

  // Ruta absoluta a la imagen.
  const imgPath = path.join(uploadsPath, imgName);

  // Guardamos la imagen en la carpeta uploads.
  await sharpImg.toFile(imgPath);

  // Retornamos el nombre de la imagen.
  return imgName;
};

/**
 * ##################
 * ## Delete Photo ##
 * ##################
 */

const deletePhoto = async (imgName) => {
  try {
    // Creamos la ruta absoluta a la imagen.
    const photoPath = path.join(__dirname, UPLOADS_DIR, imgName);

    try {
      // Intentamos acceder a la imagen a través del método "access".
      await fs.access(photoPath);
    } catch {
      // Si no es posible acceder a la imagen el método access lanza un error.
      // En ese caso finalizamos la función.
      return;
    }

    // Si llegamos hasta aquí quiere decir que la imagen existe. La eliminamos.
    await fs.unlink(photoPath);
  } catch {
    throw generateError("Error al eliminar la imagen del servidor");
  }
};

/**
 * ################
 * ## Save File ##
 * ################
 */
const saveFile = async (file) => {
  // Ruta absoluta al directorio de subida de archivos.
  const uploadsPath = path.join(__dirname, UPLOADS_DIR);

  try {
    // Intentamos acceder al directorio uploads.
    await fs.access(uploadsPath);
  } catch {
    // Si no es posible acceder al directorio "access" lanzará un error.
    // Por tanto, si entramos en el catch creamos el directorio.
    await fs.mkdir(uploadsPath);
  }

  // Para poder redimensionar la imagen necesitamos crear un objeto Sharp a
  // partir de la imagen dada.
  const sharpMedia = sharp(file.data);

  let fileName;

  // Generamos un nombre aleatorio para el archivo.
  if (file.mimetype.startsWith("image/")) {
    fileName = `${uuid()}.jpg`;
    sharpMedia.resize(500);
  }

  if (file.mimetype.startsWith("video/")) {
    throw generateError(
      "Estamos trabajando en ello. Aún no puedes subir un vídeo para tu ejercicio",
      501
    );
    /* // Asume que el archivo de video se llama "video.mp4" y está en el directorio "videos"
    const inputVideo = file.name;

    // Si el archivo no es una imagen, no hacemos nada con él
    fileName = `${uuid()}.${file.mimetype.split("/").pop()}`;
    console.log("file", fileName);

    // Asume que quieres guardar el video redimensionado en el directorio "videos" con el nombre "video_resized.mp4"
    const outputVideo = path.join(__dirname, UPLOADS_DIR, fileName);

    // Ejecuta ffmpeg para redimensionar el video a un ancho de 640px
    exec(`ffmpeg -i ${inputVideo} -vf scale=500:-1 ${outputVideo}`, (error) => {
      if (error) {
        console.error(`Error al redimensionar el video: ${error}`);
      } else {
        console.log("Video redimensionado correctamente");
      }
    }); */
  }

  // Ruta absoluta al archivo.
  const filePath = path.join(uploadsPath, fileName);

  // Guardamos el archivo en la carpeta uploads.
  await sharpMedia.toFile(filePath);

  // Retornamos el nombre del archivo.
  return fileName;
};

// Funcion para que los admins
/* const isAdmin = async (idUser, idElement) => {
  if (idUser.role === "admin") {
    return (idUser.id = idElement.idUser);
  }
};
*/

module.exports = {
  generateError,
  savePhoto,
  deletePhoto,
  saveFile,
};
