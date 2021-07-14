const path = require("path");
const fs = require('fs');
const args = process.argv.slice(2);

const name = args[0];

const controllerTemplate = `import { ExecutionBus } from "../Services/ExecutionBus";

export class ${name}
{
    private bus:ExecutionBus;

    constructor(bus:ExecutionBus) 
    {
        this.bus = bus;
    }
}
`;

(async () => {
    fs.writeFile(path.join(__dirname, `../server/Application/Controllers/${name}.ts`), controllerTemplate, (err) => {
        if (err) throw err;
    });
    console.log(`${name} created`);
})();