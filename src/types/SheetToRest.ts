import { InvalidArgumentError } from 'restify-errors';

enum SheetToRestStatusEnum {
    Received,

    AuthRequired,
    AuthSucceeded,
    AuthFailed,

    HeadersRetrieved,
    HeadersNotFound,

    Completed
}

export class SheetToRest {
  public sheetId: string;
  public url : string;
  private status : SheetToRestStatusEnum = SheetToRestStatusEnum.Received;

  public constructor(parameters: object) {
    this.sheetId = parameters.sheetId;
    this.url = parameters.url;
  }

  public validate () : void {
    throw new InvalidArgumentError('Invalid arguments in your call bro')

  }

  public dump() : void {
    console.log("URL>>> " , this.url, " SHEETID>>>>", this.sheetId, 'current_status', this.current_status);
  }
}
