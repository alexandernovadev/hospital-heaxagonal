import { IPatientRepository } from "../../domain/repositories/PatientRepository";
import { Patient } from "../../domain/entities/Patient";
import { PatientId } from "../../domain/value-objects/PatientId";
import { DNI } from "../../domain/value-objects/DNI";

export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Map<string, Patient>;

  constructor() {
    this.patients = new Map<string, Patient>();
  }

  async findById(id: PatientId): Promise<Patient | null> {
    return Promise.resolve(this.patients.get(id.getValue()) || null);
  }

  async findByDNI(dni: DNI): Promise<Patient | null> {
    for (const patient of this.patients.values()) {
      if (patient.getDNI().equals(dni)) {
        return Promise.resolve(patient);
      }
    }
    return Promise.resolve(null);
  }

  async findAll(): Promise<Patient[]> {
    return Promise.resolve(Array.from(this.patients.values()));
  }

  async save(patient: Patient): Promise<void> {
    this.patients.set(patient.getId().getValue(), patient);
    return Promise.resolve();
  }

  async delete(id: PatientId): Promise<void> {
    this.patients.delete(id.getValue());
    return Promise.resolve();
  }

  async exists(id: PatientId): Promise<boolean> {
    return Promise.resolve(this.patients.has(id.getValue()));
  }
}
