import * as restify from "restify";
import * as routes from "./routes";
import {AccessLogger} from '@ssense/node-logger';
const port = process.env.port || 4004;
const { name, version } = require('./../package.json');
const appSignature = `${name}@${version}`;

const accessLogger = new AccessLogger(appSignature);
accessLogger.enable(true);
accessLogger.setPretty(process.env.NODE_ENV === 'development');

//config
const server = restify.createServer({
    name, version
});

server.use(restify.plugins.bodyParser({ mapParams: true }))

server.use((req : restify.Request, res : restify.Response, next : restify.Next) => {
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
