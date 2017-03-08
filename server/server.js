import http from 'http';
import express from 'express';
import {ServerEnvName} from './azcommon/env';

console.log('ServerEnvName :', ServerEnvName);

let app = express();
app.use(express.static(__dirname + '/public'));

let port = 3000;
console.log('Express listening on port ' + port);

let httpServer = http.createServer(app);
httpServer.listen(port, (() => {}));
