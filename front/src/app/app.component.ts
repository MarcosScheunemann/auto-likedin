import { Component } from '@angular/core';
import { IonApp, IonHeader, IonRouterOutlet } from '@ionic/angular/standalone';
import { ISharedImports } from './routes/services/general/dto/shared-imports';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ...ISharedImports],
})
export class AppComponent {
  constructor() {}
}
