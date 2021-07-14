const path = require("path");
import { ExecutionBus } from './Services/ExecutionBus';
import {
    ExampleController
} from './Controllers';

const exampleController = new ExampleController(new ExecutionBus());

const PREFIX_V1 = '/api/v1';

module.exports = function (router, jsonParser)
{
    router.get(`${PREFIX_V1}/hello`, jsonParser, (req, res) => exampleController.example(req, res));

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
}