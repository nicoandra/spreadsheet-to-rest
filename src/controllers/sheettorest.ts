//ECHO controller - respond with the parameters passed in
import * as restify from "restify";
import { SheetToRest } from '../types/SheetToRest'

export default class SheetToRestController {

  post : Function = async (req: restify.Request, res: restify.Response, next: restify.Next) => {

    console.log("controller", req.params);
    const job : SheetToRest = new SheetToRest(req.params);

    try {
      job.validate()
    } catch (exception) {
      return next(exception);
    }
    
    job.dump();

    res.send(job);
    next();

  };

}
