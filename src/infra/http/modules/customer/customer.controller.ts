import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../../../modules/customer/useCases/createCustomerUseCase/createCustomerUseCase';
import { CreateCustomerBody } from './dtos/createCustomerBody';
import { CustomerViewModel } from './viewModel/customerViewModel';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('costumers')
@Controller('costumers')
export class CustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  async createCustomer(@Body() body: CreateCustomerBody) {
    const { email, name, password } = body;

    const user = await this.createCustomerUseCase.execute({
      email,
      name,
      password,
    });

    return CustomerViewModel.toHttp(user);
  }
}
