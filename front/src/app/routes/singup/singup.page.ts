import { Component, OnInit } from '@angular/core';
import { ISharedImports } from '../services/general/dto/shared-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiGeneralService } from '../api/api-general.service';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
  standalone: true,
  imports: ISharedImports,
})
export class SingupPage implements OnInit {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly api: ApiGeneralService,
    private toastController: ToastController,
  ) {
    this.form = this.createFromGroup();
  }

  ngOnInit() {}
  private createFromGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      doc: [''],
      docType: [''],
      internationalCode: [''],
    });
  }

  public submit() {
    if (!this.form.valid) {
      return;
    }
    this.api.generateToken(this.form.value).subscribe({
      next: (res) => {
        if (res) {
          this.toast('bottom', `Token gerado com sucesso: ${res}`);
          this.subscriptionToken = res;
          return;
        }
        this.toast('bottom', `Oops! Token não foi gerado.`);
      },
    });
  }

  async toast(position: 'top' | 'middle' | 'bottom', message?: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  public set subscriptionToken(value: any) {
    if (typeof value !== 'string') return;
    if (value === '') {
      localStorage.removeItem('subscription_token');
    } else {
      localStorage.setItem('subscription_token', value);
    }
  }
  public get subscriptionToken(): string {
    return localStorage.getItem('subscription_token') || '';
  }
}
