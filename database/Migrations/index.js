const { create_migrations_table } = require("./0000_create_migrations_table.js");

exports.migrations = [
    create_migrations_table,
];