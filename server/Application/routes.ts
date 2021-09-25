import { Route } from "./Route";

const PREFIX_V1 = '/api/v1';

export const routes = [
    ...Route.GROUP(PREFIX_V1, [
        Route.GET('/hello', 'ExampleController@hello', 'hello')
    ]),
];
