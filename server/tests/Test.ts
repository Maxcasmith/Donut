export class Test
{
    req:object;

    setReq(request:object)
    {
        this.req = request;
    }

    assertEquals(expectedResult:any, actualValue:any): void
    {
        const result = expectedResult == actualValue;
        if (result) console.log('.');
        else {
            console.log('F');
            console.log(`----expected: ${expectedResult}`);
            console.log(`++++actual: ${actualValue}`);
        }
    }
}