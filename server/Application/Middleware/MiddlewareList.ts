import { TestMiddleware } from "./TestMiddleware";

const test = "test";

export const middlewareList:middleware[] = [
    { middleware: TestMiddleware, lane: test }
];

interface middleware
{
    middleware: any,
    lane?:string|null
}