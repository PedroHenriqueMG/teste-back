import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { CustomerModule } from './infra/http/modules/customer/customer.module';
@Module({
  imports: [
    DatabaseModule,
    CustomerModule,
  ],
  controllers: [],
})
export class AppModule {}
