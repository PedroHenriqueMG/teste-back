import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CreateCustomerUseCase } from 'src/modules/customer/useCases/createCustomerUseCase/createCustomerUseCase';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GetAllCustomerUseCase } from 'src/modules/customer/useCases/getAllCustomerUseCase/getAllCustomerUseCase';
import { UpdateCustomerUseCase } from 'src/modules/customer/useCases/updateCustomerUseCase/updateCustomerUseCase';
import { DeleteCustomerUseCase } from 'src/modules/customer/useCases/deleteCustomerUseCase/deleteCustomerUseCase';
import { GetUniqueCustomerUseCase } from 'src/modules/customer/useCases/getUniqueCustomerUseCase/getUniqueCustomerUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    GetAllCustomerUseCase,
    GetUniqueCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
})
export class CustomerModule {}
