import { Injectable } from '@nestjs/common';
import { ChargeRepository } from '../../repositories/ChargeRepository';

@Injectable()
export class GetAllChargeUseCase {
  constructor(private chargeRepository: ChargeRepository) {}

  async execute(customerId: string) {
    const customerCharge =
      await this.chargeRepository.findAllCustomerId(customerId);

    return customerCharge;
  }
}
