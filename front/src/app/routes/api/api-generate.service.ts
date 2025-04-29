import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { ErrorHandler } from '../../../shared/error.handler';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiGenerateService extends ApiBaseService {
  // #region Constructors (1)

  constructor(http: HttpClient) {
    super(http);
  }


  public generate(): Observable<void> {
    const apiUrl = `${this.baseUrl}`;
    return this.http.get<void>(apiUrl).pipe(catchError(ErrorHandler.handlerError));
  }

}