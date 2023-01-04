const getConnection = require('../../getConnection');

const { generateError } = require('../../../helpers');

const selectEntryByIdQuery = async (idEntry) => {
    let connection;

    try {
        connection = await getConnection();

        const [entries] = await connection.query(
            `
                SELECT E.id, E.title, E.place, E.description, E.idUser, AVG(IFNULL(V.value, 0)) AS votes, E.createdAt
                FROM entries E
                LEFT JOIN entryVotes V ON E.id = V.idEntry
                WHERE E.id = ?
                GROUP BY E.id
            `,
            [idEntry]
        );

        const [photos] = await connection.query(
            `SELECT id, name FROM entryPhotos WHERE idEntry = ?`,
            [idEntry]
        );

        if (entries.length < 1) {
            throw generateError('No se ha encontrado ninguna entrada', 404);
        }

        return {
            ...entries[0],
            photos,
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectEntryByIdQuery;
