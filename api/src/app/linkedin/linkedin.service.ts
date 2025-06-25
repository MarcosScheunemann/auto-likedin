import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LinkedInAuthService } from './auth/auth.service';
import { EnvService } from '../env/env.service';

dotenv.config();
@Injectable()
export class LinkedInService {
  private static hasAlreadyExecuted = false;
  constructor(
    private readonly envService: EnvService,
    private readonly linkedinAuthService: LinkedInAuthService,
  ) { }

  /**
   * Método principal que executa a postagem.
   * Se nenhum código de autorização for passado, inicia o fluxo OAuth abrindo a URL de autorização.
   * Caso contrário, utiliza o access token já definido para buscar informações do usuário e postar.
   *
   * @param post - Conteúdo a ser postado.
   * @param code - Código de autorização recebido via callback (opcional).
   */
  public async canPass(code?: string): Promise<boolean> {
    if (this.hasInfo() && !this.linkedinAuthService.isTokenExpired()) {
      return true;
    }
    let canPass = false;
    const isAutenticated = await this.linkedinAuthService.execute(code);
    if (!LinkedInService.hasAlreadyExecuted && isAutenticated) {
      canPass = true;
      await this.getInfo();
      LinkedInService.hasAlreadyExecuted = true;
      setTimeout(() => {
        LinkedInService.hasAlreadyExecuted = false;
      }, 50000);
    }
    return canPass;
  }

  private async getInfo(): Promise<void> {

    const auth = `Bearer ${this.envService.getEnvs().linkedinAccessToken}`;
    const url = 'https://api.linkedin.com/v2/userinfo';
    const headers = {
      Authorization: auth,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'Linkedin-Version': 202308,
    };
    try {
      const response = await axios.get(url, { headers });
      const personId = response.data.sub ?? '';
      this.envService.updateEnvFile({ LINKEDIN_PERSON_ID: personId });
    } catch (error: any) {
      if (error.status === 401) {
        await this.linkedinAuthService.execute();
      }
      throw error;
    }
  }

  private hasInfo(): boolean {
    const personId = this.envService.getEnvs().linkedinPersonId
    if (personId) {
      return true;
    }
    return false;
  }

  public async makePost(text: string) {
    const { linkedinAccessToken, linkedinPersonId } = this.envService.getEnvs()
    const canPass = await this.canPass();
    const auth = `Bearer ${linkedinAccessToken}`;
    const author = `urn:li:person:${linkedinPersonId}`;
    const url = 'https://api.linkedin.com/rest/posts';
    const headers = {
      Authorization: auth,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': 202502,
    };
    const body = {
      author,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'DRAFT',
      isReshareDisabledByAuthor: true,
    };
    try {
      if (!canPass) {
        throw new UnauthorizedException('AcessToken Linkendin vencido!');
      }
      //The Post is created with a 201 response and the response header x-restli-id contains the Post ID such as urn:li:share:6844785523593134080 or urn:li:ugcPost:68447855235931240.
      await axios.post(url, body, { headers });
    } catch (error: any) {
      if (error.status === 401) {
        await this.linkedinAuthService.execute();
      }
      throw error;
    }
  }
}
