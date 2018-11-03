import * as restify from "restify";
import * as routes from "./routes";
import {AccessLogger} from '@ssense/node-logger';
const name = 'spreadsheet-to-rest'; // @TODO read from package.json
const port = process.env.port || 4004;
import { name, version } from './../package.json'
const appSignature = `${name}@${version}`;

const accessLogger = new AccessLogger(appSignature);
accessLogger.enable(true);
accessLogger.setPretty(process.env.NODE_ENV === 'development');

//config
const server = restify.createServer({
    name, version
});


const bodyParser = restify.bodyParser({ mapParams: true });
console.log(bodyParser)
server.use(bodyParser);

server.use((req : Request, res : Response, next : Next) => {
  accessLogger.logRequest(req, res);
  next();
})

//call the routes.ts file for available REST API routes
console.log('setting routes...');
routes.setRoutes(server);

//when running the app will listen locally to port 51234
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
})

export server as server;
