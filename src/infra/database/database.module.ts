import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CustomerRepository } from 'src/modules/customer/repositories/CustomerRepository';
import { PrismaCustomerRepository } from './prisma/repositories/customer/PrismaCustomerRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
  exports: [CustomerRepository],
})
export class DatabaseModule {}
