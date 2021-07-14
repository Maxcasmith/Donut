import { MySQLQuery as QueryComponent } from "../../database/MySQLQuery.js";

export class Query extends QueryComponent
{
    constructor(rawQueryString: string|null = null)
    {
        super(rawQueryString);
    }
}