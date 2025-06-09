import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ISharedImports } from './routes/services/general/dto/shared-imports';
import { Router } from '@angular/router';
import { ERouters } from '../shared/interfaces/enuns/e-routers';
import { TokenSyncService } from './routes/api/token-sync-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ...ISharedImports],
})
export class AppComponent {
  private tokenSync = inject(TokenSyncService);
  currentTab = 'home';
  constructor(private router: Router) {
    this.navigate({ detail: { value: this.currentTab } } as any),
    this.tokenSync.syncAll();
  }
  navigate(event: CustomEvent) {
    const selected: ERouters = event.detail.value;
    this.currentTab = selected;
    if (selected === ERouters.HOME){
      this.tokenSync.syncAll();
    }
    this.router.navigate([`/${selected}`]);
  }
}
