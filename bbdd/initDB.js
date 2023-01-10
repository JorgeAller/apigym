require("dotenv").config();

const getConnection = require("./getConnection");

const bcrypt = require("bcrypt");

const main = async () => {
  let connection;

  try {
    connection = await getConnection();

    console.log("Borrando tablas...");

    await connection.query("DROP TABLE IF EXISTS likesRutines");
    await connection.query("DROP TABLE IF EXISTS favsRutines");
    await connection.query("DROP TABLE IF EXISTS rutines");
    await connection.query("DROP TABLE IF EXISTS exerciseMedia");
    await connection.query("DROP TABLE IF EXISTS likesExercises");
    await connection.query("DROP TABLE IF EXISTS exercises");
    await connection.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM ('admin','coach', 'normal') DEFAULT 'normal',
                createdAt TIMESTAMP NOT NULL,
                modified BOOLEAN DEFAULT 0,
                modifiedAt TIMESTAMP,
                deleted BOOLEAN DEFAULT 0,
                deletedAt TIMESTAMP
          )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS exercises (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                muscleGroup VARCHAR(255) NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt TIMESTAMP NOT NULL, 
                modifiedAt TIMESTAMP
          )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS likesExercises (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idExercise INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExercise) REFERENCES exercises(id),
                UNIQUE(idUser, idExercise),
                createdAt TIMESTAMP NOT NULL
          )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS exerciseMedia (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                nameMedia VARCHAR(100) NOT NULL,
                idExercise INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExercise) REFERENCES exercises(id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);
    await connection.query(`
            CREATE TABLE IF NOT EXISTS rutines (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                duration VARCHAR(100),
                description TEXT NOT NULL, 
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);
    await connection.query(`
            CREATE TABLE IF NOT EXISTS favsRutines (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idRutine INT UNSIGNED NOT NULL,
                FOREIGN KEY (idRutine) REFERENCES rutines(id),
                idExercise INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExercise) REFERENCES exercises(id),
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

    await connection.query(`
            CREATE TABLE IF NOT EXISTS likesRutines (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idRutine INT UNSIGNED NOT NULL,
                FOREIGN KEY (idRutine) REFERENCES rutines(id),
                UNIQUE(idUser, idRutine),
                createdAt TIMESTAMP NOT NULL
      )
    `);

    console.log("¡Tablas creadas!");

    // Encriptamos la contraseña contraseña del admin.
    const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    await connection.query(
      `
                INSERT INTO users (username, email, password, role, createdAt)
                VALUES ('admin', 'admin@admin.com', ?, 'admin', ?)
            `,
      [adminPass, new Date()]
    );

    console.log("¡Usuario administrador creado!");
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) connection.release();

    process.exit();
  }
};

main();
