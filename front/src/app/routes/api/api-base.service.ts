import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class ApiBaseService {
  protected baseUrl = `${environment.apiUrl}`;

  constructor(protected http: HttpClient) {}
}
