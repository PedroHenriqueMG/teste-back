import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { CustomerModule } from './infra/http/modules/customer/customer.module';
import { ChargeModule } from './infra/http/modules/charge/charge.module';
@Module({
  imports: [DatabaseModule, CustomerModule, ChargeModule],
  controllers: [],
})
export class AppModule {}
