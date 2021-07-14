const path = require("path");

import {
    exampleController
} from './Controllers';

const PREFIX_V1 = '/api/v1';

module.exports = function (router, jsonParser)
{
    router.get(`${PREFIX_V1}/hello`, jsonParser, (req, res) => exampleController.hello(req, res));
    router.get(`${PREFIX_V1}/example`, jsonParser, (req, res) => exampleController.example(req, res));

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
}