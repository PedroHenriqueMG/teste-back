import { compare } from 'bcrypt';
import { CustomerRepositoryInMemory } from '../../repositories/CustomerRepositoryInMemory';
import { CreateCustomerUseCase } from './createCustomerUseCase';
import { makeCustomer } from '../../factories/customerFactory';
import { CustomerWithSameEmailException } from '../../exceptions/CustomerWithSameEmailException';

let createCustomerUseCase: CreateCustomerUseCase;
let customerRepositoryInMemory: CustomerRepositoryInMemory;

describe('Create Customer', () => {
  beforeEach(() => {
    customerRepositoryInMemory = new CustomerRepositoryInMemory();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepositoryInMemory);
  });

  it('Should be able to create customer', async () => {
    expect(customerRepositoryInMemory.customers).toEqual([]);

    const user = await createCustomerUseCase.execute({
      email: 'email@email.com',
      name: 'Vitor',
      password: '123123',
    });

    expect(customerRepositoryInMemory.customers).toEqual([user]);
  });

  it('Should be able to create customer with password encrypted', async () => {
    const userPasswordWithoutEncryption = '123123';

    const user = await createCustomerUseCase.execute({
      email: 'email@email.com',
      name: 'Vitor',
      password: userPasswordWithoutEncryption,
    });

    const userHasPasswordEncrypted = await compare(
      userPasswordWithoutEncryption,
      user.password,
    );

    expect(userHasPasswordEncrypted).toBeTruthy();
  });

  it('Should be able to thorw error when create user with already exist email', () => {
    const customer = makeCustomer({});

    customerRepositoryInMemory.customers = [customer];

    expect(
      async () =>
        await createCustomerUseCase.execute({
          email: customer.email,
          name: 'vitor',
          password: '123123',
        }),
    ).rejects.toThrowError(CustomerWithSameEmailException);
  });
});
