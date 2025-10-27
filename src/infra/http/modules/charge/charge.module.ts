import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ChargeController } from './charge.controller';
import { CreateChargeUseCase } from 'src/modules/charge/useCase/createChargeUseCase/createChargeUseCase';
import { UpdateChargeUseCase } from 'src/modules/charge/useCase/updateChargeUseCase/updateChargeUseCase';
import { GetAllChargeUseCase } from 'src/modules/charge/useCase/getAllChargeUseCase/getAllChargeUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [ChargeController],
  providers: [CreateChargeUseCase, UpdateChargeUseCase, GetAllChargeUseCase],
})
export class ChargeModule {}
