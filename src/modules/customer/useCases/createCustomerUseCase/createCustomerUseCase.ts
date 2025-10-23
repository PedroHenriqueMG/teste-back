import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { hash } from 'bcrypt';
import { CustomerWithSameEmail } from '../../exceptions/CustomerWithSameEmail';
import { CreateCustomerBody } from 'src/infra/http/modules/customer/dtos/createCustomerBody';
import { CustomerWithSameDocument } from '../../exceptions/CustomerWithSameDocument';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({ email, name, document, phone }: CreateCustomerBody) {
    const customerAlreadyExist =
      await this.customerRepository.findByEmail(email);

    if (customerAlreadyExist?.document === document)
      throw new CustomerWithSameDocument();

    if (customerAlreadyExist) throw new CustomerWithSameEmail();

    const customer = new Customer({
      email,
      name,
      document: await hash(document, 10),
      phone,
    });

    await this.customerRepository.create(customer);

    return customer;
  }
}
