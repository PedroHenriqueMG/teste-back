import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/CustomerRepository';

@Injectable()
export class GetAllCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute() {
    const customer = await this.customerRepository.findAll();

    return customer;
  }
}
