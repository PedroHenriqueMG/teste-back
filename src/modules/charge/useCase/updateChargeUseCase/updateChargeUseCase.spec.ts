import { Test } from '@nestjs/testing';
import { UpdateChargeUseCase } from './updateChargeUseCase';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { createPrismaMock, PrismaMock } from 'test/mocks/prisma.mock';
import { ChargeRepository } from 'src/modules/charge/repositories/ChargeRepository';
import { PrismaChargeRepository } from 'src/infra/database/prisma/repositories/charge/PrismaChargeRepository';
import { ChargeStatus, PaymentType } from '@prisma/client';
import { ChargeNotFoundException } from '../../exceptions/ChargeNotFound';

describe('UpdateChargeUseCase (Prisma Mock)', () => {
  let useCase: UpdateChargeUseCase;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateChargeUseCase,
        { provide: PrismaService, useValue: prisma },
        { provide: ChargeRepository, useClass: PrismaChargeRepository },
      ],
    }).compile();

    useCase = moduleRef.get(UpdateChargeUseCase);
  });

  it('should update a charge status to paid successfully', async () => {
    // Arrange
    const chargeId = 'charge-id-1';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'BRL',
      value: 1000,
      paymentType: PaymentType.creditCard,
      amountParcel: 3,
      validateDate: null,
      status: ChargeStatus.pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.paid,
    });

    // Act
    const result = await useCase.execute(
      { status: ChargeStatus.paid },
      chargeId,
    );

    // Assert
    expect(prisma.charge.findUnique).toHaveBeenCalledWith({
      where: { id: chargeId },
    });
    expect(prisma.charge.update).toHaveBeenCalled();
    expect(result.id).toBe(chargeId);
    expect(result.status).toBe(ChargeStatus.paid);
    expect(result.custumer_id).toBe(existingCharge.custumer_id);
  });

  it('should update a charge status to failed successfully', async () => {
    // Arrange
    const chargeId = 'charge-id-1';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'BRL',
      value: 500,
      paymentType: PaymentType.bankSlip,
      amountParcel: null,
      validateDate: new Date('2024-12-31'),
      status: ChargeStatus.pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.failed,
    });

    // Act
    const result = await useCase.execute(
      { status: ChargeStatus.failed },
      chargeId,
    );

    // Assert
    expect(prisma.charge.findUnique).toHaveBeenCalledWith({
      where: { id: chargeId },
    });
    expect(prisma.charge.update).toHaveBeenCalled();
    expect(result.status).toBe(ChargeStatus.failed);
    expect(result.validateDate).toEqual(existingCharge.validateDate);
  });

  it('should update a charge status to canceled successfully', async () => {
    // Arrange
    const chargeId = 'charge-id-1';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'USD',
      value: 2000,
      paymentType: PaymentType.creditCard,
      amountParcel: 6,
      validateDate: null,
      status: ChargeStatus.pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.canceled,
    });

    // Act
    const result = await useCase.execute(
      { status: ChargeStatus.canceled },
      chargeId,
    );

    // Assert
    expect(prisma.charge.findUnique).toHaveBeenCalledWith({
      where: { id: chargeId },
    });
    expect(result.status).toBe(ChargeStatus.canceled);
    expect(result.value).toBe(existingCharge.value);
  });

  it('should throw ChargeNotFoundException when charge does not exist', async () => {
    // Arrange
    const chargeId = 'non-existent-charge';

    prisma.charge.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute({ status: ChargeStatus.paid }, chargeId),
    ).rejects.toThrow(ChargeNotFoundException);

    expect(prisma.charge.findUnique).toHaveBeenCalledWith({
      where: { id: chargeId },
    });
    expect(prisma.charge.update).not.toHaveBeenCalled();
  });

  it('should preserve all original charge data when updating status', async () => {
    // Arrange
    const chargeId = 'charge-id-1';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'EUR',
      value: 750,
      paymentType: PaymentType.bankSlip,
      amountParcel: null,
      validateDate: new Date('2024-06-30'),
      status: ChargeStatus.pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.paid,
    });

    // Act
    const result = await useCase.execute(
      { status: ChargeStatus.paid },
      chargeId,
    );

    // Assert
    expect(result.custumer_id).toBe(existingCharge.custumer_id);
    expect(result.coin).toBe(existingCharge.coin);
    expect(result.value).toBe(existingCharge.value);
    expect(result.paymentType).toBe(existingCharge.paymentType);
    expect(result.amountParcel).toBe(existingCharge.amountParcel);
    expect(result.validateDate).toEqual(existingCharge.validateDate);
    expect(result.createdAt).toEqual(existingCharge.createdAt);
    expect(result.status).toBe(ChargeStatus.paid);
  });

  it('should update status from paid to canceled', async () => {
    // Arrange
    const chargeId = 'charge-id-1';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'BRL',
      value: 5000,
      paymentType: PaymentType.creditCard,
      amountParcel: 12,
      validateDate: null,
      status: ChargeStatus.paid,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.canceled,
    });

    // Act
    const result = await useCase.execute(
      { status: ChargeStatus.canceled },
      chargeId,
    );

    // Assert
    expect(result.status).toBe(ChargeStatus.canceled);
  });

  it('should call findUnique with correct charge id', async () => {
    // Arrange
    const chargeId = 'specific-charge-id';
    const existingCharge = {
      id: chargeId,
      custumer_id: 'customer-id-1',
      coin: 'BRL',
      value: 100,
      paymentType: PaymentType.creditCard,
      amountParcel: 1,
      validateDate: null,
      status: ChargeStatus.pending,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    prisma.charge.findUnique.mockResolvedValue(existingCharge);
    prisma.charge.update.mockResolvedValue({
      ...existingCharge,
      status: ChargeStatus.paid,
    });

    // Act
    await useCase.execute({ status: ChargeStatus.paid }, chargeId);

    // Assert
    expect(prisma.charge.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.charge.findUnique).toHaveBeenCalledWith({
      where: { id: chargeId },
    });
  });
});
