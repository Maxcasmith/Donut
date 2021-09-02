const { MySQLQuery } = require("../MySQLQuery.js");

exports.create_migrations_table = class create_migrations_table
{
    static async up()
    {
        await (new MySQLQuery(`CREATE TABLE migrations (
            migration_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            migration_name VARCHAR(100) NOT NULL UNIQUE
        )`)).execRawQueryString();
    }

    static async down()
    {
        await (new MySQLQuery("DROP TABLE migrations")).execRawQueryString();
    }
}