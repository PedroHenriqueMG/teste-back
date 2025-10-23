import { Customer } from '../../../../../modules/customer/entities/Customer';
export class CustomerViewModel {
  static toHttp({
    createdAt,
    email,
    id,
    name,
    document,
    phone,
    updatedAt,
  }: Customer) {
    return {
      id,
      email,
      name,
      createdAt,
      document,
      phone,
      updatedAt,
    };
  }

  static toMessage(message: string) {
    return {
      message,
    };
  }
}
