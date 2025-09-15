import { Patient } from "../../domain/entities/Patient";
import { IPatientRepository } from "../../domain/repositories/PatientRepository";
import { RegisterPatientCommand } from "../dto/RegisterPatientCommand";
import { PatientRegisteredResponse } from "../dto/PatientRegisteredResponse";
import { PatientId } from "../../domain/value-objects/PatientId";
import { FullName } from "../../domain/value-objects/FullName";
import { DateOfBirth } from "../../domain/value-objects/DateOfBirth";
import { DNI } from "../../domain/value-objects/DNI";
import { ContactInfo } from "../../domain/value-objects/ContactInfo";
import { Address } from "../../domain/value-objects/Address";

export class RegisterPatient {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(
    command: RegisterPatientCommand
  ): Promise<PatientRegisteredResponse> {
    const patient = Patient.register(
      command.fullName,
      DateOfBirth.create(command.dateOfBirth),
      command.dni,
      command.contactInfo,
      command.address
    );
    await this.patientRepository.save(patient);
    return new PatientRegisteredResponse(
      patient.getId(),
      patient.getFullName(),
      patient.getDateOfBirth().getValue(),
      patient.getDNI(),
      patient.getContactInfo(),
      patient.getAddress()
    );
  }
}
