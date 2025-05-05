import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import { EnvService } from './env.service';

@UseGuards()
@Controller()
export class EnvController {
    constructor(
        private readonly env: EnvService
    ) { }

    @Get('token/:token')
    async execute(@Param() p: any) {
        this.env.getCredentials(p.token)
    }
}
