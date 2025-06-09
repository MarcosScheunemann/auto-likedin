import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ISharedImports } from './routes/services/general/dto/shared-imports';
import { Router } from '@angular/router';
import { ERouters } from '../shared/interfaces/enuns/e-routers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ...ISharedImports],
})
export class AppComponent {
  currentTab = 'home';
  constructor(private router: Router) {
    this.navigate({ detail: { value: this.currentTab } } as any)
  }
  navigate(event: CustomEvent) {
    const selected: ERouters = event.detail.value;
    this.currentTab = selected;
    this.router.navigate([`/${selected}`]);
  }
}
