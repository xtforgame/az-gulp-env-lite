import http from 'http';
import express from 'express';
import moduleImportTest from '~/moduleImportTest';
import {ServerEnvName} from 'azcommon/env';
import {configMode} from 'config';

moduleImportTest();
console.log('ServerEnvName :', ServerEnvName);
console.log('configMode :', configMode);

let app = express();
app.use(express.static(__dirname + '/public'));

let port = 3000;
console.log('Express listening on port ' + port);

let httpServer = http.createServer(app);
httpServer.listen(port, (() => {}));
