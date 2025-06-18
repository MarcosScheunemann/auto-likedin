import { EDocType } from 'scheunemann-interfaces';
export class GenerateTokenDto {
  public name: string = '';
  public email: string = '';
  public phoneNumber?: string;
  public doc?: string;
  public docType?: EDocType;
  public internationalCode?: string;
}
