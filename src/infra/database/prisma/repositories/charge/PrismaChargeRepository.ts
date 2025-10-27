import { Injectable } from '@nestjs/common';
import { ChargeRepository } from 'src/modules/charge/repositories/ChargeRepository';
import { PrismaChargeMapper } from '../../mappers/charge/PrismaChargeMapper';
import { PrismaService } from '../../prisma.service';
import { Charge } from 'src/modules/charge/entities/Charge';

@Injectable()
export class PrismaChargeRepository implements ChargeRepository {
  constructor(private prisma: PrismaService) {}

  async create(charge: Charge): Promise<void> {
    const chargeRaw = PrismaChargeMapper.toPrisma(charge);

    await this.prisma.charge.create({
      data: chargeRaw,
    });
  }

  async findAllCustomerId(customerId: string): Promise<Charge[]> {
    const charges = await this.prisma.charge.findMany({
      where: {
        custumer_id: customerId,
      },
    });

    return charges.map((charge) => PrismaChargeMapper.toDomain(charge));
  }

  async findById(id: string): Promise<Charge | null> {
    const charge = await this.prisma.charge.findUnique({
      where: {
        id,
      },
    });

    if (!charge) return null;

    return PrismaChargeMapper.toDomain(charge);
  }

  async update(charge: Charge): Promise<void> {
    const data = PrismaChargeMapper.toPrisma(charge);

    await this.prisma.charge.update({
      where: {
        id: charge.id,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.charge.delete({
      where: {
        id,
      },
    });
  }
}
