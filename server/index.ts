import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());
app.use(express.static('../client'));

const server = http.createServer(app);
const io = new Server(server);

require('./Application/routing.js')(app, jsonParser);
require('./Application/sockets.js')(io);

server.listen(8000);
