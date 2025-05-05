// home.page.ts – componente standalone corrigido (Ionic 8 + Angular 17)
// Inclui todos os componentes Ionic usados, ReactiveFormsModule e CommonModule.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonToggle,
  IonTextarea,
} from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';
import { ApiGeneralService } from '../api/api-general.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Ionic standalone components usados no template
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonToggle,
    IonTextarea,
  ],
})
export class HomePage implements OnInit {
  tokenForm!: FormGroup;
  textForm!: FormGroup;
  keysForm!: FormGroup;

  tokenStatus: boolean | null = null;
  linkedinStatus: boolean | null = null;
  generatedText: string | null = null;
  keysSaved = false;

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiGeneral: ApiGeneralService
  ) {}

  ngOnInit(): void {
    this.tokenForm = this.fb.group({
      token: ['', Validators.required],
    });

    this.textForm = this.fb.group({
      topic: ['', Validators.required],
      inspiration: [''],
      job: [''],
      direct: [true],
    });

    this.keysForm = this.fb.group({
      openaiKey: ['', Validators.required],
      linkedinKey: ['', Validators.required],
    });

    // Pré‑carrega chaves locais, se existirem
    this.keysForm.patchValue({
      openaiKey: localStorage.getItem('openaiKey') || '',
      linkedinKey: localStorage.getItem('linkedinKey') || '',
    });
  }

  // ---------------------------------------------------------------------
  validateToken(): void {
    if (this.tokenForm.invalid) return;

    const { token } = this.tokenForm.value;
    this.http
      .post<{ valid: boolean }>(`${this.apiUrl}/auth/validate`, { token })
      .subscribe({
        next: (res) => (this.tokenStatus = res.valid),
        error: () => (this.tokenStatus = false),
      });
  }

  // ---------------------------------------------------------------------
  generateText(): void {
    if (this.textForm.invalid) return;

    this.apiGeneral.makeText(this.textForm.value).subscribe({
      next: (text) => (this.generatedText = text),
      error: () => (this.generatedText = 'Erro ao gerar texto :('),
    });
  }

  // ---------------------------------------------------------------------
  checkLinkedin(): void {
    this.apiGeneral.hasLinkedin().subscribe({
      next: (ok) => (this.linkedinStatus = ok),
      error: () => (this.linkedinStatus = false),
    });
  }

  // ---------------------------------------------------------------------
  saveKeys(): void {
    if (this.keysForm.invalid) return;

    const { openaiKey, linkedinKey } = this.keysForm.value;
    localStorage.setItem('openaiKey', openaiKey);
    localStorage.setItem('linkedinKey', linkedinKey);
    this.keysSaved = true;

    // Opcional: envia ao backend para armazenamento seguro
    this.http
      .post(`${this.apiUrl}/user/api-keys`, { openaiKey, linkedinKey })
      .subscribe();
  }
}
