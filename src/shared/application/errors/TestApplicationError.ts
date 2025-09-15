import { ApplicationError } from "./ApplicationError";

export class TestApplicationError extends ApplicationError {
  constructor(message: string) {
    super(message, "TestApplicationError");
  }
}
