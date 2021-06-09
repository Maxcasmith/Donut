import { ExampleController } from './Controllers/ExampleController.js';

const path = require("path");

const PREFIX_V1 = '/api/v1';

module.exports = function (router, jsonParser)
{
    router.get(`${PREFIX_V1}/hello`, jsonParser, (req, res) => ExampleController.hello(req, res));

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
}