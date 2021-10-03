import { SchemaInterface } from "./SchemaInterface";

export class Migration
{
    static migrationComponent:any;
    static migrationConnection:any;

    private migration:Migration;

    constructor(migrationName:string, tableName:string, call:(schema:SchemaInterface) => any)
    {
        this.migration = new (Migration.migrationComponent)(Migration.migrationConnection, migrationName, tableName, call);
    }

    getMigrationName(): string
    {
        return this.migration.getMigrationName();
    }

    async up()
    {
        await this.migration.up();
    }

    async down()
    {
        await this.migration.down();
    }

    static setComponent(migrationComponent:any, migrationConnection:any)
    {
        Migration.migrationComponent = migrationComponent;
        Migration.migrationConnection = migrationConnection;
    }
}