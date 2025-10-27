import { Test } from '@nestjs/testing';
import { GetAllChargeUseCase } from './getAllChargeUseCase';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { createPrismaMock, PrismaMock } from 'test/mocks/prisma.mock';
import { ChargeRepository } from 'src/modules/charge/repositories/ChargeRepository';
import { PrismaChargeRepository } from 'src/infra/database/prisma/repositories/charge/PrismaChargeRepository';
import { PaymentType, ChargeStatus } from '@prisma/client';

describe('GetAllChargeUseCase (Prisma Mock)', () => {
  let useCase: GetAllChargeUseCase;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetAllChargeUseCase,
        { provide: PrismaService, useValue: prisma },
        { provide: ChargeRepository, useClass: PrismaChargeRepository },
      ],
    }).compile();

    useCase = moduleRef.get(GetAllChargeUseCase);
  });

  it('should return all charges for a customer successfully', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const mockCharges = [
      {
        id: 'charge-id-1',
        custumer_id: customerId,
        coin: 'BRL',
        value: 1000,
        paymentType: PaymentType.creditCard,
        amountParcel: 3,
        validateDate: null,
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'charge-id-2',
        custumer_id: customerId,
        coin: 'BRL',
        value: 500,
        paymentType: PaymentType.bankSlip,
        amountParcel: null,
        validateDate: new Date('2024-12-31'),
        status: ChargeStatus.paid,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    prisma.charge.findMany.mockResolvedValue(mockCharges);

    // Act
    const result = await useCase.execute(customerId);

    // Assert
    expect(prisma.charge.findMany).toHaveBeenCalledWith({
      where: { custumer_id: customerId },
    });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('charge-id-1');
    expect(result[1].id).toBe('charge-id-2');
    expect(result[0].custumer_id).toBe(customerId);
    expect(result[1].custumer_id).toBe(customerId);
  });

  it('should return empty array when customer has no charges', async () => {
    // Arrange
    const customerId = 'customer-id-1';

    prisma.charge.findMany.mockResolvedValue([]);

    // Act
    const result = await useCase.execute(customerId);

    // Assert
    expect(prisma.charge.findMany).toHaveBeenCalledWith({
      where: { custumer_id: customerId },
    });
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('should return multiple charges with different payment types', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const mockCharges = [
      {
        id: 'charge-id-1',
        custumer_id: customerId,
        coin: 'USD',
        value: 2000,
        paymentType: PaymentType.creditCard,
        amountParcel: 6,
        validateDate: null,
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'charge-id-2',
        custumer_id: customerId,
        coin: 'EUR',
        value: 750,
        paymentType: PaymentType.bankSlip,
        amountParcel: null,
        validateDate: new Date('2024-12-31'),
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 'charge-id-3',
        custumer_id: customerId,
        coin: 'BRL',
        value: 3000,
        paymentType: PaymentType.creditCard,
        amountParcel: 12,
        validateDate: null,
        status: ChargeStatus.paid,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    prisma.charge.findMany.mockResolvedValue(mockCharges);

    // Act
    const result = await useCase.execute(customerId);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].paymentType).toBe(PaymentType.creditCard);
    expect(result[1].paymentType).toBe(PaymentType.bankSlip);
    expect(result[2].paymentType).toBe(PaymentType.creditCard);
    expect(result[0].coin).toBe('USD');
    expect(result[1].coin).toBe('EUR');
    expect(result[2].coin).toBe('BRL');
  });

  it('should return charges with correct values and status', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const mockCharges = [
      {
        id: 'charge-id-1',
        custumer_id: customerId,
        coin: 'BRL',
        value: 100,
        paymentType: PaymentType.bankSlip,
        amountParcel: null,
        validateDate: new Date('2024-06-30'),
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'charge-id-2',
        custumer_id: customerId,
        coin: 'BRL',
        value: 5000,
        paymentType: PaymentType.creditCard,
        amountParcel: 2,
        validateDate: null,
        status: ChargeStatus.paid,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 'charge-id-3',
        custumer_id: customerId,
        coin: 'BRL',
        value: 250,
        paymentType: PaymentType.bankSlip,
        amountParcel: null,
        validateDate: new Date('2024-07-15'),
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    prisma.charge.findMany.mockResolvedValue(mockCharges);

    // Act
    const result = await useCase.execute(customerId);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].value).toBe(100);
    expect(result[1].value).toBe(5000);
    expect(result[2].value).toBe(250);
    expect(result[0].status).toBe('pending');
    expect(result[1].status).toBe('paid');
    expect(result[2].status).toBe('pending');
  });

  it('should call repository with correct customerId parameter', async () => {
    // Arrange
    const customerId = 'specific-customer-id';

    prisma.charge.findMany.mockResolvedValue([]);

    // Act
    await useCase.execute(customerId);

    // Assert
    expect(prisma.charge.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.charge.findMany).toHaveBeenCalledWith({
      where: { custumer_id: customerId },
    });
  });

  it('should return charges in the order they are stored', async () => {
    // Arrange
    const customerId = 'customer-id-1';
    const mockCharges = [
      {
        id: 'first-charge',
        custumer_id: customerId,
        coin: 'BRL',
        value: 100,
        paymentType: PaymentType.creditCard,
        amountParcel: 1,
        validateDate: null,
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'second-charge',
        custumer_id: customerId,
        coin: 'BRL',
        value: 200,
        paymentType: PaymentType.bankSlip,
        amountParcel: null,
        validateDate: new Date('2024-06-30'),
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: 'third-charge',
        custumer_id: customerId,
        coin: 'BRL',
        value: 300,
        paymentType: PaymentType.creditCard,
        amountParcel: 3,
        validateDate: null,
        status: ChargeStatus.pending,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    prisma.charge.findMany.mockResolvedValue(mockCharges);

    // Act
    const result = await useCase.execute(customerId);

    // Assert
    expect(result[0].id).toBe('first-charge');
    expect(result[1].id).toBe('second-charge');
    expect(result[2].id).toBe('third-charge');
  });
});
