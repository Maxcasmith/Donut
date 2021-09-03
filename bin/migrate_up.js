const { MySQLQuery } = require("../database/MySQLQuery.js");
const { migrations } = require("../database/Migrations");

(async () => 
{
    for (let migration of migrations) {
        let willMigrate = true;
        
        const tables = await (new MySQLQuery('SHOW TABLES LIKE "migrations"')).execRawQueryString();
        const migrationsTableExists = (tables.length > 0);

        if (migrationsTableExists) {
            const results = await (new MySQLQuery(`SELECT * FROM migrations WHERE migration_name = "${migration.name}"`)).execRawQueryString();
            willMigrate = (results.length == 0);
        }

        if (willMigrate) {
            console.log("\x1b[33m", `migrating ${migration.name}`);
            const data = await migration.up();
            if (data['errno']) throw Error(data['message']);
            console.log("\x1b[32m", `migration ${migration.name} completed successfully`);
            await (new MySQLQuery(`INSERT into migrations (migration_name) VALUES ('${migration.name}')`)).execRawQueryString();
            if (migration.seed) {
                console.log("\x1b[33m", `seeding ${migration.name}`);
                await migration.seed();
                console.log("\x1b[32m", `finished seeding ${migration.name}`);
            }
        } 
    }
})();