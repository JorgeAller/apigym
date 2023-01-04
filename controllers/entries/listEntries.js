const selectAllEntriesQuery = require('../../bbdd/queries/entries/selectAllEntriesQuery');

const listEntries = async (req, res, next) => {
    try {
        const entries = await selectAllEntriesQuery();

        res.send({
            status: 'ok',
            data: {
                entries,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listEntries;
