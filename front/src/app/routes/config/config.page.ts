import { Component, OnInit } from '@angular/core';
import { ISharedImports } from '../services/general/dto/shared-imports';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: ISharedImports
})
export class ConfigPage implements OnInit {

  constructor() { }

  ngOnInit() { }
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
    localStorage.setItem('subscription_token', value);
  }
}
