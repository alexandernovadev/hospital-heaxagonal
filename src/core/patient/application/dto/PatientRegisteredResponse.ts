import { ContactInfo } from "../../domain/value-objects/ContactInfo";
import { DNI } from "../../domain/value-objects/DNI";
import { PatientId } from "../../domain/value-objects/PatientId";
import { Address } from "../../domain/value-objects/Address";
import { FullName } from "../../domain/value-objects/FullName";

export class PatientRegisteredResponse {
  constructor(
    public readonly id: PatientId,
    public readonly fullName: FullName,
    public readonly dateOfBirth: Date,
    public readonly dni: DNI,
    public readonly contactInfo: ContactInfo,
    public readonly address: Address
  ) {}
}
