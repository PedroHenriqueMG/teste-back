import { Test } from '@nestjs/testing';
import { DeleteCustomerUseCase } from './deleteCustomerUseCase';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { CustomerNotFoundException } from '../../exceptions/CustomerNotFound';
import { hash } from 'bcrypt';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(async () => {
    const mockCustomerRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteCustomerUseCase,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    useCase = moduleRef.get(DeleteCustomerUseCase);
    customerRepository = moduleRef.get(CustomerRepository);
  });

  it('should delete customer when found by ID', async () => {
    const customerId = 'customer-123';
    const existingCustomer = new Customer(
      {
        email: 'john@example.com',
        name: 'John Doe',
        document: await hash('12345678901', 10),
        phone: '12345678901',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      customerId,
    );

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.delete.mockResolvedValue();

    const result = await useCase.execute(customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.delete).toHaveBeenCalledWith(customerId);
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
    expect(customerRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it('should throw CustomerNotFoundException when customer not found', async () => {
    const customerId = 'non-existent-id';

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw CustomerNotFoundException when customer ID is empty string', async () => {
    const customerId = '';

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.delete).not.toHaveBeenCalled();
  });

  it('should delete customer with different ID formats', async () => {
    const customerId = 'uuid-format-123';
    const existingCustomer = new Customer(
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        document: await hash('98765432109', 10),
        phone: '98765432109',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
      customerId,
    );

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.delete.mockResolvedValue();

    const result = await useCase.execute(customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.delete).toHaveBeenCalledWith(customerId);
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
    expect(customerRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it('should not call delete when customer is not found', async () => {
    const customerId = 'non-existent-id';

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.delete).not.toHaveBeenCalled();
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
    expect(customerRepository.delete).toHaveBeenCalledTimes(0);
  });
});
