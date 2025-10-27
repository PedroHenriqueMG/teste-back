import { Injectable } from '@nestjs/common';
import { CreateChargeBody } from 'src/infra/http/modules/charge/dtos/createChargeBody';
import { CustomerNotFoundException } from 'src/modules/customer/exceptions/CustomerNotFound';
import { CustomerRepository } from 'src/modules/customer/repositories/CustomerRepository';
import { Charge } from '../../entities/Charge';
import { ChargeRepository } from '../../repositories/ChargeRepository';

@Injectable()
export class CreateChargeUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private chargeRepository: ChargeRepository,
  ) {}

  async execute({
    coin,
    customerId,
    paymentType,
    value,
    amountParcel,
    validateDate,
  }: CreateChargeBody) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) throw new CustomerNotFoundException();

    const chargeRaw = new Charge({
      amountParcel: paymentType === 'creditCard' ? amountParcel ?? null : null,
      coin,
      custumer_id: customerId,
      paymentType,
      validateDate: paymentType === 'bankSlip' ? validateDate ?? null : null,
      value,
    });

    await this.chargeRepository.create(chargeRaw);

    return chargeRaw;
  }
}
