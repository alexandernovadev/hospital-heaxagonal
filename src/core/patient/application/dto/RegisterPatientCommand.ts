import { Address } from "../../domain/value-objects/Address";
import { ContactInfo } from "../../domain/value-objects/ContactInfo";
import { DNI } from "../../domain/value-objects/DNI";
import { FullName } from "../../domain/value-objects/FullName";

export class RegisterPatientCommand {
    constructor(
    public readonly fullName: FullName,
    public readonly dateOfBirth: Date,
    public readonly dni: DNI,
    public readonly contactInfo: ContactInfo,
    public readonly address: Address
  ) {}
}