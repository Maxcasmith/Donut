export interface QueryComponent
{
    table:Function;
    get:Function;
    insert:Function;
    update:Function;
    find:Function;
    delete:Function;
    exists:Function;
    limit:Function;
    offset:Function;
}
