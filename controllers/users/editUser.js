const selectUserByIdQuery = require("../../bbdd/queries/users/selectUserByIdQuery");
const updateUserQuery = require("../../bbdd/queries/users/updateUserQuery");

const { generateError, savePhoto, deletePhoto } = require("../../helpers");

const editUser = async (req, res, next) => {
  try {
    let { email, role } = req.body;

    /* // Si no existe ni email ni avatar lanzamos un error
    if (!email && !req.files?.avatar) {
      throw generateError("Faltan campos", 400);
    } */

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
    if (!role && !email && !avatar) {
      throw generateError("No has realizado ningún cambio. Faltan campos", 400);
    }

    email = email || user.email;
    avatar = avatar || user.avatar;
    role = role || user.role;

    // Actualizamos el avatar del usuario en la base de datos.
    await updateUserQuery(email, avatar, role, req.user.id);
    if (email != user.email && avatar != user.avatar) {
      res.send({
        status: "ok",
        message:
          "Usuario actualizado. Se han cambiado el avatar y el mail con éxito",
      });
    } else if (email != user.email) {
      res.send({
        status: "ok",
        message: "Usuario actualizado. Se ha cambiado el mail con éxito",
      });
    } else if (avatar != user.avatar) {
      res.send({
        status: "ok",
        message: "Usuario actualizado. Se ha cambiado el avatar con éxito",
      });
    } else if (role != user.role) {
      res.send({
        status: "ok",
        message: "Usuario actualizado. Se ha cambiado el role con éxito",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = editUser;
