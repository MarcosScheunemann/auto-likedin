import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent ,IonButton} from '@ionic/angular/standalone';
import { GenerateService } from '../services/generate/generate.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {

  constructor(
    private readonly generateService:GenerateService
  ) {}
  public play(){
    this.generateService.generate().subscribe()
  }
}
