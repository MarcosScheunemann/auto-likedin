import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { HasEnvGuard } from '../../shared/guards/env.guard';
import { IaService } from './ia.services';
import { MakeTextDto } from './dto/make-text.dto';
import { LinkedInService } from '../linkedin/linkedin.service';
import { TokenValidGuard } from '../../shared/guards/token-valid.guard';
import { factoryEnvelope, IEnvelope } from 'scheunemann-interfaces';

@UseGuards(HasEnvGuard, TokenValidGuard)
@Controller('ia')
export class IaController {
    constructor(
        private readonly iaService: IaService,
        private readonly linkd: LinkedInService
    ) { }

    @Post('make-text')
    async execute(@Body() b?: MakeTextDto): Promise<IEnvelope<string>> {
        const res = await this.iaService.makeText(b?.topic, b?.inspiration, b?.job);
        if (!b?.direct) {
            return factoryEnvelope(res)
        }
        await this.linkd.makePost(res)
        return factoryEnvelope('OK')
    }
}
