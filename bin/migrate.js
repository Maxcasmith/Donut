const { database } = require('../build/configs/database.js');
const { Migration } = require('../build/Migrations/Migration.js');
const { Query } = require('../build/Entities/Query/Query.js');
const { Uuid } = require('../build/Entities/Uuid.js');

Query.setComponent(database.queryComponent, database.connection);
Migration.setComponent(database.migrationComponent, database.connection);

const { migrations } = require('../build/Migrations/migrations.js');

(async () => {
    const data = (await (new Query()).table('migration').exists())
        ? await (new Query()).table('migration').get()
        : [];

    switch (process.argv[2]) {
        case "up":
            const migration_group_id = (new Uuid()).getId();
        
            for (let m of migrations) {                    
                if (data.filter(d => d['migration_name'] == m.getMigrationName()).length == 0) {
                    console.log(`Migrating ${m.getMigrationName()}`);
                    await m.up();

                    await (new Query()).table('migration').insert({
                        migration_group_id,
                        migration_name: m.getMigrationName()
                    });
                    console.log(`Successfully Migrated ${m.getMigrationName()}`);
                } else {
                    console.log(`Skipping ${m.getMigrationName()}`);
                }
            }
            break;

        case "down":
            if (data.length > 0) {
                data.reverse();

                const activeMigrations = migrations;
                activeMigrations.reverse();

                for (let m of activeMigrations) {
                    if (data.find(x => x['migration_name'] == m.getMigrationName())) {
                        console.log("Rolling back " + m.getMigrationName());
                        await m.down();
    
                        if (m.getMigrationName() != 'create_migration_table') {
                            const migrationId = data.find(x => x['migration_name'] == m.getMigrationName())['migration_id'];
                            await (new Query()).table('migration').delete(migrationId);
                        }
    
                        console.log(`Rolled back ${m.getMigrationName()}`);
                    }
                }
            }
            break;

        case "rollback":
            if (data.length > 0) {
                data.reverse();

                const groupId = data[0]['migration_group_id'];

                const migrationsToRollback = data.filter(d => d['migration_group_id'] == groupId);

                const activeMigrations = migrations.filter(mig => migrationsToRollback.map(x => x['migration_name']).includes(mig.getMigrationName()));
                activeMigrations.reverse();
                
                for (let m of activeMigrations) {
                    console.log("Rolling back " + m.getMigrationName());
                    await m.down();

                    if (m.getMigrationName() != 'create_migration_table') {
                        const migrationId = migrationsToRollback.find(x => x['migration_name'] == m.getMigrationName())['migration_id'];
                        await (new Query()).table('migration').delete(migrationId);
                    }

                    console.log(`Rolled back ${m.getMigrationName()}`);
                }
            }
            break;
    }
})();