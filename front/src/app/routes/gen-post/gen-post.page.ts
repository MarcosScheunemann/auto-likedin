import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ISharedImports } from '../services/general/dto/shared-imports';
import { MakeTextDto } from '../services/general/dto/makeTextDto';
import { GeneralService } from '../services/general/generate.service';

@Component({
  standalone: true,
  selector: 'app-gen-post',
  templateUrl: './gen-post.page.html',
  styleUrls: ['./gen-post.page.scss'],
  imports: [...ISharedImports]
})
export class GenPostPage implements OnInit {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private readonly generalService: GeneralService

  ) {
    this.form = this.createFromGroup()
  }
  private createFromGroup(): FormGroup {
    return this.fb.group({
      inspiration: [''],
      topic: [''],
      clientRole: [''],
      sendDirect: [false],
    });
  }

  ngOnInit() {

  }

  public generate(): void {
    this.form.markAllAsTouched();
    const { inspiration, topic, clientRole, sendDirect } = this.form?.value;
    const dto: MakeTextDto = {
      inspiration,
      topic,
      job: clientRole,
      direct: sendDirect
    }
    this.generalService.makeText(dto).subscribe(
      {
        next: (res) => (
          console.log('Feita a response -->', res)
        ),
        error: (err) => (
          console.log('Deu erro -->', err)
        )
      }
    )
  }

}
