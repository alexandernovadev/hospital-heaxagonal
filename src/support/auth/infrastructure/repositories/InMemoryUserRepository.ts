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
    // ⚙️ Comentario: Mejora en save() para manejar creación y actualización por ID
    const existingIndex = this.users.findIndex((u) => u.getId().equals(user.getId()));
    if (existingIndex > -1) {
      this.users[existingIndex] = user; // Actualiza el usuario existente
    } else {
      this.users.push(user); // Añade un nuevo usuario
    }
  }

  async delete(id: UserID): Promise<void> {
    this.users = this.users.filter((user) => !user.getId().equals(id));
  }
}
