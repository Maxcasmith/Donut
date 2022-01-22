import { QueryComponent } from "./QueryComponent";

export class Query implements QueryComponent
{
    static queryComponent:any;
    static connection:any;

    private query:QueryComponent;

    constructor()
    {
        this.query = new (Query.queryComponent)(Query.connection);
    }

    static setComponent(queryComponent:any, connection:any)
    {
        Query.queryComponent = queryComponent;
        Query.connection = connection;

        Object.freeze(Query.queryComponent);
        Object.freeze(Query.connection);
    }

    table(tableName:string): this
    {
        this.query.table(tableName);
        return this;
    }
    
    async get(): Promise<any>
    {
        return await this.query.get();
    }

    async insert(data:any): Promise<any>
    {
        return await this.query.insert(data);
    }

    async update(data:any): Promise<any>
    {
        return await this.query.update(data);
    }

    async find(id:number): Promise<any>
    {
        return await this.query.find(id);
    }

    async delete(id:number): Promise<any>
    {
        return await this.query.delete(id);
    }

    async exists(): Promise<any>
    {
        return await this.query.exists();
    }

    limit(limit:number): QueryComponent
    {
        return this.query.limit(limit);
    }

    offset(offset:number): QueryComponent
    {
        return this.query.offset(offset);
    }
}
