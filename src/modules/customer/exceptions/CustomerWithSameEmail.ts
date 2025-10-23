import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class CustomerWithSameEmail extends AppException {
  constructor() {
    super({
      message: 'Email já cadastrado',
      status: HttpStatus.CONFLICT,
    });
  }
}
