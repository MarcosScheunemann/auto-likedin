import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [ReactiveFormsModule, HttpClientModule],
  exports: [ReactiveFormsModule],
  providers: [],
})
export class SharedModule {}
