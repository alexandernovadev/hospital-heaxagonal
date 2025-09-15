import { Address } from "../value-objects/Address";
import { ContactInfo } from "../value-objects/ContactInfo";
import { DateOfBirth } from "../value-objects/DateOfBirth";
import { DNI } from "../value-objects/DNI";
import { FullName } from "../value-objects/FullName";
import { PatientId } from "../value-objects/PatientId";

export class Patient {
  private readonly id: PatientId;
  private fullName: FullName;
  private dateOfBirth: DateOfBirth;
  private dni: DNI;
  private contactInfo: ContactInfo;
  private address: Address;
  private updatedAt: Date;
  private readonly createdAt: Date;

  private constructor(
    id: PatientId,
    fullName: FullName,
    dateOfBirth: DateOfBirth,
    dni: DNI,
    contactInfo: ContactInfo,
    address: Address
  ) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.dni = dni;
    this.contactInfo = contactInfo;
    this.address = address;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static fromPrimitives(id: PatientId, fullName: FullName, dateOfBirth: DateOfBirth, dni: DNI, contactInfo: ContactInfo, address: Address): Patient {
    return new Patient(id, fullName, dateOfBirth, dni, contactInfo, address);
  }

  public static register(fullName: FullName, dateOfBirth: DateOfBirth, dni: DNI, contactInfo: ContactInfo, address: Address): Patient {
    const id = PatientId.createNew();
    return new Patient(id, fullName, dateOfBirth, dni, contactInfo, address);
  }

  public changeFullName(fullName: FullName): void {
    if (!this.fullName.equals(fullName)) {
      this.fullName = fullName;
      this.updatedAt = new Date();
    }
  }

  public changeDateOfBirth(dateOfBirth: DateOfBirth): void {
    if (!this.dateOfBirth.equals(dateOfBirth)) {
      this.dateOfBirth = dateOfBirth;
      this.updatedAt = new Date();
    }
  }
  
  public changeDNI(dni: DNI): void {
    if (!this.dni.equals(dni)) {
      this.dni = dni;
      this.updatedAt = new Date();
    }
  }
  
  public changeContactInfo(contactInfo: ContactInfo): void {
    if (!this.contactInfo.equals(contactInfo)) {
      this.contactInfo = contactInfo;
      this.updatedAt = new Date();
    }
  }

  public changeAddress(address: Address): void {
    if (!this.address.equals(address)) {
      this.address = address;
      this.updatedAt = new Date();
    }
  }

  public equals(other: Patient): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Patient)) {
      return false;
    }
    return this.id.equals(other.id);
  }

  // getters
  public getId(): PatientId {
    return this.id;
  }

  public getFullName(): FullName {
    return this.fullName;
  }

  public getDateOfBirth(): DateOfBirth {
    return this.dateOfBirth;
  }

  public getDNI(): DNI {
    return this.dni;
  }

  public getContactInfo(): ContactInfo {
    return this.contactInfo;
  }

  public getAddress(): Address {
    return this.address;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
