import { Customer } from '../entities/Customer';

type Override = Partial<Customer>;

export const makeCustomer = ({ id, ...override }: Override = {}) => {
  return new Customer(
    {
      email: 'email@gmail.com',
      name: 'Vitor',
      password: '123123',
      ...override,
    },
    id,
  );
};
