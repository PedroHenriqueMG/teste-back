import { Customer } from '../../../../../modules/customer/entities/Customer';
export class CustomerViewModel {
  static toHttp({ createdAt, email, id, name }: Customer) {
    return {
      id,
      email,
      name,
      createdAt,
    };
  }
}
