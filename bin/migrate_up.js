import { Query } from "../server/Entities/Query.js";
import { migrations } from "../server/Migrations";

(async () => 
{
    for (let migration of migrations) {
        let willMigrate = true;
        
        const tables = await (new Query('SHOW TABLES LIKE "migrations"')).execRawQueryString();
        const migrationsTableExists = (tables.length > 0);

        if (migrationsTableExists) {
            const results = await (new Query(`SELECT * FROM migrations WHERE migration_name = "${migration.name}"`)).execRawQueryString();
            willMigrate = (results.length == 0);
        }

        if (willMigrate) {
            console.log("\x1b[33m", `migrating ${migration.name}`);
            await migration.up();
            console.log("\x1b[32m", `migration ${migration.name} completed successfully`);
            await (new Query(`INSERT into migrations (migration_name) VALUES ('${migration.name}')`)).execRawQueryString();
            if (migration.seed) {
                console.log("\x1b[33m", `seeding ${migration.name}`);
                await migration.seed();
                console.log("\x1b[32m", `finished seeding ${migration.name}`);
            }
        } 
    }
})();