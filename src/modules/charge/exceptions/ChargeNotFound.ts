import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class ChargeNotFoundException extends AppException {
  constructor() {
    super({
      message: 'Cobrança não encontrado',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
