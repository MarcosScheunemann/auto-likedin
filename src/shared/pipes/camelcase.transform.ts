import { Injectable, PipeTransform } from '@nestjs/common';
import * as humps from 'humps';

@Injectable()
export class CamelcasePipe implements PipeTransform {
    transform(value: any) {
        if (!value) { return null; }
        if (!this.isObject(value)) { return value; }
        return humps.camelizeKeys(value) as any;
    }

    isObject(value: any) {
        return value && typeof value === 'object' && value.constructor === Object;
    }
}
