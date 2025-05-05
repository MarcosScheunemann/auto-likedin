
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class EnvService {
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

    public getCredentials() {
        // Fazer um axios pra pegar os dados => process.env.LINKEDIN_CLIENT_ID | process.env.LINKEDIN_REDIRECT_URI | process.env.LINKEDIN_CLIENT_SECRET
        const envs = {
            // LINKEDIN_CLIENT_ID: client_id,
            // LINKEDIN_REDIRECT_URI: refresh_token,
            // LINKEDIN_CLIENT_SECRET: expiresAt.toString(),
        }
        this.updateEnvFile(envs)
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


}

