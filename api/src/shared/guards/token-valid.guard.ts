import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { EnvService } from '../../app/env/env.service';

@Injectable()
export class TokenValidGuard implements CanActivate {
    constructor(
        private readonly envService: EnvService
    ) { }
    canActivate(context: ExecutionContext): boolean {
        const token = this.envService.getToken()
        return !!token
    }
}
