import { Customer } from '../entities/Customer';

type Override = Partial<Customer>;

export const makeCustomer = ({ id, ...override }: Override = {}) => {
  return new Customer(
    {
      email: 'email@gmail.com',
      name: 'Vitor',
      document: '123.456.789-01',
      phone: "12345678901",
      ...override,
    },
    id,
  );
};
