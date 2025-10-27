import { Charge } from "../entities/Charge";

export abstract class ChargeRepository {
  abstract update(customer: Charge): Promise<void>;
  abstract create(customer: Charge): Promise<void>;
  abstract findById(id: string): Promise<Charge | null>;
  abstract findAllCustomerId(customerId: string): Promise<Charge[]>;
  abstract delete(id: string): Promise<void>;
}
