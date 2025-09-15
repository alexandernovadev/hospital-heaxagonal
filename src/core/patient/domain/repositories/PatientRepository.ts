import { Patient } from "../entities/Patient";
import { DNI } from "../value-objects/DNI";
import { PatientId } from "../value-objects/PatientId";

export interface IPatientRepository {
  findById(id: PatientId): Promise<Patient | null>;
  findByDNI(dni: DNI): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  save(patient: Patient): Promise<void>;
  delete(id: PatientId): Promise<void>;
  exists(id: PatientId): Promise<boolean>;
}
