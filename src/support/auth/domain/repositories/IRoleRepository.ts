import { Role } from "../entities/Role";
import { RoleId } from "../value-objects/RoleId";
import { RoleName } from "../value-objects/RoleName";
import { RoleDescription } from "../value-objects/RoleDescription";

export interface IRoleRepository {
  findById(id: RoleId): Promise<Role | null>;
  findByName(name: RoleName): Promise<Role | null>;
  findByDescription(description: RoleDescription): Promise<Role[]>;
  findAll(): Promise<Role[]>;
  save(role: Role): Promise<void>;
  delete(id: RoleId): Promise<void>;
  exists(id: RoleId): Promise<boolean>;
}
