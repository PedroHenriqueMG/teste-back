import { Test } from '@nestjs/testing';
import { CreateChargeUseCase } from './createChargeUseCase';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { createPrismaMock, PrismaMock } from 'test/mocks/prisma.mock';
import { CustomerNotFoundException } from 'src/modules/customer/exceptions/CustomerNotFound';
import { CustomerRepository } from 'src/modules/customer/repositories/CustomerRepository';
import { ChargeRepository } from 'src/modules/charge/repositories/ChargeRepository';
import { PrismaCustomerRepository } from 'src/infra/database/prisma/repositories/customer/PrismaCustomerRepository';
import { PrismaChargeRepository } from 'src/infra/database/prisma/repositories/charge/PrismaChargeRepository';
import { PaymentType } from '@prisma/client';
import { hash } from 'bcrypt';

describe('CreateChargeUseCase (Prisma Mock)', () => {
  let useCase: CreateChargeUseCase;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateChargeUseCase,
        { provide: PrismaService, useValue: prisma },
        { provide: CustomerRepository, useClass: PrismaCustomerRepository },
        { provide: ChargeRepository, useClass: PrismaChargeRepository },
      ],
    }).compile();

    useCase = moduleRef.get(CreateChargeUseCase);
  });

  it('should create a charge with credit card payment successfully', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.creditCard as PaymentType,
      amountParcel: 3,
      validateDate: undefined,
    };

    // Mock customer exists
    prisma.customer.findUnique.mockResolvedValue({
      id: customerId,
      email: 'john@example.com',
      name: 'John Doe',
      document: await hash('12345678901', 10),
      phone: '12345678901',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    // Mock charge creation
    prisma.charge.create.mockResolvedValue({
      id: 'charge-id-1',
      custumer_id: customerId,
      coin: chargeData.coin,
      value: chargeData.value,
      paymentType: chargeData.paymentType,
      amountParcel: chargeData.amountParcel,
      validateDate: null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(chargeData);

    // Assert
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: customerId },
    });
    expect(prisma.charge.create).toHaveBeenCalled();
    expect(result.custumer_id).toBe(customerId);
    expect(result.value).toBe(chargeData.value);
    expect(result.paymentType).toBe(chargeData.paymentType);
    expect(result.amountParcel).toBe(chargeData.amountParcel);
    expect(result.validateDate).toBeNull();
  });

  it('should create a charge with bank slip payment successfully', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const validateDate = new Date('2024-12-31');
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 500,
      paymentType: PaymentType.bankSlip as PaymentType,
      amountParcel: undefined,
      validateDate,
    };

    // Mock customer exists
    prisma.customer.findUnique.mockResolvedValue({
      id: customerId,
      email: 'john@example.com',
      name: 'John Doe',
      document: await hash('12345678901', 10),
      phone: '12345678901',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    // Mock charge creation
    prisma.charge.create.mockResolvedValue({
      id: 'charge-id-1',
      custumer_id: customerId,
      coin: chargeData.coin,
      value: chargeData.value,
      paymentType: chargeData.paymentType,
      amountParcel: null,
      validateDate: chargeData.validateDate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(chargeData);

    // Assert
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: customerId },
    });
    expect(prisma.charge.create).toHaveBeenCalled();
    expect(result.custumer_id).toBe(customerId);
    expect(result.value).toBe(chargeData.value);
    expect(result.paymentType).toBe(chargeData.paymentType);
    expect(result.validateDate).toEqual(chargeData.validateDate);
    expect(result.amountParcel).toBeNull();
  });

  it('should throw CustomerNotFoundException when customer does not exist', async () => {
    // Arrange
    const customerId = 'non-existent-customer';
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.creditCard as PaymentType,
      amountParcel: 3,
      validateDate: undefined,
    };

    // Mock customer does not exist
    prisma.customer.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(chargeData)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: customerId },
    });
    expect(prisma.charge.create).not.toHaveBeenCalled();
  });

  it('should set amountParcel to null for bank slip payment even if provided', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.bankSlip as PaymentType,
      amountParcel: 5, // Should be ignored
      validateDate: new Date('2024-12-31'),
    };

    // Mock customer exists
    prisma.customer.findUnique.mockResolvedValue({
      id: customerId,
      email: 'john@example.com',
      name: 'John Doe',
      document: await hash('12345678901', 10),
      phone: '12345678901',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    // Mock charge creation
    prisma.charge.create.mockResolvedValue({
      id: 'charge-id-1',
      custumer_id: customerId,
      coin: chargeData.coin,
      value: chargeData.value,
      paymentType: chargeData.paymentType,
      amountParcel: null,
      validateDate: chargeData.validateDate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(chargeData);

    // Assert
    expect(result.amountParcel).toBeNull();
  });

  it('should set validateDate to null for credit card payment even if provided', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.creditCard as PaymentType,
      amountParcel: 3,
      validateDate: new Date('2024-12-31'), // Should be ignored
    };

    // Mock customer exists
    prisma.customer.findUnique.mockResolvedValue({
      id: customerId,
      email: 'john@example.com',
      name: 'John Doe',
      document: await hash('12345678901', 10),
      phone: '12345678901',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    // Mock charge creation
    prisma.charge.create.mockResolvedValue({
      id: 'charge-id-1',
      custumer_id: customerId,
      coin: chargeData.coin,
      value: chargeData.value,
      paymentType: chargeData.paymentType,
      amountParcel: chargeData.amountParcel,
      validateDate: null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(chargeData);

    // Assert
    expect(result.validateDate).toBeNull();
  });

  it('should handle undefined amountParcel for credit card payment', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const chargeData = {
      customerId,
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.creditCard as PaymentType,
      amountParcel: undefined,
      validateDate: undefined,
    };

    // Mock customer exists
    prisma.customer.findUnique.mockResolvedValue({
      id: customerId,
      email: 'john@example.com',
      name: 'John Doe',
      document: await hash('12345678901', 10),
      phone: '12345678901',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    // Mock charge creation
    prisma.charge.create.mockResolvedValue({
      id: 'charge-id-1',
      custumer_id: customerId,
      coin: chargeData.coin,
      value: chargeData.value,
      paymentType: chargeData.paymentType,
      amountParcel: null,
      validateDate: null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(chargeData);

    // Assert
    expect(result.amountParcel).toBeNull();
  });
});
