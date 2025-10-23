import { Test } from '@nestjs/testing';
import { UpdateCustomerUseCase } from './updateCustomerUseCase';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { Customer } from '../../entities/Customer';
import { CustomerNotFoundException } from '../../exceptions/CustomerNotFound';
import { hash } from 'bcrypt';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
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
        UpdateCustomerUseCase,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    useCase = moduleRef.get(UpdateCustomerUseCase);
    customerRepository = moduleRef.get(CustomerRepository);
  });

  it('should update customer when found by ID', async () => {
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

    const updateData = {
      email: 'john.updated@example.com',
      name: 'John Updated',
      document: '98765432109',
      phone: '98765432109',
    };

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.update.mockResolvedValue();

    const result = await useCase.execute(updateData, customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.update).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe(updateData.email);
    expect(result.name).toBe(updateData.name);
    expect(result.document).toBe(updateData.document);
    expect(result.phone).toBe(updateData.phone);
  });

  it('should update customer with partial data (only some fields)', async () => {
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

    const updateData = {
      email: 'john.updated@example.com',
      name: 'John Updated',
      // document and phone are undefined - should use existing values
    };

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.update.mockResolvedValue();

    const result = await useCase.execute(updateData, customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.update).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe(updateData.email);
    expect(result.name).toBe(updateData.name);
    expect(result.document).toBe(existingCustomer.document); // Should keep existing
    expect(result.phone).toBe(existingCustomer.phone); // Should keep existing
  });

  it('should throw CustomerNotFoundException when customer not found', async () => {
    const customerId = 'non-existent-id';
    const updateData = {
      email: 'new@example.com',
      name: 'New Name',
    };

    customerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(updateData, customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.update).not.toHaveBeenCalled();
  });

  it('should update customer with empty update data (no changes)', async () => {
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

    const updateData = {}; // Empty update data

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.update.mockResolvedValue();

    const result = await useCase.execute(updateData, customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.update).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe(existingCustomer.email); // Should keep existing
    expect(result.name).toBe(existingCustomer.name); // Should keep existing
    expect(result.document).toBe(existingCustomer.document); // Should keep existing
    expect(result.phone).toBe(existingCustomer.phone); // Should keep existing
  });

  it('should update customer with only one field', async () => {
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

    const updateData = {
      name: 'Only Name Updated',
    };

    customerRepository.findById.mockResolvedValue(existingCustomer);
    customerRepository.update.mockResolvedValue();

    const result = await useCase.execute(updateData, customerId);

    expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
    expect(customerRepository.update).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(customerId);
    expect(result.email).toBe(existingCustomer.email); // Should keep existing
    expect(result.name).toBe(updateData.name); // Should be updated
    expect(result.document).toBe(existingCustomer.document); // Should keep existing
    expect(result.phone).toBe(existingCustomer.phone); // Should keep existing
  });
});
