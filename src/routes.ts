import * as echo from "./controllers/echo";
import SheetToRestController from "./controllers/sheettorest";


const sheetToRestController : SheetToRestController = new SheetToRestController()

export function setRoutes(server) {
  server.get('/echo/:message', echo.get);
  server.get('/echo', echo.get);
  server.post('/sheettorest', sheetToRestController.post)
}
