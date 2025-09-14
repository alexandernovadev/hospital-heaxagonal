import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { UserID } from "../value-objects/UserId";
import { Username } from "../value-objects/Username";
import { Email } from "../value-objects/Email";
import { PasswordHash } from "../value-objects/PasswordHash";

export interface IUserRepository {
  save(user: User): Promise<void>;
  delete(user: UserID): Promise<void>;
  update(user: UserID): Promise<void>;
  exists(user: UserID): Promise<boolean>;

  findByEmail(email: Email): Promise<User | null>;
  findById(id: UserID): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByUsername(username: Username): Promise<User | null>;
  findByRole(role: Role): Promise<User[]>;
  findByPermission(permission: Permission): Promise<User[]>;
  findByEmailAndPassword(
    email: Email,
    password: PasswordHash
  ): Promise<User | null>;
  findByUsernameAndPassword(
    username: Username,
    password: PasswordHash
  ): Promise<User | null>;
  findByRoleAndPermission(role: Role, permission: Permission): Promise<User[]>;
  findByEmailAndRoleAndPermission(
    email: Email,
    role: Role,
    permission: Permission
  ): Promise<User | null>;
  findByUsernameAndRoleAndPermission(
    username: Username,
    role: Role,
    permission: Permission
  ): Promise<User | null>;
  findByEmailAndRoleAndPermissionAndPassword(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<User | null>;
  findByUsernameAndRoleAndPermissionAndPassword(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash
  ): Promise<User | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<User | null>;
  findByUsernameAndRoleAndPermissionAndPasswordAndEmail(
    username: Username,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    email: Email
  ): Promise<User | null>;
  findByEmailAndRoleAndPermissionAndPasswordAndUsername(
    email: Email,
    role: Role,
    permission: Permission,
    password: PasswordHash,
    username: Username
  ): Promise<User | null>;
}
