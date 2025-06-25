import { Injectable, PipeTransform } from '@nestjs/common';
import * as humps from 'humps';

@Injectable()
export class DecamelizePipe implements PipeTransform {
    transform(value: any) {
        if (!value) { return null; }
        if (!this.isObjectOrClass(value)) { return value; }
        const res = humps.decamelizeKeys(value) as any;
        return res;
    }

    private isObjectOrClass(value: any): boolean {
        // Verifica se é um objeto literal
        if (value !== null && typeof value === 'object' && value.constructor === Object) {
            return true;
        }

        // Verifica se é uma função (classe é uma função em JavaScript)
        if (typeof value === 'function') {
            return true;
        }

        // Verifica se é uma instância de alguma classe (excluindo objectos literais e arrays)
        if (value !== null && typeof value === 'object' && value.constructor !== Object && !Array.isArray(value)) {
            return true;
        }

        return false;
    }

}
