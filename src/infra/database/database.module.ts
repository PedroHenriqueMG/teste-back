import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CustomerRepository } from 'src/modules/customer/repositories/CustomerRepository';
import { PrismaCustomerRepository } from './prisma/repositories/customer/PrismaCustomerRepository';
import { ChargeRepository } from 'src/modules/charge/repositories/ChargeRepository';
import { PrismaChargeRepository } from './prisma/repositories/charge/PrismaChargeRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: ChargeRepository,
      useClass: PrismaChargeRepository,
    },
  ],
  exports: [CustomerRepository, ChargeRepository],
})
export class DatabaseModule {}
