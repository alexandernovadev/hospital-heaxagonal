import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserID } from "../../domain/value-objects/UserId";
import { Username } from "../../domain/value-objects/Username";
import { Email } from "../../domain/value-objects/Email";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: UserID): Promise<User | null> {
    return this.users.find((user) => user.getId().equals(id)) || null;
  }

  async findByUsername(username: Username): Promise<User | null> {
    return (
      this.users.find((user) => user.getUsername().equals(username)) || null
    );
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find((user) => user.getEmail().equals(email)) || null;
  }

  async exists(id: UserID): Promise<boolean> {
    return this.users.some((user) => user.getId().equals(id));
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async delete(id: UserID): Promise<void> {
    this.users = this.users.filter((user) => !user.getId().equals(id));
  }
}
