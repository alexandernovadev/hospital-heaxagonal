import { Role } from "../entities/Role";
import { RoleName } from "../value-objects/RoleName";
import { RoleDescription } from "../value-objects/RoleDescription";
import { Permission } from "../entities/Permission";
import { RoleId } from "../value-objects/RoleId";
import { Email } from "../value-objects/Email";
import { PasswordHash } from "../value-objects/PasswordHash";
import { Username } from "../value-objects/Username";

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  delete(role: RoleId): Promise<void>;
  update(role: RoleId): Promise<Role | null>;
  exists(role: RoleId): Promise<Role | null>;

  findById(id: RoleId): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findByName(name: RoleName): Promise<Role | null>;
  findByDescription(description: RoleDescription): Promise<Role[]>;
  findByEmailAndPassword(
    email: Email,
    password: PasswordHash
  ): Promise<Role | null>;
  findByUsernameAndPassword(
    username: Username,
    password: PasswordHash
  ): Promise<Role | null>;
  findByRoleAndPermission(role: Role, permission: Permission): Promise<Role[]>;
  findByEmailAndRoleAndPermission(
    email: Email,
    role: Role,
    permission: Permission
  ): Promise<Role | null>;
  findByUsernameAndRoleAndPermission(
    username: Username,
    role: Role,
    permission: Permission
  ): Promise<Role | null>;
  findByEmailAndRoleAndPermissionAndPassword(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<Role | null>;
  findByUsernameAndRoleAndPermissionAndPassword(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<Role | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<Role | null>;
  findByUsernameAndRoleAndPermissionAndPasswordAndEmail(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    email: Email
  ): Promise<Role | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<Role | null>;
  findByUsernameAndRoleAndPermissionAndPasswordAndEmail(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    email: Email
  ): Promise<Role | null>;
}
