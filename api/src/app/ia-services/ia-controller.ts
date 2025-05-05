import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { HasEnvGuard } from '../../shared/guards/env.guard';
import { IaService } from './ia.services';
import { MakeTextDto } from './dto/make-text.dto';

@UseGuards(HasEnvGuard)
@Controller('ia')
export class IaController {
    constructor(
        private readonly iaService: IaService
    ) { }

    @Post('make-text')
    execute(@Body() b?: MakeTextDto): Promise<string> {
        return this.iaService.makeText(b?.topic, b?.inspiration, b?.job);
    }

}
