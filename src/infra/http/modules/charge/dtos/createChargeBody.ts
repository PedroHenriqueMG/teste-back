import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { IsNotEmptyCustom } from 'src/infra/http/classValidator/decorators/IsNotEmptyCustom';
import { IsStringCustom } from 'src/infra/http/classValidator/decorators/IsStringCustom';
import { IsPaymentTypeCustom } from 'src/infra/http/classValidator/decorators/IsPaymentTypeCustom';
import { IsIntCustom } from 'src/infra/http/classValidator/decorators/IsIntCustom';
import { IsDateCustom } from 'src/infra/http/classValidator/decorators/IsDateCustom';
import { IsRequiredWhenPaymentType } from 'src/infra/http/classValidator/decorators/IsRequiredWhenPaymentType';

export class CreateChargeBody {
  @IsStringCustom()
  @IsNotEmptyCustom()
  @ApiProperty()
  customerId: string;

  @IsStringCustom()
  @IsNotEmptyCustom()
  @ApiProperty()
  coin: string;

  @IsIntCustom()
  @IsNotEmptyCustom()
  @ApiProperty()
  value: number;

  @IsPaymentTypeCustom()
  @IsNotEmptyCustom()
  @ApiProperty()
  paymentType: PaymentType;

  @IsRequiredWhenPaymentType(PaymentType.creditCard)
  @ApiProperty({ required: false })
  amountParcel?: number;

  @IsDateCustom()
  @IsRequiredWhenPaymentType(PaymentType.bankSlip)
  @ApiProperty({ required: false })
  validateDate?: Date;
}
