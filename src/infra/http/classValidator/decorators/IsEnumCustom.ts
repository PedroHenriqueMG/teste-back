import {
  isEnum,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionMessage } from '../data/ExceptionsMessage';

export function IsEnumCustom(
  enumObject: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'MinLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [enumObject],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return isEnum(value, enumObject);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionMessage.IsEnum(validationArguments.property);
        },
      },
    });
  };
}
