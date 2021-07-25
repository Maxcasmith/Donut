import { ExampleController } from "../Application/Controllers/ExampleController";
import { Test } from "./Test";

export class ExampleTest extends Test
{
    constructor()
    {
        super();
        this.setReq({});
    }

    async test_exampleController_returns_correct_data()
    {
        const ec = new ExampleController();
        const data = await ec.example(this.req);
        this.assertEquals("HELLO WORLD", data.value);
    }
}