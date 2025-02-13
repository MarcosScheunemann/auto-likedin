import { Module } from '@nestjs/common';
import { PipesModule } from './pipes/pipes.module';
import { CollectionsService } from './firebase/collections.service';


@Module({
    imports: [
        PipesModule,
    ],
    providers: [
        CollectionsService
    ],
    exports: [
        CollectionsService,
        PipesModule,
    ],
})
export class SharedModule { }
