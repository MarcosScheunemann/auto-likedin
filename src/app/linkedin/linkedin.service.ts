import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LinkedInAuthService } from './auth/auth.service';

dotenv.config();
@Injectable()
export class LinkedInService {
  private static hasAlreadyExecuted = false;
  constructor(private readonly linkedinAuthService: LinkedInAuthService) {}

  /**
   * Método principal que executa a postagem.
   * Se nenhum código de autorização for passado, inicia o fluxo OAuth abrindo a URL de autorização.
   * Caso contrário, utiliza o access token já definido para buscar informações do usuário e postar.
   *
   * @param post - Conteúdo a ser postado.
   * @param code - Código de autorização recebido via callback (opcional).
   */
  public async canPass(code?: string): Promise<boolean> {
    let canPass = false;
    const isAutenticated = await this.linkedinAuthService.execute(code);
    if (!LinkedInService.hasAlreadyExecuted && isAutenticated) {
      canPass = true;
      LinkedInService.hasAlreadyExecuted = true;
      setTimeout(() => {LinkedInService.hasAlreadyExecuted = false}, 50000);
    }
    return canPass;
  }
}
