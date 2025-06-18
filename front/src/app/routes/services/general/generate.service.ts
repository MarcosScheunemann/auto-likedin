import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGeneralService } from '../../api/api-general.service';
import { MakeTextDto } from './dto/makeTextDto';
import { GenerateTokenDto } from './dto/generateTokenDto';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private readonly api: ApiGeneralService) {}

  public generateToken(obj: GenerateTokenDto): Observable<string | undefined> {
    return this.api.generateToken(obj).pipe(
      map((res: string | undefined) => {
        return res;
      }),
    );
  }
  public setToken(token: string): Observable<void> {
    return this.api.setToken(token).pipe(
      map((_) => {
        return;
      }),
    );
  }
  public makeText(obj: MakeTextDto): Observable<string> {
    return this.api.makeText(obj).pipe(
      map((res: string) => {
        return res;
      }),
    );
  }
}
