import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

export type PrismaMock = DeepMockProxy<PrismaClient>;

export const createPrismaMock = (): PrismaMock => mockDeep<PrismaClient>();
