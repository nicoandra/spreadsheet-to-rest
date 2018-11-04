//ECHO controller - respond with the parameters passed in
import * as restify from "restify";
import { InvalidArgumentError } from 'restify-errors';
import { SheetToRest } from '../models/SheetToRest'

export default class SheetToRestController {

  post : Function = async (req: restify.Request, res: restify.Response, next: restify.Next) => {

    console.log("controller", req.params);
    const job : SheetToRest = new SheetToRest(req.params);

    try {
      await job.validate();
    } catch ( exception ) {
      return next(exception);
    }

    await job.tryToDoInitialRead();
    await job.populateHeadersFromSource();

    const data = [];
    let record;
    while(record = await job.fetchCurrentRowAsObject()) {
      data.push(record);
    }

    const response = { request: req.params, response : { status: "OK", data }};

    res.send(response);
    next();

  };

}
