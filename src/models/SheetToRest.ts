import { InvalidArgumentError, NotAllowedError } from 'restify-errors';
import { validate, Length } from "class-validator";
import { BaseModel } from './base';
import * as uuidv4 from 'uuid/v4';

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

  @Length(1, 255)
  private owner : string = '';

  private isReadable: boolean|null;
  private accessCode: null|Number;
  private headers: Array<string>;

  private rowCount: Number = 0;
  private rowCurrent: Number = 0;

  public constructor(parameters: Object) {
    super();
    this.sheetId = parameters.sheetId;
    this.url = parameters.url;
    this.id = uuidv4();
    this.isReadable = null;
    this.owner = 'Someone';
    this.accessCode = null;
    this.headers = [];
    this.rowCount = 4;
  }

  public async tryToDoInitialRead() : Promise<boolean> {
    try {
      // try to access the spreadsheet
      this.status = SheetToRestStatusEnum.AuthSucceeded;
      return true;
    } catch (exception) {
      this.status = SheetToRestStatusEnum.AuthFailed;
      throw new NotAllowedError("Can not do initial read");
    }
  }

  public retrieveHeaders() {
    this.status = SheetToRestStatusEnum.HeadersRetrieved;
    return ['Header01', 'Header02', 'Header03' , 'Header04']; //@TODO Make it so headers are fetched from Google
  }

  public populateHeadersFromSource() : boolean {
    this.headers = this.retrieveHeaders();
    return true;
  }

  private async readCurrentRowFromSource() : Array {
    // This function will return the values of the current row as an array, not with headers
    const data = Array(this.headers.length);
    data.forEach((val: String, index) => {
      data[index] = `${val} row ${this.rowCurrent}`;
    })

    return data;
  }

  public async fetchCurrentRowAsObject() : Promise<Array|False> {
    if (this.rowCurrent >= this.rowCount) {
        return false;
    }

    const currentRowAsObject = {};
    const currentRowAsArray = await this.readCurrentRowFromSource();
    this.headers.forEach((headerName : String, index: Number) : void => {
      currentRowAsObject[headerName] = currentRowAsArray[index];
    })

    // Move the pointer to the next position.
    this.rowCurrent++;

    return currentRowAsObject;
  }

  public dump() : void {
    console.log("URL>>> " , this.url, " SHEETID>>>>", this.sheetId, 'status', this.status, this.id);
  }
}
