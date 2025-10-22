import { Injectable } from '@nestjs/common';
import { UpdateCustomerBody } from 'src/infra/http/modules/customer/dtos/updateCustomerBody';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { CustomerNotFoundException } from '../../exceptions/CustomerNotFound';
import { Customer } from '../../entities/Customer';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    { document, email, name, phone }: UpdateCustomerBody,
    id: string,
  ) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new CustomerNotFoundException();

    const updateCustomer = new Customer(
      {
        document: document || customer.document,
        email: email || customer.email,
        name: name || customer.name,
        phone: phone || customer.phone,
        createdAt: customer.createdAt,
      },
      id,
    );

    await this.customerRepository.update(updateCustomer);

    return updateCustomer;
  }
}
