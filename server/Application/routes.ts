const PREFIX_V1 = '/api/v1';

export const routes = [
    { method: "GET", route: `${PREFIX_V1}/hello`, call: 'ExampleController@hello' },
    { method: "GET", route: `${PREFIX_V1}/example`, call: 'ExampleController@example' },
];
