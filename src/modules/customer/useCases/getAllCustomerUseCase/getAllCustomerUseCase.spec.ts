import { Test } from '@nestjs/testing';
import { GetAllCustomerUseCase } from './getAllCustomerUseCase';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { hash } from 'bcrypt';

describe('GetAllCustomerUseCase', () => {
  let useCase: GetAllCustomerUseCase;
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
        GetAllCustomerUseCase,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    useCase = moduleRef.get(GetAllCustomerUseCase);
    customerRepository = moduleRef.get(CustomerRepository);
  });

  it('should return all customers when they exist', async () => {
    const mockCustomers = [
      new Customer({
        email: 'john@example.com',
        name: 'John Doe',
        document: await hash('12345678901', 10),
        phone: '12345678901',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      }),
      new Customer({
        email: 'jane@example.com',
        name: 'Jane Smith',
        document: await hash('98765432109', 10),
        phone: '98765432109',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      }),
    ];

    customerRepository.findAll.mockResolvedValue(mockCustomers);

    const result = await useCase.execute();

    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].email).toBe('john@example.com');
    expect(result[0].name).toBe('John Doe');
    expect(result[1].email).toBe('jane@example.com');
    expect(result[1].name).toBe('Jane Smith');
  });

  it('should return empty array when no customers exist', async () => {
    customerRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return single customer when only one exists', async () => {
    const mockCustomer = new Customer({
      email: 'single@example.com',
      name: 'Single User',
      document: await hash('11111111111', 10),
      phone: '11111111111',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    customerRepository.findAll.mockResolvedValue([mockCustomer]);

    const result = await useCase.execute();

    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('single@example.com');
    expect(result[0].name).toBe('Single User');
  });
});
