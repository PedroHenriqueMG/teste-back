import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/exceptions/appException';

export class UnauthorizedWithoutPermissiondException extends AppException {
  constructor() {
    super({
      message: 'Usuário sem permissão para realizar essa ação',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
