const mysql = require("mysql2/promise");

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_BBDD } = process.env;

let pool;

const getConnection = async () => {
  try {
    // Si no hay un grupo de conexiones lo creamos.
    if (!pool) {
      pool = await mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASS,
        database: MYSQL_BBDD,
        timezone: "Z",
      });
    }

    // Retornamos una conexión libre con la base de datos.
    return await pool.getConnection();
  } catch (err) {
    console.error(err);
    throw new Error("Error al obtener la conexión conectar con MySQL");
  }
};

module.exports = getConnection;
