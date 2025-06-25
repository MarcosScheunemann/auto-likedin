import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { ErrorHandler } from '../../../shared/error.handler';
import { Observable } from 'rxjs';
import { MakeTextDto } from '../services/general/dto/makeTextDto';
import { MakePostDto } from '../services/general/dto/makePostDto';
import { GenerateTokenDto } from '../services/general/dto/generateTokenDto';
import { IEnvelope } from 'scheunemann-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiGeneralService extends ApiBaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  public setToken(token: string): Observable<void> {
    const apiUrl = `${this.baseUrl}/token/${token}`;
    return this.http
      .get<void>(apiUrl)
      .pipe(catchError(ErrorHandler.handlerError));
  }
  public generateToken(obj: GenerateTokenDto): Observable<string | undefined> {
    const apiUrl = `${this.baseUrl}/token/generate`;
    return this.http
      .post<string | undefined>(apiUrl, obj)
      .pipe(catchError(ErrorHandler.handlerError));
  }

  public makeText(obj: MakeTextDto): Observable<IEnvelope<string>> {
    const apiUrl = `${this.baseUrl}/ia/make-text`;
    return this.http
      .post<IEnvelope<string>>(apiUrl, obj)
      .pipe(catchError(ErrorHandler.handlerError));
  }

  public hasLinkedin(): Observable<boolean> {
    const apiUrl = `${this.baseUrl}/linkedin/can-pass`;
    return this.http
      .get<boolean>(apiUrl)
      .pipe(catchError(ErrorHandler.handlerError));
  }

  public makePost(obj: MakePostDto): Observable<void> {
    const apiUrl = `${this.baseUrl}/linkedin/can-pass`;
    return this.http
      .post<void>(apiUrl, obj)
      .pipe(catchError(ErrorHandler.handlerError));
  }
}
