import { InvalidRoleDescriptionError } from "../errors/InvalidRoleDescriptionError";

export class RoleDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(description: string): RoleDescription {
    const trimmedDescription = description.trim();

    if (trimmedDescription === "") {
      throw new InvalidRoleDescriptionError("Role description cannot be empty.");
    }

    if (trimmedDescription.length < 4 || trimmedDescription.length > 255) {
      throw new InvalidRoleDescriptionError(
        "Role description must be between 4 and 255 characters."
      );
    }

    // Reglas específicas del dominio hospitalario para descripciones
    // Permitimos más flexibilidad que en el nombre, pero seguimos sin permitir ciertos caracteres de control
    if (/[<>&]/.test(trimmedDescription)) { // Evitar HTML/XML básicos para seguridad y representación
      throw new InvalidRoleDescriptionError(
        "Role description must not include HTML/XML special characters (<, >, &)."
      );
    }

    return new RoleDescription(trimmedDescription);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: RoleDescription): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof RoleDescription)) {
      return false;
    }
    return this.value === other.value;
  }
}
