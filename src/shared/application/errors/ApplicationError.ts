export abstract class ApplicationError extends Error {
  protected constructor(message: string, name: string = "ApplicationError") {
    super(message);
    this.name = name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
