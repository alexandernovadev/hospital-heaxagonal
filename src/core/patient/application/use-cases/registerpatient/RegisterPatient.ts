import { Patient } from "../../../domain/entities/Patient";
import { IPatientRepository } from "../../../domain/repositories/PatientRepository";
import { RegisterPatientCommand } from "../../dto/RegisterPatientCommand";
import { PatientRegisteredResponse } from "../../dto/PatientRegisteredResponse";
import { FullName } from "../../../domain/value-objects/FullName";
import { DateOfBirth } from "../../../domain/value-objects/DateOfBirth";
import { DNI } from "../../../domain/value-objects/DNI";
import { ContactInfo } from "../../../domain/value-objects/ContactInfo";
import { Address } from "../../../domain/value-objects/Address";
import { DuplicateDNIError } from "../../errors/DuplicateDNIError"; // 🛡️ Importar el error de aplicación
import { Email } from "../../../../../support/auth/domain/value-objects/Email"; // 📧 Importar Email desde el contexto de Auth
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber";

export class RegisterPatient {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(
    command: RegisterPatientCommand
  ): Promise<PatientRegisteredResponse> {
    // 🛡️ Verificar si ya existe un paciente con el mismo DNI
    const existingPatientByDNI = await this.patientRepository.findByDNI(
      DNI.create(command.dni)
    );
    if (existingPatientByDNI) {
      throw new DuplicateDNIError("Patient with this DNI already exists.");
    }

    // 🏗️ Crear Value Objects a partir de los datos primitivos del comando
    const fullName = FullName.create(command.firstName, command.lastName);
    const dateOfBirth = DateOfBirth.create(command.dateOfBirth);
    const dni = DNI.create(command.dni);
    const email = Email.create(command.email); // 📧 Asumiendo que el comando tiene un email primitivo
    const phoneNumber = PhoneNumber.create(command.phoneNumber); // 📞 Asumiendo que el comando tiene un phoneNumber primitivo
    const contactInfo = ContactInfo.create(email, phoneNumber);
    const address = Address.create(
      command.street,
      command.city,
      command.state,
      command.zipCode,
      command.country
    );

    // ✅ Registrar el nuevo paciente
    const patient = Patient.register(
      fullName,
      dateOfBirth,
      dni,
      contactInfo,
      address
    );
    await this.patientRepository.save(patient);

    // 📤 Devolver la respuesta con datos primitivos
    return new PatientRegisteredResponse(
      patient.getId().getValue(),
      patient.getFullName().getValue(), // Convertir FullName a string para la respuesta
      patient.getContactInfo().getEmail().getValue(), // Convertir Email a string
      "Patient registered successfully."
    );
  }
}
