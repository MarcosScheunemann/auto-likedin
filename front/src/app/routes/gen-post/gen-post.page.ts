import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IIonic } from '../services/general/dto/ionic';

@Component({
  selector: 'app-gen-post',
  templateUrl: './gen-post.page.html',
  styleUrls: ['./gen-post.page.scss'],
  standalone: true,
  imports: [...IIonic]
})
export class GenPostPage implements OnInit {
  public form: FormGroup | null;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      inspiration: ['', Validators.required],
      topic: ['', Validators.required],
      clientRole: ['', Validators.required],
      sendDirect: [false],
    });
  }

  ngOnInit() {

  }

  generate(): void {
    if (this.form && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form?.value;
    // TODO: Implement the generation logic or emit an event.
    console.log('Generate post with: ', payload);
  }

}
