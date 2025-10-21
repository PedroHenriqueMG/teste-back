import { Customer } from '../../../../../modules/customer/entities/Customer';
import { Customer as CustomerRaw } from '@prisma/client';

export class PrismaCustomerMapper {
  static toPrisma({
    createdAt,
    email,
    name,
    document,
    phone,
    id,
    updatedAt,
  }: Customer): CustomerRaw {
    return {
      updatedAt,
      createdAt,
      email,
      name,
      document,
      phone,
      id,
    };
  }

  static toDomain({
    id,
    createdAt,
    email,
    name,
    document,
    phone,
    updatedAt,
  }: CustomerRaw): Customer {
    return new Customer(
      {
        updatedAt,
        createdAt,
        email,
        name,
        document,
        phone,
  },
  id,
    );
  }
}
