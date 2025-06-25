import { Component, OnInit } from '@angular/core';
import { ISharedImports } from '../services/general/dto/shared-imports';
import { TokenSyncService } from '../api/token-sync-service';
import { ApiGeneralService } from '../api/api-general.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: ISharedImports,
})
export class ConfigPage implements OnInit {
  public statusLinkedin: 'Sem Token Key' | 'Não Conectado' | 'Conectado' =
    'Sem Token Key';

  constructor(
    private readonly tokenSyncService: TokenSyncService,
    private readonly api: ApiGeneralService,
  ) {
    this.onConectLkdn()
  }

  ngOnInit() {}
  public get openAiKey(): string {
    return localStorage.getItem('openai_key') || '';
  }

  public set openAiKey(value: any) {
    if (typeof value !== 'string') return;
    localStorage.setItem('openai_key', value);
  }
  public get gnewsKey(): string {
    return localStorage.getItem('gnews_key') || '';
  }

  public set gnewsKey(value: any) {
    if (typeof value !== 'string') return;
    localStorage.setItem('gnews_key', value);
  }
  public get subscriptionToken(): string {
    return localStorage.getItem('subscription_token') || '';
  }

  public set subscriptionToken(value: any) {
    if (typeof value !== 'string') return;
    this.statusLinkedin = 'Não Conectado';
    localStorage.setItem('subscription_token', value);
  }

  public update() {
    this.tokenSyncService.syncAll();
  }

  public onConectLkdn() {
    if (!this.subscriptionToken) return;
    this.api.hasLinkedin().subscribe({
      next: (res) =>
        (this.statusLinkedin = res ? 'Conectado' : 'Não Conectado'),
    });
  }
}
