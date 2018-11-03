//ECHO controller - respond with the parameters passed in
import * as restify from "restify";
import { InvalidArgumentError } from 'restify-errors';
import { SheetToRest } from '../models/SheetToRest'

export default class SheetToRestController {

  post : Function = async (req: restify.Request, res: restify.Response, next: restify.Next) => {

    console.log("controller", req.params);
    const job : SheetToRest = new SheetToRest(req.params);

    try {
      await job.validate()
    } catch ( exception: InvalidArgumentError) {
      return next(exception);
    }

    job.dump();

    res.send(job);
    next();

  };

}
