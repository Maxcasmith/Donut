export class Query
{
    table(tableName:string): this
    {
        return this;
    }
    
    async get(): Promise<any>
    {
        return "REPLACE ME";
    }

    async insert(data:any): Promise<any>
    {
        return "REPLACE ME";
    }

    async update(data:any): Promise<any>
    {
        return "REPLACE ME";
    }

    async find(id:number): Promise<any>
    {
        return "REPLACE ME";
    }

    async delete(id:number): Promise<any>
    {
        return "REPLACE ME";
    }
}