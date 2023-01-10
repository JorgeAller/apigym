const getConnection = require("../../getConnection");

const { generateError } = require("../../../helpers");

const deleteOwnUserQuery = async (idUser, verifyName) => {
  let connection;

  try {
    connection = await getConnection();

    // Seleccionamos el usuario
    const [users] = await connection.query(
      `SELECT id, username, deleted FROM users WHERE id = ?`,
      [idUser]
    );

    if (users.length === 0) {
      throw generateError("Usuario no encontrado", 404);
    }

    // Comprobamos que el usuario elimine su usuario y no el de otro.
    // Hacemos que verifique su nombre de usuario, para compararlo con el de su token de login
    if (verifyName != users[0].username) {
      throw generateError(
        "Usuario de validación incorrecto. No tienes suficientes permisos",
        401
      );
    }

    /* // Comprobamos si la persona que está intentando eliminar el usuario, es ella misma
    // Si tienes el token de otro usuario puedes borrarlo. Pero no puedes obtener el token de otro usuario (o eso creemos)
    if (req.user.id !== idUser) {
      throw generateError("No tienes suficientes permisos", 401);
    } */

    if (users[0].deleted === 1) {
      throw generateError("El usuario ya ha sido eliminado", 404);
    }

    const deletedUsername = `deleted_user_${users[0].id}`;
    const deletedEmail = `deleted_email_${users[0].id}`;

    // Actualizamos el usuario poniendo el campo deleted a true y estableciendo el nuevo username
    await connection.query(
      `UPDATE users SET deleted = 1, password = "", email = ?, username = ?, deletedAt = ? WHERE id = ?`,
      [deletedEmail, deletedUsername, new Date(), idUser]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteOwnUserQuery;
