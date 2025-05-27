
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IsDefined, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import * as fs from 'fs';
import { EDocType } from 'scheunemann-interfaces';

@Injectable()
export class EnvService {
    private apiUrl = 'https://api.com.br'
    constructor() { }
    public getEnvs() {
        const obj = {
            gnewsApiKey: process.env.G_NEWS_API_KEY,
            openAiApiKey: process.env.OPENAI_API_KEY,
            linkedinExpiresAt: process.env.LINKEDIN_EXPIRES_AT,
            linkedinPersonId: process.env.LINKEDIN_PERSON_ID,
            linkedinRefreshToken: process.env.LINKEDIN_REFRESH_TOKEN,
            linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN,
            hasClient: Boolean(
                process.env.LINKEDIN_CLIENT_ID &&
                process.env.LINKEDIN_REDIRECT_URI &&
                process.env.LINKEDIN_CLIENT_SECRET
            )

        }
        return obj
    }

    public async generateToken(obj: GenerateTokenDTO): Promise<string | undefined> {
        const apiUrl = `${this.apiUrl}/subscriptions/generate-token`
        const response = await axios.post<{ token: string }>(apiUrl, obj)
        if (response.data.token) {
            this.token = response.data.token
        }
        return response.data.token
    }

    public async getCredentials(token?: string) {
        let envs = {
            TOKEN: '',
            LINKEDIN_CLIENT_ID: '',
            LINKEDIN_REDIRECT_URI: '',
            LINKEDIN_CLIENT_SECRET: '',
        }
        try {
            if (token) {
                // Fazer um axios pra pegar os dados => process.env.LINKEDIN_CLIENT_ID | process.env.LINKEDIN_REDIRECT_URI | process.env.LINKEDIN_CLIENT_SECRET
                const apiUrl = `${this.apiUrl}/subscriptions/validate-token/${token}`
                const response = await axios.get<{ token: string, clientId: string, redirectUrl: string, secret: string }>(apiUrl)
                envs = {
                    TOKEN: response.data.token || '',
                    LINKEDIN_CLIENT_ID: response.data.clientId || '',
                    LINKEDIN_REDIRECT_URI: response.data.redirectUrl || '',
                    LINKEDIN_CLIENT_SECRET: response.data.secret || '',
                }
            }
            this.updateEnvFile(envs)
            return envs.TOKEN
        } catch (error) {
            this.updateEnvFile(envs)
            throw error
        }
    }

    public getLinkedInCredentials() {
        return {
            clientId: process.env.LINKEDIN_CLIENT_ID || '',
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
            redirectUri: process.env.LINKEDIN_REDIRECT_URI || '',
        };
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

    public get token() {
        return process.env.TOKEN || ''
    }

    public set token(token: string) {
        this.updateEnvFile({ TOKEN: token });
    }
    public set gnews(gnewsApiKey: string) {
        this.updateEnvFile({ G_NEWS_API_KEY: gnewsApiKey });
    }

    public set openAi(gnewsApiKey: string) {
        this.updateEnvFile({ OPENAI_API_KEY: gnewsApiKey });
    }

}
export class GenerateTokenDTO {
    @IsDefined({ message: '[name] Precisa ser informado.' })
    @IsNotEmpty({ message: '[name] Precisa ser informado.' })
    public name: string =''
    @IsDefined({ message: '[email] Precisa ser informado.' })
    @IsNotEmpty({ message: '[email] Precisa ser informado.' })
    public email: string =''
    @IsOptional({ message: '[phoneNumber] Precisa ser informado.' })
    @IsNotEmpty({ message: '[phoneNumber] Precisa ser informado.' })
    public phoneNumber?: string;
    @IsOptional({ message: '[doc] Precisa ser informado.' })
    @IsNotEmpty({ message: '[doc] Precisa ser informado.' })
    public doc?: string;
    @IsOptional({ message: '[docType] Precisa ser informado.' })
    @IsEnum(EDocType, { message: '[docType] Precisa ser informado.' })
    public docType?: EDocType;
    @IsOptional({ message: '[internationalCode] Precisa ser informado.' })
    @IsNotEmpty({ message: '[internationalCode] Precisa ser informado.' })
    public internationalCode?: string;
}

