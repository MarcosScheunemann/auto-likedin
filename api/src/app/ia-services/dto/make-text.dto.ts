import { IsOptional } from "class-validator";

export class MakeTextDto {
    @IsOptional()
    topic?: string;
    @IsOptional()
    inspiration?: string
    @IsOptional()
    job?: string
}