import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { EnvService } from '../../app/env/env.service';

@Injectable()
export class TokenValidGuard implements CanActivate {
    constructor(
        private readonly envService: EnvService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let token = this.envService.getToken()
        if (token) {
            try {
                token = await this.envService.getCredentials(token)
            } catch (error) {
                throw new UnauthorizedException('Server Error')
            }
            if (!token) {
                throw new UnauthorizedException('Token inválido')
            }
            return true
        }
        throw new UnauthorizedException('Sem Token')
    }
}
