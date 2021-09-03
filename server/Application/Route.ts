interface route
{
    method:string,
    route:string,
    call:string,
    name:string|null
}

export class Route
{
    static GET(routePath:string, callbackRef:string, name:string|null = null): route
    {
        return { method: "GET", route: routePath, call: callbackRef, name };
    }

    static POST(routePath:string, callbackRef:string, name:string|null = null): route
    {
        return { method: "POST", route: routePath, call: callbackRef, name };
    }

    static GROUP(prefix:string, routes:route[]): route[]
    {
        routes.forEach(r => r.route = prefix + r.route);
        return routes;
    }
}