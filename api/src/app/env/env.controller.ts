import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { EnvService, GenerateTokenDTO } from './env.service';

@UseGuards()
@Controller()
export class EnvController {
    constructor(
        private readonly env: EnvService
    ) { }

    @Get('token/:token')
    async execute(@Param() p: { token: string }) {
        await this.env.getCredentials(p.token)
    }

    @Post('token/generate')
    async genToken(@Body() obj: GenerateTokenDTO): Promise<string | undefined> {
        return await this.env.generateToken(obj)
    }

    @Post('token/g-news')
    async gNews(@Body() b: { token: string }) {
        this.env.gnews = b.token
        return 'Token GNews atualizado com sucesso!'
    }

    @Post('token/openai')
    async openai(@Body() b: { token: string }) {
        this.env.openAi = b.token
        return 'Token OpenAi atualizado com sucesso!'
    }
}
