# TÍTULO

Aplicación para organizar internamente los entrenamientos en un gimnasio.

# DESCRIPCIÓN

Implementar una API que permita publicar ejercicios para la gestión de los mismos en un
gimnasio. Los usuarios serán los trabajadores del gimnasio.

# INSTALAR

- Crear una base de datos vacía en una instancia de MySQL local.

- Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

- Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

- Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

# TIPOS DE USUARIO

## USUARIOS ANÓNIMOS

Pueden ver la landing de la plataforma donde podrán registrarse o hacer login.

## ADMINISTRADOR

- Tiene el poder total de la Aplicación.
- Puede crear/modificar/eliminar ejercicios y rutinas, para controlar las que son subidas por los coachs.

## COACH

- Tendrá la posibilidad de crear/modificar/eliminar un nuevo ejercicio:

  - nombre
  - descripción
  - foto
  - Vídeo
  - grupo muscular

- Puede crear/modificar/eliminar rutinas de entreno para los usuarios, que contendrán diferentes ejercicios (Propios u ajenos de otros coachs)
  - nombre
  - descripción
  - Duración
  - Ejercicios

## USUARIO (NORMAL)

- Puede ver el listado de los ejercicios y entrar en el detalle de los mismos.
- Podrá filtrarlos por algunas características (ej: nombre, grupo muscular).
- Podrá poner o quitar un like a un ejercicio.
- Podrá añadir un ejercicio a una nueva rutina creada por el mismo.
- Podrá añadir a favoritos cada rutina.

# BASE DE DATOS

- **`users:`** id, , username`*`, email`*`, password`*`, avatar, role ("admin" "coach" "normal"), createdAt, modifiedAt.

- **`exercises:`** id, name`*`, description`*`, photo`*`, muscleGroup`*`, idUser, createdAt modifiedAt.

- **`likesExercises:`** id, idUser, idExercise, createdAt.

- **`exerciseMedia:`** id, name`*`, idExercise, createdAt, modifiedAt.

- **`rutines:`** id, name`*`, duration`*`, description`*`, idUser, idExercise, createdAt modifiedAt.

- **`favsRutines:`** id, idUser, idRutine, createdAt.

# ENDPOINTS DE LA APLICACIÓN

A continuación se detallan los diferentes endpoints de la aplicación y su funcionalidad:

- ## **Usuarios**

  - **POST** - `/users`: crear un nuevo usuario. ✅
  - **POST** - `/users/login`: iniciar sesión con un usuario existente. (Retorna un token) ✅
  - **GET** - `/users`: obtener los datos del usuario del token. (Token)
  - **PUT** - `/users`: modificar el avatar o el email de un usuario. (Token)
  - **DELETE** - `/users` Elimina (anonimiza) a un usuario

  (Endpoitns por hacer)
  [Endpoint para obtener los datos de un usuario por su id]

- ## **Ejercicios**

  - **POST** - `/exercises`: crear un nuevo ejercicio. (Token)
  - **GET** - `/exercises`: obtener la lista de todos los ejercicios. (Token Opcional)
  - **GET** - `/exercises/:idExercise`: obtener los datos de un ejercicio por su ID. (Token opcional)
  - **PUT** - `/exercises/:idExercise`: modificar los datos de un ejercicio por su ID. (Token)
  - **DELETE** - `/exercises/:idExercise`: eliminar un ejercicio por su ID. El coach que lo creó o un admin (Token)
  - **GET** - `/exercises/filter`: filtrar ejercicios por nombre, descripción , grupo muscular.

- ## **Rutinas**

  - **POST** - `/routines`: crear una nueva rutina. (Token)
  - **GET** - `/routines`: obtener la lista de todas las rutinas. (Token Opcional)
  - **GET** - `/routines/:idRutine`: obtener los datos de una rutina por su ID. (Token Opcional)
  - **PUT** - `/routines/:idRutine`: modificar los datos de una rutina por su ID. (Token)
  - **DELETE** - `/routines/:idRutine`: eliminar una rutina por su ID. El coach y el usuario, podrán borrar solo sus rutinas. El admin cualquiera. (Token)

- ## **Likes**

  - **POST** - `/likes/:idExercise`: dar like a un ejercicio. (Token)
  - **DELETE** - `/likes/:idExercise`: eliminar un like a un ejercicio. (Token)

- # **Favoritos**
  - **POST** - `/favorites/:idRutine`: añadir una rutina a favoritos.
  - **DELETE** - `/favorites/:idRutine`: eliminar una rutina de favoritos.
