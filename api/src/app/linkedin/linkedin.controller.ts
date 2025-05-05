import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { LinkedInService } from './linkedin.service';
import { HasEnvGuard } from '../../shared/guards/env.guard';

@UseGuards(HasEnvGuard)
@Controller('linkedin')
export class LikedInController {
    constructor(
        private readonly linkedInService: LinkedInService
    ) { }

    @Get('can-pass')
    async execute(): Promise<boolean> {
        return await this.linkedInService.canPass()
    }
    
    @Get('callback')
    async getCallback(@Query('code') code: string): Promise<boolean> {
        if (!code) {
            throw new BadRequestException('❌ Código de autorização ausente!');
        }
        return await this.linkedInService.canPass(code)
    }
    
    @Post('make-post')
    async makePost(@Body() b: { text: string }) {
        return await this.linkedInService.makePost(b.text)
    }
}
