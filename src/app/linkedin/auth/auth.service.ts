import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import open from 'open';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class LinkedInAuthService {
  public accessToken: string;
  private refreshToken: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private expiresAt: number; // Timestamp de expiração do token
  private isAuthenticating = false;

  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || '';
    this.refreshToken = process.env.LINKEDIN_REFRESH_TOKEN || '';
    this.clientId = process.env.LINKEDIN_CLIENT_ID || '';
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI || '';
    this.expiresAt = parseInt(process.env.LINKEDIN_EXPIRES_AT || '0', 10);
  }

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

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
        this.redirectUri,
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
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const { access_token, expires_in, refresh_token } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      this.updateEnvFile({
        LINKEDIN_ACCESS_TOKEN: access_token,
        LINKEDIN_REFRESH_TOKEN: refresh_token,
        LINKEDIN_EXPIRES_AT: expiresAt.toString(),
      });
      this.accessToken = access_token;
      this.refreshToken = refresh_token;
      this.expiresAt = expiresAt;

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
    try {
      if (!this.refreshToken) {
        await this.openAuthUrl();
        return false;
      }

      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token, expires_in, refresh_token } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      this.updateEnvFile({
        LINKEDIN_ACCESS_TOKEN: access_token,
        LINKEDIN_REFRESH_TOKEN: refresh_token,
        LINKEDIN_EXPIRES_AT: expiresAt.toString(),
      });

      this.accessToken = access_token;
      this.refreshToken = refresh_token;
      this.expiresAt = expiresAt;

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
    if (!this.accessToken) {
      await this.openAuthUrl();
      return false;
    }

    return true;
  }

  public isTokenExpired(): boolean {
    if (!this.expiresAt){
      return true
    }
    return Date.now() >= this.expiresAt; 
  }

  public updateEnvFile(updatedValues: Record<string, string>): void {
    const envPath = '.env';

    let envContent = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, 'utf8')
      : '';

    Object.keys(updatedValues).forEach((key) => {
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${updatedValues[key]}`);
      } else {
        envContent += `\n${key}=${updatedValues[key]}`;
      }
    });

    fs.writeFileSync(envPath, envContent.trim(), 'utf8');
  }
}
