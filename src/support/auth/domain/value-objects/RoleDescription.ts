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

    // ⚙️ Comentario: Expresión regular para permitir letras, números, espacios y la mayoría de los signos de puntuación.
    // No debe contener los caracteres literales < o > para evitar la inyección de HTML/XML. El '&' se permite, ya que puede formar parte de entidades HTML válidas.
    const htmlXmlRegex = /[<>]/;

    if (htmlXmlRegex.test(trimmedDescription)) {
      throw new InvalidRoleDescriptionError("Role description must not include literal HTML/XML characters (<, >).");
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
