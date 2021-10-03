import { Migration } from "./Migration";

// const create_migration_table = new Migration('create_migration_table', 'migration', (schema) => {
//     schema.onUp = schema.create((table:any) => {
//         table.id();
//         table.string('migration_group_id');
//         table.string('migration_name');
//         table.timestamps();
//     });
//     schema.onDown = schema.drop();
// });

//ORDER MATTERS
export const migrations = [
    // create_migration_table,
];
