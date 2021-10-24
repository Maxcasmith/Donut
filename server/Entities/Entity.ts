import { Query } from "./Query/Query";

export class Entity
{
    table: string;

    constructor(table:string)
    {
        this.table = table;
    }

    async create(): Promise<any>
    {
        const data = await (new Query()).table(this.table).insert(this);
        this[`${this.table}_id`] = data.insertId;
        return this;
    }

    async update(): Promise<any>
    {
        const data = await (new Query()).table(this.table).update(this);
        return this;
    }

    async delete(): Promise<any>
    {
        const data = await (new Query()).table(this.table).delete(this[`${this.table}_id`]);
        return data;
    }

    static async find(id): Promise<any>
    {
        const data = await (new Query()).table(this.name.toLowerCase()).find(id);
        if (!data) throw Error(`No ${this.name} related to id ${id}`);
        return new this(data);
    }

    static async all(): Promise<any>
    {
        const data = await (new Query()).table(this.name.toLowerCase()).get();
        return data.map(datum => {
            return new this(datum);
        });
    }
}
