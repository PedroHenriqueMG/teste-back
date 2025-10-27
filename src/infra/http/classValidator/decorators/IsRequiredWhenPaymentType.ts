import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PaymentType } from '@prisma/client';

@ValidatorConstraint({ name: 'IsRequiredWhenPaymentType', async: false })
export class IsRequiredWhenPaymentTypeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [paymentType] = args.constraints;
    const object = args.object as any;

    // If paymentType matches the required type, the field must be provided
    if (object.paymentType === paymentType) {
      return value !== undefined && value !== null && value !== '';
    }

    // If paymentType doesn't match, the field is optional
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [paymentType] = args.constraints;
    return `O campo ${args.property} é obrigatório quando paymentType é ${paymentType}`;
  }
}

export function IsRequiredWhenPaymentType(
  paymentType: PaymentType,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsRequiredWhenPaymentType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [paymentType],
      options: validationOptions,
      validator: IsRequiredWhenPaymentTypeConstraint,
    });
  };
}
