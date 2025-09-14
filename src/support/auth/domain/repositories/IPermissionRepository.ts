import { Permission } from "../entities/Permission";
import { PermissionId } from "../value-objects/PermissionId";
import { PermissionName } from "../value-objects/PermissionName";
import { PermissionDescription } from "../value-objects/PermissionDescription";

export interface IPermissionRepository {
  findById(id: PermissionId): Promise<Permission | null>;
  findByName(name: PermissionName): Promise<Permission | null>;
  findByDescription(description: PermissionDescription): Promise<Permission[]>;
  findAll(): Promise<Permission[]>;
  save(permission: Permission): Promise<void>;
  delete(id: PermissionId): Promise<void>;
  exists(id: PermissionId): Promise<boolean>;
}
