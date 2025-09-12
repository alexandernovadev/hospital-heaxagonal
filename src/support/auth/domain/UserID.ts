import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { InvalidUserError } from "./InvalidUserError";

export class UserID {
  private readonly id: string;

  private constructor(id: string) { 
    this.id = id;
  }

  // Método estático para crear un nuevo ID (generado)
  public static createNew(): UserID {
    return new UserID(uuidv4());
  }

  // Método estático para crear un ID a partir de una cadena existente (con validación)
  public static fromString(id: string): UserID {
    if (!uuidValidate(id)) {
      throw new InvalidUserError("Invalid UserID format.");
    }
    return new UserID(id);
  }

  public getValue(): string {
    return this.id;
  }

  // Método para la comparación por valor
  public equals(other: UserID): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof UserID)) {
      return false;
    }
    return this.id === other.id;
  }
}