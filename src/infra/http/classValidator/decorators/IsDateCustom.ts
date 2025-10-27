import {
  isDate,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ExceptionMessage } from '../data/ExceptionsMessage';

export function IsDateCustom(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsDateCustom',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === null) return true;

          if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              object[propertyName] = date;
              return isDate(date);
            }
            return false;
          }

          return isDate(value);
        },
        defaultMessage(validationArguments: ValidationArguments) {
          return ExceptionMessage.IsDate(validationArguments.property);
        },
      },
    });
  };
}
