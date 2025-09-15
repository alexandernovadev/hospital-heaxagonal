import { IPasswordService } from "../../application/ports/IPasswordService";
import { PasswordHash } from "../../domain/value-objects/PasswordHash";
import bcrypt from "bcryptjs";

export class BcryptPasswordService implements IPasswordService {
  async hashPassword(password: string): Promise<PasswordHash> {
    return PasswordHash.create(await bcrypt.hash(password, 10));
  }

  async comparePassword(
    password: string,
    hash: PasswordHash
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash.getValue());
  }
}
