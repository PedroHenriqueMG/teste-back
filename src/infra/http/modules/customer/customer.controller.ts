import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../../../../modules/customer/useCases/createCustomerUseCase/createCustomerUseCase';
import { CreateCustomerBody } from './dtos/createCustomerBody';
import { CustomerViewModel } from './viewModel/customerViewModel';
import { ApiTags } from '@nestjs/swagger';
import { GetAllCustomerUseCase } from 'src/modules/customer/useCases/getAllCustomerUseCase/getAllCustomerUseCase';
import { UpdateCustomerBody } from './dtos/updateCustomerBody';
import { UpdateCustomerUseCase } from 'src/modules/customer/useCases/updateCustomerUseCase/updateCustomerUseCase';
import { DeleteCustomerUseCase } from 'src/modules/customer/useCases/deleteCustomerUseCase/deleteCustomerUseCase';
import { GetUniqueCustomerUseCase } from 'src/modules/customer/useCases/getUniqueCustomerUseCase/getUniqueCustomerUseCase';

@ApiTags('costumers')
@Controller('costumers')
export class CustomerController {
  constructor(
    private createCustomerUseCase: CreateCustomerUseCase,
    private getAllCustomerUseCase: GetAllCustomerUseCase,
    private getUniqueCustomerUseCase: GetUniqueCustomerUseCase,
    private updateCustomerUseCase: UpdateCustomerUseCase,
    private deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  async createCustomer(@Body() body: CreateCustomerBody) {
    const { email, name, document, phone } = body;

    const customer = await this.createCustomerUseCase.execute({
      email,
      name,
      document,
      phone,
    });

    return CustomerViewModel.toHttp(customer);
  }

  @Get()
  async getAllCustomer() {
    const customer = await this.getAllCustomerUseCase.execute();

    return customer.map((customer) => CustomerViewModel.toHttp(customer));
  }

  @Get('/:id')
  async getUniqueCustomer(@Param('id') id: string) {
    const customer = await this.getUniqueCustomerUseCase.execute(id);

    return CustomerViewModel.toHttp(customer);
  }

  @Patch('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerBody,
  ) {
    const { email, name, document, phone } = body;

    const customer = await this.updateCustomerUseCase.execute(
      {
        email,
        name,
        document,
        phone,
      },
      id,
    );

    return CustomerViewModel.toHttp(customer);
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string) {
    const customer = await this.deleteCustomerUseCase.execute(id);

    return CustomerViewModel.toHttp(customer);
  }
}
