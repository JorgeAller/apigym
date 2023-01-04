const getConnection = require('../../getConnection');

const { generateError } = require('../../../helpers');

const insertVoteQuery = async (value, idUser, idEntry) => {
    let connection;

    try {
        connection = await getConnection();

        // Comprobamos si ya se ha votado esta entrada.
        const [votes] = await connection.query(
            `SELECT id FROM entryVotes WHERE idUser = ? AND idEntry = ?`,
            [idUser, idEntry]
        );

        if (votes.length > 0) {
            throw generateError('Ya has votado esta entrada', 403);
        }

        // Insertamos el voto.
        await connection.query(
            `
                INSERT INTO entryVotes (value, idUser, idEntry, createdAt) 
                VALUES (?, ?, ?, ?)
            `,
            [value, idUser, idEntry, new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertVoteQuery;
