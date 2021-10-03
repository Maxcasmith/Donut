/**
 * Here is where you define your database connections, import a d-ddt package via npm, 
 * do a quick set up and you're good to go!
 * 
 * Available packages are
 * - d-ddts-mysql-lib
 * - d-ddts-jsonstore-lib
 * 
 * export const database = {
 *     migrationComponent,  The constructable class reference for your migration
 *     queryComponent,  The constructable class reference for your query
 *     connection  The connection or config object your query class needs
 * }
 */

const { migrationComponent, queryComponent, connection } = {
    migrationComponent: null,
    queryComponent: null,
    connection: null
}

export const database = {
    migrationComponent,
    queryComponent,
    connection
}