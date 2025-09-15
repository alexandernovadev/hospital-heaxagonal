import { Email } from "../../../../support/auth/domain/value-objects/Email";
import { PhoneNumber } from "./PhoneNumber";

export class ContactInfo {
  private readonly email: Email;
  private readonly phoneNumber: PhoneNumber;

  private constructor(email: Email, phoneNumber: PhoneNumber) {
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  public static create(email: Email, phoneNumber: PhoneNumber): ContactInfo {
    return new ContactInfo(email, phoneNumber);
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPhoneNumber(): PhoneNumber {
    return this.phoneNumber;
  }

  public equals(other: ContactInfo): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof ContactInfo)) {
      return false;
    }
    return this.email.equals(other.email) && this.phoneNumber.equals(other.phoneNumber);
  }
}
