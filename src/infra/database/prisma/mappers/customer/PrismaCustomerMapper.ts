import { Customer } from '../../../../../modules/customer/entities/Customer';
import { User as UserRaw } from '@prisma/client';

export class PrismaCustomerMapper {
  static toPrisma({
    createdAt,
    email,
    name,
    password,
    id,
    updatedAt,
  }: Customer): UserRaw {
    return {
      updatedAt,
      createdAt,
      email,
      name,
      password,
      id,
    };
  }

  static toDomain({
    id,
    createdAt,
    email,
    name,
    password,
    updatedAt,
  }: UserRaw): Customer {
    return new Customer(
      {
        updatedAt,
        createdAt,
        email,
        name,
        password,
      },
      id,
    );
  }
}
