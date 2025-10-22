import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class CustomerNotFoundException extends AppException {
  constructor() {
    super({
      message: 'Cliente não encontrado',
      status: HttpStatus.NOT_FOUND,
    });
  }
}
