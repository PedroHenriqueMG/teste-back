import { randomUUID } from 'crypto';
import { Replace } from 'src/types/replace';
import {
  Charge as ChargeProps,
  PaymentType,
  ChargeStatus,
} from '@prisma/client';

interface ChargeSchema extends Omit<ChargeProps, 'id'> {
  id?: string;
}

export class Charge {
  private props: ChargeSchema;
  private _id: string;

  constructor(
    props: Replace<
      ChargeSchema,
      { createdAt?: Date; updatedAt?: Date; status?: ChargeStatus }
    >,
    id?: string,
  ) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      status: props.status || 'pending',
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get custumer_id(): string {
    return this.props.custumer_id;
  }

  set custumer_id(custumer_id: string) {
    this.props.custumer_id = custumer_id;
  }

  get value(): number {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  get coin(): string {
    return this.props.coin;
  }

  set coin(coin: string) {
    this.props.coin = coin;
  }

  get paymentType(): PaymentType {
    return this.props.paymentType;
  }

  set paymentType(paymentType: PaymentType) {
    this.props.paymentType = paymentType;
  }

  get status(): ChargeStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set amountParcel(amountParcel: number) {
    this.props.amountParcel = amountParcel;
  }

  get amountParcel(): number {
    return this.props.amountParcel!;
  }

  set validateDate(validateDate: Date) {
    this.props.validateDate = validateDate;
  }

  get validateDate(): Date {
    return this.props.validateDate!;
  }
}
