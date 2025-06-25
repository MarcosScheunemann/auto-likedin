import { HttpErrorResponse } from '@angular/common/http';
import { IErrorModel } from './interfaces/i-error-model';
import { Observable, throwError } from 'rxjs';

export class ErrorHandler {
  static handlerError(error: HttpErrorResponse | any): Observable<never> {

    return throwError(() => ErrorHandler.makeErrorModel(error))
  }
  static makeErrorModel(error: HttpErrorResponse | any) {
    console.log(error);
    let errorModel: IErrorModel;
    if (error instanceof HttpErrorResponse) {
      errorModel = {
        message: error.error.message,
        status: error.status,
      };
    } else {
      errorModel = {
        message: error.message || error.toString(),
        status: error.status || 0,
      };
    }
    return errorModel;
  }
}
