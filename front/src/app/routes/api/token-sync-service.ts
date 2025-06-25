import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root'
})
export class TokenSyncService extends ApiBaseService {
    constructor(http: HttpClient) {
        super(http);
    }
    public syncAll(): void {
        const subscription = localStorage.getItem('subscription_token');
        const gnews = localStorage.getItem('gnews_key');
        const openai = localStorage.getItem('openai_key');

        if (subscription) {
            this.http.get(`${this.baseUrl}/token/${subscription}`).subscribe();
        }

        if (gnews) {
            this.http.post(`${this.baseUrl}/token/g-news`, { token: gnews }).subscribe();
        }

        if (openai) {
            this.http.post(`${this.baseUrl}/token/openai`, { token: openai }).subscribe();
        }
    }
}
