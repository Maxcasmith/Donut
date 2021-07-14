import { Query } from "../Query.js";

export class create_migrations_table
{
    constructor() {
        super('migrations');
    }

    static async up()
    {
        await (new Query(`CREATE TABLE migrations (
            migration_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            migration_name VARCHAR(100) NOT NULL UNIQUE
        )`)).execRawQueryString();
    }

    static async down()
    {
        await (new Query("DROP TABLE migrations")).execRawQueryString();
    }
}