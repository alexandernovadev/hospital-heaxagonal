import { InvalidPatientIdError } from "../errors/InvalidPatientIdError";
import { v4 as uuidv4 } from 'uuid';

export class PatientId {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static create(value: string): PatientId {
    if (!value || value.trim() === "") {
      throw new InvalidPatientIdError("Patient ID cannot be empty.");
    }
    return new PatientId(value);
  }

  public static createNew(): PatientId {
    return new PatientId(uuidv4());
  }

  public getValue(): string {
    return this.id;
  }

  public equals(other: PatientId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PatientId)) {
      return false;
    }
    return this.id === other.id;
  }
}
