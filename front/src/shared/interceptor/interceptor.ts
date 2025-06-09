import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const cloned = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
        'X-App-Version': '1.0.0'
      }
    });

    return next.handle(cloned);
  }
}
