const path = require("path");
import { routes } from "./routes";

async function runEndpoint(req, res)
{
    const route = routes.find(r => r.route == req.url && r.method == req.method);

    const [controller, func] = route.call.split('@');
    const ref = require(`../Application/Controllers/${controller}.js`);
    const container = new ref[controller]();

    route
        ? res.send(await container[func](req))
        : res.sendFile(path.join(__dirname, '../../client/index.html'));
}

module.exports = function (router, jsonParser)
{
    router.get('*', jsonParser, (req, res) => runEndpoint(req, res));
    router.post('*', jsonParser, (req, res) => runEndpoint(req, res));
}