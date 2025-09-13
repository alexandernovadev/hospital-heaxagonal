import { InvalidRoleNameError } from "../errors/InvalidRoleNameError";

export class RoleName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(name: string): RoleName {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      throw new InvalidRoleNameError("Role name cannot be empty.");
    }

    if (trimmedName.length < 4 || trimmedName.length > 50) {
      throw new InvalidRoleNameError(
        "Role name must be between 4 and 50 characters."
      );
    }

    // Reglas específicas del dominio hospitalario para nombres de roles
    // No permitir caracteres especiales que puedan ser usados en consultas o identificadores
    if (/[^a-zA-Z0-9\s-]/.test(trimmedName)) { // Permite letras, números, espacios y guiones
      throw new InvalidRoleNameError(
        "Role name must not include special characters (except hyphens and spaces)."
      );
    }

    // Considerar normalización a Mayúsculas o Minúsculas si la sensibilidad es un problema
    // Por ejemplo: return new RoleName(trimmedName.toUpperCase());
    // Por ahora, lo dejamos tal cual para mantener la flexibilidad, pero es una decisión de dominio.

    return new RoleName(trimmedName);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: RoleName): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof RoleName)) {
      return false;
    }
    return this.value === other.value;
  }
}
