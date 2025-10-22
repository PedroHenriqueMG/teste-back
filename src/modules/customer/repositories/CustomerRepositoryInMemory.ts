import { Customer } from '../entities/Customer';
import { CustomerRepository } from './CustomerRepository';

export class CustomerRepositoryInMemory implements CustomerRepository {
  public customers: Customer[] = [];

  async create(customer: Customer): Promise<void> {
    this.customers.push(customer);
  }

  async update(customer: Customer): Promise<void> {
    this.customers = this.customers.map((c) => (c.id === customer.id ? customer : c));
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.email === email);

    if (!customer) return null;

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return []
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) return null;

    return customer;
  }

  async delete(id: string): Promise<void> {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }
}
