import { Module } from '@nestjs/common';
import { CamelcasePipe } from './camelcase.transform';
import { DecamelizePipe } from './decamelize.pipe';

@Module({
    providers: [CamelcasePipe, DecamelizePipe],
    exports: [CamelcasePipe, DecamelizePipe],
})
export class PipesModule {}
