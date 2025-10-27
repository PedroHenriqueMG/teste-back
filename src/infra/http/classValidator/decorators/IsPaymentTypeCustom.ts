import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { PaymentType } from '@prisma/client';
import { ExceptionMessage } from '../data/ExceptionsMessage';

export function IsPaymentTypeCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsPaymentTypeCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(PaymentType).includes(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionMessage.IsEnum(validationArguments.property);
        },
      },
    });
  };
}
