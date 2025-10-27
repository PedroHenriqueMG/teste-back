import { ApiProperty } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { IsNotEmptyCustom } from 'src/infra/http/classValidator/decorators/IsNotEmptyCustom';
import { IsChargeStatusCustom } from 'src/infra/http/classValidator/decorators/isChargeStatus';

export class UpdateChargeBody {
  @IsNotEmptyCustom()
  @IsChargeStatusCustom()
  @ApiProperty()
  status: ChargeStatus;
}
