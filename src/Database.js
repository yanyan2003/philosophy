const database = require('knex')({
    client: 'sqlite3',
    debug: true,
    connection: {
        filename: '../db.sqlite'
    },
    useNullAsDefault: true
});

const insertPage = function (page) {
    database('wikipediaPages').insert(page);
    return page;

};

export {
    insertPage
}