import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import open from 'open';
import * as dotenv from 'dotenv';
import { EnvService } from '../../env/env.service';
dotenv.config();
@Injectable()
export class LinkedInAuthService {
  private isAuthenticating = false;
  constructor(private readonly envService: EnvService) { }

  public async execute(code?: string): Promise<boolean> {
    if (await this.ensureAuthenticated()) {
      return true;
    }
    if (code) {
      return await this.fetchAccessToken(code);
    }
    return true;
  }

  private async openAuthUrl(): Promise<void> {
    if (this.isAuthenticating) {
      return;
    }
    this.isAuthenticating = true;
    const { clientId, redirectUri } = this.envService.getLinkedInCredentials();
    try {
      // Permissão para postar no perfil pessoal
      const scopeList = [
        'email',
        'openid',
        'profile',
        'r_1st_connections_size',
        'r_ads',
        'r_ads_reporting',
        'r_basicprofile',
        'r_events',
        'r_organization_admin',
        'r_organization_social',
        'rw_ads',
        'rw_events',
        'rw_organization_admin',
        'w_member_social',
        'w_organization_social',
      ];
      const scope = encodeURIComponent(scopeList.join(' '));

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}&state=qualquercoisa&scope=${scope}`;

      await open(authUrl);
      throw new BadRequestException(
        'Não é nessa chamada que deverá acontecer a postagem, e sim na de callback!',
      );
    } catch (error: any) {
      throw error;
    }
  }

  private async fetchAccessToken(code: string): Promise<any> {
    const { clientId, clientSecret, redirectUri } = this.envService.getLinkedInCredentials();
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const { access_token, expires_in, refresh_token } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      this.envService.updateEnvFile({
        LINKEDIN_ACCESS_TOKEN: access_token,
        LINKEDIN_REFRESH_TOKEN: refresh_token,
        LINKEDIN_EXPIRES_AT: expiresAt.toString(),
      });

      return true;
    } catch (error: any) {
      console.error(
        'Erro ao buscar informações do usuário:',
        error.response?.data || error.message,
      );
      throw error;
    } finally {
      this.isAuthenticating = false;
    }
  }

  private async refreshAccessToken() {
    const { clientId, clientSecret } = this.envService.getLinkedInCredentials();
    const refreshToken = this.envService.getEnvs().linkedinRefreshToken;
    try {
      if (!refreshToken) {
        await this.openAuthUrl();
        return false;
      }

      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token, expires_in, refresh_token } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      this.envService.updateEnvFile({
        LINKEDIN_ACCESS_TOKEN: access_token,
        LINKEDIN_REFRESH_TOKEN: refresh_token,
        LINKEDIN_EXPIRES_AT: expiresAt.toString(),
      });

      return true;
    } catch (error: any) {
      throw error;
    }
  }
  private async ensureAuthenticated() {
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        return false;
      }
    }
    const accessToken = this.envService.getEnvs().linkedinAccessToken;
    if (!accessToken) {
      await this.openAuthUrl();
      return false;
    }

    return true;
  }

  public isTokenExpired(): boolean {
    const expiresAt = parseInt(this.envService.getEnvs().linkedinExpiresAt || '0', 10,);
    if (!expiresAt) {
      return true
    }
    return Date.now() >= expiresAt;
  }
}
