import { Test } from '@nestjs/testing';
import { CreateCustomerUseCase } from './createCustomerUseCase';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { createPrismaMock, PrismaMock } from 'test/mocks/prisma.mock';
import { CustomerWithSameEmail } from '../../exceptions/CustomerWithSameEmail';
import { CustomerWithSameDocument } from '../../exceptions/CustomerWithSameDocument';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { PrismaCustomerRepository } from 'src/infra/database/prisma/repositories/customer/PrismaCustomerRepository';
import { hash } from 'bcrypt';

describe('CreateCustomerUseCase (Prisma Mock)', () => {
  let useCase: CreateCustomerUseCase;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        { provide: PrismaService, useValue: prisma },
        { provide: CustomerRepository, useClass: PrismaCustomerRepository },
      ],
    }).compile();

    useCase = moduleRef.get(CreateCustomerUseCase);
  });

  it('should create a customer successfully', async () => {
    const customerData = {
      email: 'john@example.com',
      name: 'John Doe',
      document: '12345678901',
      phone: '12345678901',
    };

    prisma.customer.findUnique.mockResolvedValue(null);
    prisma.customer.create.mockResolvedValue({
      id: 'customer-id-1',
      email: customerData.email,
      name: customerData.name,
      document: await hash(customerData.document, 10),
      phone: customerData.phone,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    const result = await useCase.execute(customerData);

    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { email: customerData.email },
    });
    expect(prisma.customer.create).toHaveBeenCalled();
    expect(result.email).toBe(customerData.email);
    expect(result.name).toBe(customerData.name);
    expect(result.id).toBeDefined();
  });

  it('should throw CustomerWithSameEmail when email already exists', async () => {
    // Arrange
    const customerData = {
      email: 'existing@example.com',
      name: 'John Doe',
      document: '12345678901',
      phone: '12345678901',
    };

    // Mock existing customer with different document
    prisma.customer.findUnique.mockResolvedValue({
      id: 'existing-id',
      email: customerData.email,
      name: 'Existing User',
      document: await hash('different-document', 10),
      phone: '98765432109',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act & Assert
    await expect(useCase.execute(customerData)).rejects.toThrow(
      CustomerWithSameEmail,
    );
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { email: customerData.email },
    });
    expect(prisma.customer.create).not.toHaveBeenCalled();
  });

  it('should throw CustomerWithSameEmail when email already exists (regardless of document)', async () => {
    // Arrange
    const customerData = {
      email: 'existing@example.com',
      name: 'John Doe',
      document: '12345678901',
      phone: '12345678901',
    };

    const hashedDocument = await hash(customerData.document, 10);

    // Mock existing customer with same document
    prisma.customer.findUnique.mockResolvedValue({
      id: 'existing-id',
      email: customerData.email,
      name: 'Existing User',
      document: hashedDocument,
      phone: '98765432109',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act & Assert
    await expect(useCase.execute(customerData)).rejects.toThrow(
      CustomerWithSameEmail,
    );
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { email: customerData.email },
    });
    expect(prisma.customer.create).not.toHaveBeenCalled();
  });

  it('should hash the document before saving', async () => {
    // Arrange
    const customerData = {
      email: 'john@example.com',
      name: 'John Doe',
      document: 'plain-document',
      phone: '12345678901',
    };

    prisma.customer.findUnique.mockResolvedValue(null);
    prisma.customer.create.mockResolvedValue({
      id: 'customer-id-1',
      email: customerData.email,
      name: customerData.name,
      document: 'hashed-document',
      phone: customerData.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const result = await useCase.execute(customerData);

    // Assert
    expect(prisma.customer.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: customerData.email,
        name: customerData.name,
        document: expect.not.stringMatching(customerData.document), // Should be hashed
        phone: customerData.phone,
      }),
    });
    expect(result.document).not.toBe(customerData.document); // Should be hashed
  });
});
