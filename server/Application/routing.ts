const path = require("path");
import { routes } from "./routes";

async function runEndpoint(req, res)
{
    const route = routes.find(r => {
        const wildcards = r.route.match(/:([^\/]*)/g);
        if (wildcards) {
            let routeBuild = r.route.replace(/\//g, "\\/");
            for (let wildcard of wildcards) routeBuild = routeBuild.replace(wildcard, '([^\/]*)');
            const rb = new RegExp(routeBuild + '$');
            const matchingRoute = rb.test(req.path) && r.method == req.method;

            if (matchingRoute) {
                const wildcardVals = (req.path.match(rb)).splice(1, wildcards.length);
    
                let params:object = {};
                for (let i = 0; i < wildcards.length; i++) {
                    params[wildcards[i].slice(1)] = wildcardVals[i];
                }
                req.params = params;
            }

            return matchingRoute;
        }
        else return r.route == req.path && r.method == req.method;
    });

    if (route) {
        const [controller, func] = route.call.split('@');
        const ref = require(`../Application/Controllers/${controller}.js`);
        const container = new ref[controller]();

        try {
            res.send(await container[func](req));
        } catch(err) {
            res.send({SUCCESS: false, MESSAGE: err.message});
        }
        
    } else res.sendFile(path.join(__dirname, '../../client/index.html'));
}

module.exports = function (router)
{
    router.get('/storage/:filename', (req, res) => { res.sendFile(path.join(__dirname, `../../storage/${req.params.filename}`)) })
    router.get('*', (req, res) => runEndpoint(req, res));
    router.post('*', (req, res) => runEndpoint(req, res));
}