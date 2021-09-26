import * as express from 'express';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import * as http from "http";
import * as path from "path";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}))

const server = http.createServer(app);
const io = new Server(server);

require('./Application/routing.js')(app);
require('./Application/sockets.js')(io);

server.listen(8000);
