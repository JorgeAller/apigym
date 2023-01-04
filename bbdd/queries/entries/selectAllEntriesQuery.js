const getConnection = require('../../getConnection');

const { generateError } = require('../../../helpers');

const selectAllEntriesQuery = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [entries] = await connection.query(
            `
                SELECT E.id, E.title, E.place, E.description, E.idUser, AVG(IFNULL(V.value, 0)) AS votes, E.createdAt
                FROM entries E
                LEFT JOIN entryVotes V ON E.id = V.idEntry
                GROUP BY E.id
            `
        );

        if (entries.length < 1) {
            throw generateError('No se ha encontrado ninguna entrada', 404);
        }

        return entries;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllEntriesQuery;
