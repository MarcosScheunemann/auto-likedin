import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGenerateService } from '../../api/api-generate.service';

@Injectable({
    providedIn: 'root',
})
export class GenerateService {
    // #region Constructors (1)

    constructor(
        private readonly api: ApiGenerateService,
    ) { }

    // #endregion Constructors (1)

    // #region Public Methods (1)

    public generate(): Observable<void> {
        return this.api.generate().pipe(
            map((_) => {
                return
            })
        );
    }
}