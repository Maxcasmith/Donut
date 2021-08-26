const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const map = yaml.load(fs.readFileSync(path.join(__dirname, '../map.yaml')));

const controllerTemplate = `import { bus } from "../Services/ExecutionBus";
{{Imports}}

export class {{Title}} 
{
    {{Body}}
}
`;

const commandTemplate = `import { Command } from "../Command";
{{Imports}}

export class {{Title}} extends Command
{
    {{Params}}

    constructor({{ConstructorParams}})
    {
        super("{{Directory}}");
        {{ConstructorValues}}
    }

    {{GettersAndSetters}}
}
`;

const commandHandlerTemplate = `import { CommandHandler } from "../CommandHandler";
{{Imports}}

export class {{Title}} implements CommandHandler
{
    async handle({{Command}}): Promise<any>
    {
        return "REPLACE ME";
    }
}
`;

const entityTemplate = `import { Entity } from "./Entity";
{{Imports}}

export class {{Title}} extends Entity
{
    {{Params}}

    constructor(data:object)
    {
        super("{{Table}}");
        {{ConstructorValues}}
    }

    {{GettersAndSetters}}
}
`;

class Template
{
    constructor(relativePath, template)
    {
        this.relativePath = relativePath;
        this.template = template;
    }

    getTemplate()
    {
        return this.template
    }

    replaceBookmark(bookmark, template)
    {
        this.template = this.template.replace(`{{${bookmark}}}`, template);
        return this;
    }

    async write()
    {
        fs.writeFile(path.join(__dirname, this.relativePath), this.template, (err) => {
            if (err) throw err;
        });
    }

    async fileExists()
    {
        if (fs.existsSync(path.join(__dirname, this.relativePath))) {
            throw Error("File Exists");
        }
        return false;
    }

    async createDirectory()
    {
        const dir = path.dirname(this.relativePath);
        if (!fs.existsSync(path.join(__dirname, dir))) fs.mkdirSync(path.join(__dirname, dir));
    }
    
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

(async () => {
    const entities = map['entities'];
    for (let e in entities) {
        const entity = entities[e];
        const t = new Template(`../server/Entities/${e}.ts`, entityTemplate);
        if (!await t.fileExists()) {
            let params = '';
            let constructorValue = '';
            let gettersSetters = '';
            for (let value of entity.values) {
                const variable = value.split(':')[0];
                const type = value.split(':')[1];
                params += `private ${variable}: ${type};\n    `;
                constructorValue += `this.${variable} = data['${variable}'];\n        `;
                gettersSetters += `get${capitalizeFirstLetter(variable)}(): ${type} \n    {\n        return this.${variable};\n    }\n\n    `;
                gettersSetters += `set${capitalizeFirstLetter(variable)}(${value}): this \n    {\n        this.${variable} = ${variable};\n        return this;\n    }\n\n    `;
            }
            t.replaceBookmark("Title", e);
            t.replaceBookmark("Table", entity.table || e.toLowerCase());
            t.replaceBookmark("Imports", ``);
            t.replaceBookmark("Params", params);
            t.replaceBookmark("ConstructorValues", constructorValue);
            t.replaceBookmark("GettersAndSetters", gettersSetters);
            await t.write();
            console.log(`${e} Created!`);
        }
    }
    
    const commands = map['commands'];
    for (let c in commands) {
        const command = commands[c];
        const t = new Template(`../server/Boundary/Commands/${command.dir}/${c}.ts`, commandTemplate);
        if (!await t.fileExists()) {
            let params = '';
            let constructorParams = '';
            let constructorValues = '';
            let gettersSetters = '';
            for (let p of command.parameters) {
                const variable = p.split(':')[0];
                const type = p.split(':')[1];
                params += `private ${variable}: ${type};\n    `;
                constructorParams += `${p}, `;
                constructorValues += `this.${variable} = ${variable};\n        `;
                gettersSetters += `get${capitalizeFirstLetter(variable)}(): ${type} \n    {\n        return this.${variable};\n    }\n\n    `;
                gettersSetters += `set${capitalizeFirstLetter(variable)}(${p}): this \n    {\n        this.${variable} = ${variable};\n        return this;\n    }\n\n    `;
            }
            constructorParams = constructorParams.slice(0, -2);
            t.replaceBookmark("Title", c);
            t.replaceBookmark("Imports", ``);
            t.replaceBookmark("Directory", command.dir);
            t.replaceBookmark("Params", params);
            t.replaceBookmark("ConstructorParams", constructorParams);
            t.replaceBookmark("ConstructorValues", constructorValues);
            t.replaceBookmark("GettersAndSetters", gettersSetters);
            await t.createDirectory();
            t.write();
            console.log(`${c} Created!`);
        }
        const handler = new Template(`../server/Boundary/CommandHandlers/${command.dir}/${c}Handler.ts`, commandHandlerTemplate);
        if (!await handler.fileExists()) {
            handler.replaceBookmark("Command", `command:${c}`);
            handler.replaceBookmark("Title", `${c}Handler`);
            handler.replaceBookmark("Imports", `import { ${c} } from "../../Commands/${command.dir}/${c}";`);
            await handler.createDirectory();
            handler.write();
            console.log(`${c}Handler Created!`);
        }
    }

    const controllers = map['controllers'];
    for (let c in controllers) {
        const controller = controllers[c];
        const t = new Template(`../server/Application/Controllers/${c}.ts`, controllerTemplate);
        if (!await t.fileExists()) {
            let functions = '';
            for (let f of controller.functions) {
                functions += `async ${f}(req)\n    {\n        const command = "REPLACE ME";\n        const data = await bus.execute(command);\n        return data;\n    }\n\n    `;
            }
            t.replaceBookmark("Title", c);
            t.replaceBookmark("Imports", ``);
            t.replaceBookmark("Body", functions);
            t.write();
            console.log(`${c} Created!`);
        }
    }
})();