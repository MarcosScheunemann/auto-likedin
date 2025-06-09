import { Component, OnInit } from '@angular/core';
import { ISharedImports } from '../services/general/dto/shared-imports';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
  standalone: true,
  imports: ISharedImports
})
export class SingupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
