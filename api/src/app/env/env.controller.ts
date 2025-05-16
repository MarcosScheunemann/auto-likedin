import {
    Body,
    Controller,
    Get,
    Param,
    Post,
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
    @Post('token/g-news')
    async gNews(@Body() b: {token: string}) {
        this.env.gnews = b.token
    }
    @Post('token/openai')
    async openai(@Body() b: {token: string}) {
        this.env.openAi = b.token
    }
}
