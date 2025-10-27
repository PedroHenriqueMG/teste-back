import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ChargeStatus } from '@prisma/client';
import { ExceptionMessage } from '../data/ExceptionsMessage';

export function IsChargeStatusCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsChargeStatusCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(ChargeStatus).includes(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionMessage.IsEnum(validationArguments.property);
        },
      },
    });
  };
}
