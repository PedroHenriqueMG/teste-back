import { Charge } from 'src/modules/charge/entities/Charge';

export class ChargeViewModel {
  static toHttp({
    amountParcel,
    coin,
    createdAt,
    custumer_id,
    id,
    paymentType,
    status,
    updatedAt,
    value,
    validateDate,
  }: Charge) {
    return {
      id,
      custumer_id,
      paymentType,
      value,
      coin,
      amountParcel,
      createdAt,
      status,
      updatedAt,
      validateDate,
    };
  }
}
