import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class HasEnvGuard implements CanActivate {
    private readonly requiredEnvVars = [
        { key: 'LINKEDIN_CLIENT_ID', description: 'LinkedIn Client ID' },
        { key: 'LINKEDIN_REDIRECT_URI', description: 'LinkedIn Redirect URI' },
        { key: 'LINKEDIN_CLIENT_SECRET', description: 'LinkedIn Client Secret' },
        { key: 'G_NEWS_API_KEY', description: 'G-News API Key' },
        { key: 'OPENAI_API_KEY', description: 'OpenAI API Key' },
    ]
    logger: Logger;
    constructor() {
        this.logger = new Logger('HasEnvGuard');
    }
    canActivate(context: ExecutionContext): boolean {
        const errors: string[] = [];
        // Verifica se cada variável obrigatória está definida e não está vazia
        for (const env of this.requiredEnvVars) {
            if (!process.env[env.key] || process.env[env.key]?.trim() === '') {
                errors.push(`${env.description} (${env.key}) is missing or empty.`);
            }
        }
        // Se houver erros, loga e lança exceção com a lista completa dos erros
        if (errors.length > 0) {
            const errorMessage = `Missing required environment variables: ${errors.join(' ')}`;
            throw new UnauthorizedException(errorMessage);
        }
        return true
    }
}
