import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/infra/http/classValidator/decorators/IsEmailCustom';
import { IsOptionalCustom } from 'src/infra/http/classValidator/decorators/isOptional';
import { IsStringCustom } from 'src/infra/http/classValidator/decorators/IsStringCustom';

export class UpdateCustomerBody {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  document?: string;

  @ApiProperty()
  phone?: string;
}
