import { Test } from '@nestjs/testing';
import { GetUniqueCustomerUseCase } from './getUniqueCustomerUseCase';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { CustomerNotFoundException } from '../../exceptions/CustomerNotFound';
import { hash } from 'bcrypt';

describe('GetUniqueCustomerUseCase', () => {
  let useCase: GetUniqueCustomerUseCase;
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
        GetUniqueCustomerUseCase,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    useCase = moduleRef.get(GetUniqueCustomerUseCase);
    customerRepository = moduleRef.get(CustomerRepository);
  });

  it('should return customer when found by ID', async () => {
    const customerId = 'customer-123';
    const mockCustomer = new Customer(
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

    customerRepository.findById.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockCustomer);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe('john@example.com');
    expect(result.name).toBe('John Doe');
  });

  it('should throw CustomerNotFoundException when customer not found', async () => {
    const customerId = 'non-existent-id';

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw CustomerNotFoundException when customer ID is empty string', async () => {
    const customerId = '';

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should return customer with different ID formats', async () => {
    const customerId = 'uuid-format-123';
    const mockCustomer = new Customer(
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

    customerRepository.findById.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe('jane@example.com');
    expect(result.name).toBe('Jane Smith');
  });
});
