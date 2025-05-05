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

@UseGuards(HasEnvGuard)
@Controller('ia')
export class IaController {
    constructor(
        private readonly iaService: IaService,
        private readonly linkd: LinkedInService
    ) { }

    @Post('make-text')
    async execute(@Body() b?: MakeTextDto): Promise<string> {
        const res = await this.iaService.makeText(b?.topic, b?.inspiration, b?.job);
        if (!b?.direct) {
            return res
        }
        await this.linkd.makePost(res)
        return 'OK'
    }
}
