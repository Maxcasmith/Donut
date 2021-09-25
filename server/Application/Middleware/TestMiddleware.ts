
export class TestMiddleware
{
    async execute(command:any, data:any): Promise<any>
    {
        const { message } = data;
        console.log(`Test Middleware says '${message}'`);
    }
}