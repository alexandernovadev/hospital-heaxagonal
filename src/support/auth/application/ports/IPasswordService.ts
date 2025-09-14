import { PasswordHash } from "../../domain/value-objects/PasswordHash";

export interface IPasswordService {
  hashPassword(password: string): Promise<PasswordHash>;
  comparePassword(password: string, hash: PasswordHash): Promise<boolean>;
}
