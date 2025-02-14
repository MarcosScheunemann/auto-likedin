import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { sanitize } from 'class-sanitizer';

@Injectable()
export class SanitizePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            return null;
        }
        if (!this.isObject(value)) {
            return value;
        }
        sanitize(value);
        return value;
    }

    isObject(val: any) {
        if (val === null) {
            return false;
        }
        return typeof val === 'function' || typeof val === 'object';
    }
}
