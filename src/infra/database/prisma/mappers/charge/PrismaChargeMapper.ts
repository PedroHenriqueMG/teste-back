import { Charge as ChargeRaw } from '@prisma/client';
import { Charge } from 'src/modules/charge/entities/Charge';

export class PrismaChargeMapper {
  static toPrisma({
    createdAt,
    coin,
    custumer_id,
    paymentType,
    status,
    amountParcel,
    validateDate,
    value,
    id,
    updatedAt,
  }: Charge): ChargeRaw {
    return {
      updatedAt,
      createdAt,
      coin,
      custumer_id,
      paymentType,
      status,
      value,
      amountParcel,
      validateDate,
      id,
    };
  }

  static toDomain({
    id,
    createdAt,
    coin,
    custumer_id,
    paymentType,
    status,
    value,
    amountParcel,
    validateDate,
    updatedAt,
  }: ChargeRaw): Charge {
    return new Charge(
      {
        createdAt,
        coin,
        custumer_id,
        paymentType,
        status,
        value,
        amountParcel,
        validateDate,
        updatedAt,
      },
      id,
    );
  }
}
