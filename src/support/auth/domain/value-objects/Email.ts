import { InvalidEmailError } from "../errors/InvalidEmailError";

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      throw new InvalidEmailError("Email address cannot be empty.");
    }

    // ⚙️ Comentario: Una expresión regular más robusta para validación de email.
    // Cubre la mayoría de los casos válidos, incluyendo subdominios y TLDs más largos.
    const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!emailRegex.test(trimmedEmail)) {
      throw new InvalidEmailError("Invalid email address format.");
    }

    if (trimmedEmail.length > 254) {
      throw new InvalidEmailError("Email address cannot be longer than 254 characters.");
    }

    return new Email(trimmedEmail);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }
}
