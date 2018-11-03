import { InvalidArgumentError } from 'restify-errors';
import { validate, Length } from "class-validator";


export class BaseModel {
  public async validate () { // @TODO Type this value
    const errors = await validate(this);
    if (errors.length)
      throw new InvalidArgumentError('Invalid arguments in your call bro')
  }
}
