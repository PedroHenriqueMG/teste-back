import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { CustomerNotFoundException } from '../../exceptions/CustomerNotFound';

@Injectable()
export class GetUniqueCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new CustomerNotFoundException();

    return customer;
  }
}
