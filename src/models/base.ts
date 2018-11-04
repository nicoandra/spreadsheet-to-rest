import { InvalidArgumentError } from 'restify-errors';
import { validate, Length } from "class-validator";
import  { uuidv4 } from 'uuid/v4';

export class BaseModel {
  public id : string;

  construct() : void {
    this.id = uuidv4();
  }

  public async validate () { // @TODO Type this value
    const errors = await validate(this);
    if (errors.length) {
      console.log(errors);
      throw new InvalidArgumentError('Invalid arguments in your call bro')

    }
  }
}
