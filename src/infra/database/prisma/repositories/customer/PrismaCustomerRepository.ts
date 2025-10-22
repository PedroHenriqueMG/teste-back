import { Customer } from 'src/modules/customer/entities/Customer';
import { CustomerRepository } from 'src/modules/customer/repositories/CustomerRepository';
import { Injectable } from '@nestjs/common';
import { PrismaCustomerMapper } from '../../mappers/customer/PrismaCustomerMapper';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    const userRaw = PrismaCustomerMapper.toPrisma(customer);

    await this.prisma.customer.create({
      data: userRaw,
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (!customer) return null;

    return PrismaCustomerMapper.toDomain(customer);
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany();

    return customers.map((customer) => PrismaCustomerMapper.toDomain(customer));
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) return null;

    return PrismaCustomerMapper.toDomain(customer);
  }

  async update(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer);

    await this.prisma.customer.update({
      where: {
        id: customer.id,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
