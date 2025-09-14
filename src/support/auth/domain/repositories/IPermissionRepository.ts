import { Permission } from "../entities/Permission";
import { PermissionName } from "../value-objects/PermissionName";
import { PermissionDescription } from "../value-objects/PermissionDescription";
import { Role } from "../entities/Role";
import { PermissionId } from "../value-objects/PermissionId";
import { Email } from "../value-objects/Email";
import { Username } from "../value-objects/Username";
import { PasswordHash } from "../value-objects/PasswordHash";

export interface IPermissionRepository {
  save(user: Permission): Promise<void>;
  delete(user: PermissionId): Promise<void>;
  update(user: PermissionId): Promise<Permission | null>;
  exists(user: PermissionId): Promise<Permission | null>;

  findById(id: PermissionId): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByName(name: PermissionName): Promise<Permission | null>;
  findByDescription(description: PermissionDescription): Promise<Permission[]>;
  findByEmailAndPassword(
    email: Email,
    password: PasswordHash
  ): Promise<Permission | null>;
  findByUsernameAndPassword(
    username: Username,
    password: PasswordHash
  ): Promise<Permission | null>;
  findByRoleAndPermission(
    role: Role,
    permission: Permission
  ): Promise<Permission[]>;
  findByEmailAndRoleAndPermission(
    email: Email,
    role: Role,
    permission: Permission
  ): Promise<Permission | null>;
  findByUsernameAndRoleAndPermission(
    username: Username,
    role: Role,
    permission: Permission
  ): Promise<Permission | null>;
  findByEmailAndRoleAndPermissionAndPassword(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<Permission | null>;
  findByUsernameAndRoleAndPermissionAndPassword(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<Permission | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<Permission | null>;
  findByUsernameAndRoleAndPermissionAndPasswordAndEmail(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    email: Email
  ): Promise<Permission | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<Permission | null>;
}
