import { InvalidArgumentError } from 'restify-errors';
import { validate, Length } from "class-validator";
import { BaseModel } from './base';

enum SheetToRestStatusEnum {
    Received, NotFound = -1,
    AuthRequired, AuthSucceeded, AuthFailed = -2,
    HeadersRetrieved, HeadersNotFound = -3,
    Completed
}

export class SheetToRest extends BaseModel {
  @Length(1,50)
  public sheetId: string;

  @Length(1,255)
  public url : string;

  private status : SheetToRestStatusEnum = SheetToRestStatusEnum.Received;

  public constructor(parameters: object) {
    this.sheetId = parameters.sheetId;
    this.url = parameters.url;
  }

  public dump() : void {
    console.log("URL>>> " , this.url, " SHEETID>>>>", this.sheetId, 'current_status', this.current_status);
  }
}
