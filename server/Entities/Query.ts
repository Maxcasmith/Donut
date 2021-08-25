import { MySQLQuery } from "../../database/MySQLQuery.js";

export class Query
{
    private builder:MySQLQuery;

    constructor(rawQuery:string|null = null)
    {
        this.builder = new MySQLQuery(rawQuery);
    }

    setTableName(tableName:string): this
    {
        this.builder.setTableName(tableName);
        return this;
    }

    where(column:string, operator:string|null = '=', value:any): this
    {
        this.builder.where(column, operator, value);
        return this;
    }

    orWhere(column:string, operator:string|null = '=', value:any): this
    {
        this.builder.orWhere(column, operator, value);
        return this;
    }

    join(table:string, columnOne:string, columnTwo:string): this
    {
        this.builder.join(table, columnOne, columnTwo);
        return this;
    }

    limit(limit:number): this
    {
        this.builder.limit(limit);
        return this;
    }

    async get(): Promise<any>
    {
        return await this.builder.get();
    }

    async getOneToMany(id:number, field:string): Promise<any>
    {
        return await this.builder.getOneToMany(id, field);
    }

    async insert(data:any): Promise<any>
    {
        return await this.builder.insert(data);
    }

    async update(data:any): Promise<any>
    {
        return await this.builder.update(data);
    }

    async find(id:number): Promise<any>
    {
        return await this.builder.find(id);
    }

    async delete(id:number): Promise<any>
    {
        return await this.builder.delete(id);
    }

    async execRawQueryString(): Promise<any>
    {
        return await this.builder.execRawQueryString();
    }

    async toSql(): Promise<string>
    {
        return await this.builder.toSql();
    }
}