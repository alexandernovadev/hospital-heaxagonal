import { InvalidEmailError } from "./errors/InvalidEmailError";

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    const trimmedEmail = email.trim();

    if (trimmedEmail === "") {
      throw new InvalidEmailError("Email address cannot be empty.");
    }

    // Regex para validación de formato de correo electrónico básico
    // Este regex es simple y cubre la mayoría de los casos, pero no todos los escenarios RFC.
    // Para validaciones más estrictas en un entorno de producción, se podría usar una librería.
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new InvalidEmailError("Invalid email address format.");
    }

    if (trimmedEmail.length > 255) {
      throw new InvalidEmailError("Email address is too long.");
    }

    // Normalizar a minúsculas para consistencia en la comparación
    return new Email(trimmedEmail.toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }
}
