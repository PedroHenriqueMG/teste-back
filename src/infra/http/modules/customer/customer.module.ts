import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CreateCustomerUseCase } from 'src/modules/customer/useCases/createCustomerUseCase/createCustomerUseCase';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [CreateCustomerUseCase],
})
export class CustomerModule {}
