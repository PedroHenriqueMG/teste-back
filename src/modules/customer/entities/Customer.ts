import { randomUUID } from 'crypto';
import { Replace } from 'src/types/replace';
import { Customer as CustomerProps } from '@prisma/client';

interface CustomerSchema extends Omit<CustomerProps, 'id'> {
  id?: string;
}

export class Customer {
  private props: CustomerSchema;
  private _id: string;

  constructor(
    props: Replace<CustomerSchema, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get document(): string {
    return this.props.document;
  }

  set document(document: string) {
    this.props.document = document;
  }

  get phone(): string {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
