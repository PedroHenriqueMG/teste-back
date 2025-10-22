import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Conexão com o banco feita com sucesso!")
    } catch (error) {
      throw new Error(`PrismaService connection error: ${error}`);
    }
  }
}
