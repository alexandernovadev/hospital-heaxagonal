import { User } from "../entities/User";
import { UserID } from "../value-objects/UserId";
import { Username } from "../value-objects/Username";
import { Email } from "../value-objects/Email";

export interface IUserRepository {
  findById(id: UserID): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  exists(id: UserID): Promise<boolean>;
  save(user: User): Promise<void>;
  delete(id: UserID): Promise<void>;
}
