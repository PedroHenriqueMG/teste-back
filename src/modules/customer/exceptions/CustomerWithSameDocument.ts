import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class CustomerWithSameDocument extends AppException {
  constructor() {
    super({
      message: 'Documento já cadastrado',
      status: HttpStatus.CONFLICT,
    });
  }
}
