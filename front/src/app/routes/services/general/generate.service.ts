import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGeneralService } from '../../api/api-general.service';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {
    // #region Constructors (1)

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
    
}