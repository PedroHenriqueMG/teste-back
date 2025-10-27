import { ApiProperty } from '@nestjs/swagger';

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
