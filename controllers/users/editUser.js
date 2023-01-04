const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const updateUserQuery = require("../../bbdd/queries/users/updateUserQuery");

const { generateError, savePhoto, deletePhoto } = require("../../helpers");

const editUser = async (req, res, next) => {
  try {
    let { email } = req.body;

    // Si no existe ni email ni avatar lanzamos un error
    if (!email && !req.files?.avatar) {
      throw generateError("Faltan campos", 400);
    }

    // Obtenemos los datos del usuario que queremos editar para comprobar
    // si ya tiene un avatar previo.
    const user = await selectUserByIdQuery(req.user.id);

    let avatar;

    if (req.files?.avatar) {
      if (user.avatar) {
        await deletePhoto(user.avatar);
      }

      avatar = await savePhoto(req.files.avatar);
    }

    email = email || user.email;
    avatar = avatar || user.avatar;

    // Actualizamos el avatar del usuario en la base de datos.
    await updateUserQuery(email, avatar, req.user.id);

    res.send({
      status: "ok",
      message:
        "Usuario actualizado. Se ha cambiado el avatar o el mail con éxito",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editUser;
