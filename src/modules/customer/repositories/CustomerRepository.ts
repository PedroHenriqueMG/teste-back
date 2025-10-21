import { Customer } from '../entities/Customer';

export abstract class CustomerRepository {
  abstract update(customer: Customer): Promise<void>;
  abstract create(customer: Customer): Promise<void>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract delete(id: string): Promise<void>;
}
