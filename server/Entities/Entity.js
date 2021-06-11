import { Query } from "../../database/Query.js";

export class Entity
{
    constructor(table)
    {
        this.table = table;
    }

    async create()
    {
        const data = await (new Query()).setTableName(this.table).insert(this);
        return data;
    }

    async update()
    {
        const data = await (new Query()).setTableName(this.table).update(this);
        return data;
    }

    static async find(id)
    {
        const data = await (new Query()).setTableName(this.name.toLowerCase()).find(id);
        return new this(data[0]);
    }

    static async all()
    {
        const data = await (new Query()).setTableName(this.name.toLowerCase()).get();
        return data.map(datum => {
            return new this(datum);
        });
    }
}