import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    // #region Public Methods (1)

    public catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = exception.getStatus ? exception.getStatus() : 500;
        let message: any = exception.message;

        // Para BadRequestException
        if (exception instanceof BadRequestException) {
            message = exception.getResponse();
            if (typeof message === 'object' && message.message) {
                message = message.message;
            }
        }
        // Caso a mensagem seja um Array (normalmente de erros de validação)
        else if (message instanceof Array) {
            message = message.map(element => element.constraints[Object.keys(element.constraints)[0]]).join('; ');
        }
        // Outras exceções
        else if (typeof message !== 'string') {
            if (message.message && message.message instanceof Array) {
                message = message.message.map((element: any) => element.constraints[Object.keys(element.constraints)[0]]).join('; ');
            } else {
                message = message.message || message.error;
            }
        }
        // Para AxiosError
        else if ((exception as any as AxiosError).isAxiosError) {
            status = (exception as any as AxiosError).response?.status ?? 500;
            const data: any = (exception as any as AxiosError).response?.data ?? {};
            if (data.message) {
                message += ' - ' + data.message;
            }
            if (data.errors) {
                message = data.errors;
            }
        }

        response.status(status).json({
            status,
            message,
        });
    }

    // #endregion Public Methods (1)
}
