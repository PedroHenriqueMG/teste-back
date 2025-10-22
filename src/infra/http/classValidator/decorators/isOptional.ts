import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionMessage } from '../data/ExceptionsMessage';

export function IsOptionalCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsOptionalCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined || value === null || value === '';
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionMessage.IsOptional(validationArguments.property);
        },
      },
    });
  };
}
