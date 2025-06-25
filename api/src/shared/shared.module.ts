import { Module } from '@nestjs/common';
import { PipesModule } from './pipes/pipes.module';


@Module({
    imports: [
        PipesModule,
    ],
    providers: [],
    exports: [
        PipesModule,
    ],
})
export class SharedModule { }
