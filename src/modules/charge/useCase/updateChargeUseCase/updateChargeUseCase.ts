import { Injectable } from '@nestjs/common';
import { UpdateChargeBody } from 'src/infra/http/modules/charge/dtos/updateChargeBody';
import { ChargeRepository } from '../../repositories/ChargeRepository';
import { Charge } from '../../entities/Charge';
import { ChargeNotFoundException } from '../../exceptions/ChargeNotFound';

@Injectable()
export class UpdateChargeUseCase {
  constructor(private chargeRepository: ChargeRepository) {}

  async execute({ status }: UpdateChargeBody, id: string) {
    const charge = await this.chargeRepository.findById(id);

    if (!charge) throw new ChargeNotFoundException();

    const updatedCharge = new Charge(
      {
        status,
        custumer_id: charge.custumer_id,
        coin: charge.coin,
        paymentType: charge.paymentType,
        amountParcel: charge.amountParcel,
        validateDate: charge.validateDate,
        value: charge.value,
        createdAt: charge.createdAt,
      },
      id,
    );

    await this.chargeRepository.update(updatedCharge);

    return updatedCharge;
  }
}
