export abstract class DomainError extends Error {
  protected constructor(message: string, name: string = "DomainError") {
    super(message);
    this.name = name;
    // Set the prototype explicitly to ensure correct instanceof behavior
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
