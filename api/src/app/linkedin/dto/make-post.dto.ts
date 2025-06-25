import { IsDefined, IsNotEmpty } from 'class-validator';

export class MakePostDto {
  @IsDefined({ message: '[post] deve ser definido' })
  @IsNotEmpty({ message: '[post] não deve ser vazio' })
  public post: string;
 
  constructor(obj?: MakePostDto) {
    this.post = obj?.post || '';
  }
}