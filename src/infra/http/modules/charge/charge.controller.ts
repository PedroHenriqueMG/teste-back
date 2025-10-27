import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateChargeUseCase } from 'src/modules/charge/useCase/createChargeUseCase/createChargeUseCase';
import { CreateChargeBody } from './dtos/createChargeBody';
import { ChargeViewModel } from './viewModel/chargeViewModel';
import { UpdateChargeBody } from './dtos/updateChargeBody';
import { UpdateChargeUseCase } from 'src/modules/charge/useCase/updateChargeUseCase/updateChargeUseCase';
import { GetAllChargeUseCase } from 'src/modules/charge/useCase/getAllChargeUseCase/getAllChargeUseCase';

@Controller('charges')
export class ChargeController {
  constructor(
    private createChargeUseCase: CreateChargeUseCase,
    private getAllChargeUseCase: GetAllChargeUseCase,
    private updateChargeUseCase: UpdateChargeUseCase,
  ) {}

  @Post()
  async createCharge(@Body() body: CreateChargeBody) {
    const { coin, customerId, paymentType, value, amountParcel, validateDate } =
      body;

    const charge = await this.createChargeUseCase.execute({
      coin,
      customerId,
      paymentType,
      value,
      amountParcel,
      validateDate,
    });

    return ChargeViewModel.toHttp(charge);
  }

  @Get('/:customerId')
  async getAllCharge(@Param('customerId') customerId: string) {
    const customerCharges = await this.getAllChargeUseCase.execute(customerId);

    return customerCharges.map((customer) => ChargeViewModel.toHttp(customer));
  }

  @Patch('/:id')
  async updateCharge(@Param('id') id: string, @Body() body: UpdateChargeBody) {
    const { status } = body;

    const charge = await this.updateChargeUseCase.execute({ status }, id);

    return ChargeViewModel.toHttp(charge);
  }
}
