import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { hash } from 'bcrypt';
import { CustomerWithSameEmailException } from '../../exceptions/CustomerWithSameEmailException';
import { CreateCustomerBody } from 'src/infra/http/modules/customer/dtos/createCustomerBody';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute({ email, name, password }: CreateCustomerBody) {
    const customerAlreadyExist = await this.customerRepository.findByEmail(email);

    if (customerAlreadyExist) throw new CustomerWithSameEmailException();

    const customer = new Customer({
      email,
      name,
      password: await hash(password, 10),
    });

    await this.customerRepository.create(customer);

    return customer;
  }
}
