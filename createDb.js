const database = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite'
    },
    useNullAsDefault: true
});

database.schema.createTableIfNotExists('wikipediaPages', function(t) {
    t.string('url').primary();
    t.string('title');
    t.string('firstLink');
}).then(function () {
}).catch(function (err) {
});