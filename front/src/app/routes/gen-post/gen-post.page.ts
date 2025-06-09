import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ISharedImports } from '../services/general/dto/shared-imports';
import { MakeTextDto } from '../services/general/dto/makeTextDto';
import { GeneralService } from '../services/general/generate.service';
import { finalize } from 'rxjs';
import { IonSegment } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-gen-post',
  templateUrl: './gen-post.page.html',
  styleUrls: ['./gen-post.page.scss'],
  imports: ISharedImports
})
export class GenPostPage implements OnInit {
  public form: FormGroup;
  public generatedText: string = '';
  public loading: boolean = false
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
    this.loading = true
    this.generalService.makeText(dto)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        {
          next: (res) => (
            console.log('Feita a response -->', res),
            this.generatedText = res
          ),
          error: (err) => (
            console.log('Deu erro -->', err),
            this.generatedText = err?.message || "Ocorreu um erro desconhecido, Tente novamente"
          )
        }
      )
  }

}
