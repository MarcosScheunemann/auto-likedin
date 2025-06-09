import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGeneralService } from '../../api/api-general.service';
import { MakeTextDto } from './dto/makeTextDto';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {

    constructor(
        private readonly api: ApiGeneralService,
    ) { }

    public setToken(token: string): Observable<void> {
        return this.api.setToken(token).pipe(
            map((_) => {
                return
            })
        );
    }
    public makeText(obj: MakeTextDto): Observable<string> {
        return this.api.makeText(obj).pipe(
            map((res: string) => {
                return res
            })
        )
    }

}