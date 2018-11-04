import { InvalidArgumentError, UnauthorizedError } from 'restify-errors';
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

  private rowCount: number = 0; // INCLUDING HEADER
  private rowCurrent: number = 0;

  public constructor(parameters) {
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
      throw new UnauthorizedError("Can not do initial read");
    }
  }

  public retrieveHeaders() {
    this.status = SheetToRestStatusEnum.HeadersRetrieved;
    this.rowCurrent++;  // Move to next row
    return ['Header01', 'Header02', 'Header03' , 'Header04']; //@TODO Make it so headers are fetched from Google
  }

  public populateHeadersFromSource() : boolean {
    this.headers = this.retrieveHeaders();
    return true;
  }

  private readCurrentRowFromSource() : Array<string> {
    // This function will return the values of the current row as an array, not with headers
    const data = [];
    this.headers.forEach((headerName) => {
      data.push(`${headerName} row ${this.rowCurrent}`);
    })
    return data;
  }



  public fetchCurrentRowAsObject() : object|boolean {
    if (this.rowCurrent >= this.rowCount) {
        return false;
    }

    const currentRowAsObject = {};
    const currentRowAsArray = this.readCurrentRowFromSource();

    console.log("RECEIVED THIS", currentRowAsArray)
    this.headers.forEach((headerName : string, index: number) : void => {
      currentRowAsObject[headerName] = currentRowAsArray[index];
    })

    return currentRowAsObject;
  }

  public nextRow() {
    this.rowCurrent++;
  }

  public async postCurrentRowAsObject () {
    const row = await this.fetchCurrentRowAsObject();
    if (row === false) {
      return false;
    }

    const status = { status: 200, body: "OK, item processed" };
    return this.rowCurrentSetStatus(row, status);
  }

  public rowCurrentSetStatus (row, status) {
    // This one does the update in the spreadsheet so the user can track status
    return { ...row , status }
  }

  public dump() : void {
    console.log("URL>>> " , this.url, " SHEETID>>>>", this.sheetId, 'status', this.status, this.id);
  }
}
