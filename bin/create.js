const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const map = yaml.load(fs.readFileSync(path.join(__dirname, '../map.yaml')));

const log = false;

const controllerTemplate = `import { Request } from "../Request";
import { bus } from "../Services/ExecutionBus";
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
    constructor(name, relativePath, template)
    {
        this.name = name;
        this.relativePath = relativePath;
        this.template = template;
    }

    getName()
    {
        return this.name;
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
            if (log) console.log("\x1b[2m", "\x1b[37m",  `${this.name} : File exists in directory`);
            return true;
        }
        return false;
    }

    async createDirectory()
    {
        const dir = path.dirname(this.relativePath);
        if (!fs.existsSync(path.join(__dirname, dir))) fs.mkdirSync(path.join(__dirname, dir));
    }
    
}

function toCamel(string)
{
    return string.replace(/([-_][a-z])/ig, (s) => {
        return s.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
}

function capitalizeFirstLetter(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

(async () => {
    const entities = map['entities'];
    for (let e in entities) {
        const entity = entities[e];
        const t = new Template(e, `../server/Entities/${e}.ts`, entityTemplate);
        if (!await t.fileExists()) {
            let params = '';
            let constructorValue = '';
            let gettersSetters = '';
            for (let value of entity.values) {
                const variable = value.split(':')[0];
                const type = value.split(':')[1];
                params += `private ${variable}: ${type};\n    `;
                constructorValue += `this.${variable} = data['${variable}'];\n        `;
                gettersSetters += `get${capitalizeFirstLetter(toCamel(variable))}(): ${type} \n    {\n        return this.${variable};\n    }\n\n    `;
                gettersSetters += `set${capitalizeFirstLetter(toCamel(variable))}(${value}): this \n    {\n        this.${variable} = ${variable};\n        return this;\n    }\n\n    `;
            }
            t.replaceBookmark("Title", e);
            t.replaceBookmark("Table", entity.table || e.toLowerCase());
            t.replaceBookmark("Imports", ``);
            t.replaceBookmark("Params", params);
            t.replaceBookmark("ConstructorValues", constructorValue);
            t.replaceBookmark("GettersAndSetters", gettersSetters);
            await t.write();
            console.log("\x1b[0m", "\x1b[32m", `${e} Entity Created!`);
        }
    }
    
    const commands = map['commands'];
    for (let c in commands) {
        const command = commands[c];
        const t = new Template(c, `../server/Boundary/Commands/${command.dir}/${c}.ts`, commandTemplate);
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
                gettersSetters += `get${capitalizeFirstLetter(toCamel(variable))}(): ${type} \n    {\n        return this.${variable};\n    }\n\n    `;
                gettersSetters += `set${capitalizeFirstLetter(toCamel(variable))}(${p}): this \n    {\n        this.${variable} = ${variable};\n        return this;\n    }\n\n    `;
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
            console.log("\x1b[0m", "\x1b[32m", `${c} Created!`);
        }
        const handler = new Template(`${c}Handler`, `../server/Boundary/CommandHandlers/${command.dir}/${c}Handler.ts`, commandHandlerTemplate);
        if (!await handler.fileExists()) {
            handler.replaceBookmark("Command", `command:${c}`);
            handler.replaceBookmark("Title", `${c}Handler`);
            handler.replaceBookmark("Imports", `import { ${c} } from "../../Commands/${command.dir}/${c}";`);
            await handler.createDirectory();
            handler.write();
            console.log("\x1b[0m", "\x1b[32m", `${c}Handler Created!`);
        }
    }

    const controllers = map['controllers'];
    for (let c in controllers) {
        const controller = controllers[c];
        const t = new Template(c, `../server/Application/Controllers/${c}.ts`, controllerTemplate);
        if (!await t.fileExists()) {
            let functions = '';
            for (let f of controller.functions) {
                functions += `async ${f}(req:Request)\n    {\n        const commands = "REPLACE ME";\n        const data = await bus.execute({ commands });\n        return data;\n    }\n\n    `;
            }
            t.replaceBookmark("Title", c);
            t.replaceBookmark("Imports", ``);
            t.replaceBookmark("Body", functions);
            t.write();
            console.log("\x1b[0m", "\x1b[32m", `${c} Created!`);
        }
    }
})();