import { Request, Response, Router } from "express";
import { RegisterUser } from "../../application/use-cases/registeruser/RegisterUser";
import { AuthenticateUser } from "../../application/use-cases/authenticateuser/AuthenticateUser";
import { WeakPasswordError } from "../../application/errors/WeakPasswordError";
import { DuplicateUsernameError } from "../../application/errors/DuplicateUsernameError";
import { DuplicateEmailError } from "../../application/errors/DuplicateEmailError";
import { PasswordHashingFailedError } from "../../../../shared/application/errors/PasswordHashingFailedError";
import { InvalidCredentialsError } from "../../application/errors/InvalidCredentialsError";
import { UserAccountLockedError } from "../../application/errors/UserAccountLockedError";
import { TokenGenerationFailedError } from "../../application/errors/TokenGenerationFailedError";
import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class AuthController {
  public readonly router: Router;

  constructor(
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.authenticate.bind(this));
  }

  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const response = await this.registerUser.execute({
        username,
        email,
        password,
      });

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof WeakPasswordError) {
        return res.status(400).json({ message: error.message });
      } else if (error instanceof DuplicateUsernameError) {
        return res.status(409).json({ message: error.message });
      } else if (error instanceof DuplicateEmailError) {
        return res.status(409).json({ message: error.message });
      } else if (error instanceof PasswordHashingFailedError) {
        return res.status(500).json({ message: error.message });
      } else if (error instanceof ApplicationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error during user registration:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  }

  async authenticate(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const response = await this.authenticateUser.execute({
        email,
        password,
      });

      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({ message: error.message });
      } else if (error instanceof UserAccountLockedError) {
        return res.status(403).json({ message: error.message });
      } else if (error instanceof TokenGenerationFailedError) {
        return res.status(500).json({ message: error.message });
      } else if (error instanceof ApplicationError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error during user authentication:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
}
