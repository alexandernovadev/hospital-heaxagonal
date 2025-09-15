import { User } from '../entities/User';
import { UserID } from '../value-objects/UserId';
import { Username } from '../value-objects/Username';
import { Email } from '../value-objects/Email';
import { PasswordHash } from '../value-objects/PasswordHash';
import { InvalidUsernameError } from '../errors/InvalidUsernameError';
import { InvalidEmailError } from '../errors/InvalidEmailError';
import { InvalidPasswordHashError } from '../errors/InvalidPasswordHashError';

describe('User', () => {
  let userId: UserID;
  let username: Username;
  let email: Email;
  let passwordHash: PasswordHash;
  const validBcryptHash = '$2a$10$abcdefghijklmnopqrstuvwxyzaabcdefghijklmnopqrstuv';

  beforeEach(() => {
    userId = UserID.createNew();
    username = Username.create('testuser');
    email = Email.create('test@example.com');
    passwordHash = PasswordHash.create(validBcryptHash);
  });

  it('should create a User instance', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(user).toBeInstanceOf(User);
    expect(user.getId().equals(userId)).toBeTruthy();
    expect(user.getUsername().equals(username)).toBeTruthy();
    expect(user.getEmail().equals(email)).toBeTruthy();
    expect(user.getPasswordHash().equals(passwordHash)).toBeTruthy();
    expect(user.getCreatedAt()).toBeInstanceOf(Date);
    expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    expect(user.getIsLocked()).toBe(false);
  });

  it('should return true for equal User objects', () => {
    const user1 = User.create(userId, username, email, passwordHash);
    const user2 = User.create(userId, username, email, passwordHash);
    expect(user1.equals(user2)).toBeTruthy();
  });

  it('should return false for different User objects', () => {
    const user1 = User.create(userId, username, email, passwordHash);
    const otherUserId = UserID.createNew();
    const user2 = User.create(otherUserId, username, email, passwordHash);
    expect(user1.equals(user2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(user.equals(null)).toBeFalsy();
    expect(user.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-User object', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(user.equals({} as User)).toBeFalsy();
  });

  it('should change the username', () => {
    const user = User.create(userId, username, email, passwordHash);
    const newUsername = Username.create('newuser');
    const oldUpdatedAt = user.getUpdatedAt();
    user.changeUsername(newUsername);
    expect(user.getUsername().equals(newUsername)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should not change the username if it is the same', () => {
    const user = User.create(userId, username, email, passwordHash);
    const oldUpdatedAt = user.getUpdatedAt();
    user.changeUsername(username);
    expect(user.getUsername().equals(username)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime()); // UpdatedAt should not change
  });

  it('should throw InvalidUsernameError when changing to an invalid username', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(() => user.changeUsername(Username.create('ab'))).toThrow(InvalidUsernameError);
  });

  it('should change the email', () => {
    const user = User.create(userId, username, email, passwordHash);
    const newEmail = Email.create('new@example.com');
    const oldUpdatedAt = user.getUpdatedAt();
    user.changeEmail(newEmail);
    expect(user.getEmail().equals(newEmail)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should not change the email if it is the same', () => {
    const user = User.create(userId, username, email, passwordHash);
    const oldUpdatedAt = user.getUpdatedAt();
    user.changeEmail(email);
    expect(user.getEmail().equals(email)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime()); // UpdatedAt should not change
  });

  it('should throw InvalidEmailError when changing to an invalid email', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(() => user.changeEmail(Email.create('invalid-email'))).toThrow(InvalidEmailError);
  });

  it('should change the password hash', () => {
    const user = User.create(userId, username, email, passwordHash);
    const newPasswordHash = PasswordHash.create('$2a$10$newhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'); // 60 chars
    const oldUpdatedAt = user.getUpdatedAt();
    user.changePasswordHash(newPasswordHash);
    expect(user.getPasswordHash().equals(newPasswordHash)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should not change the password hash if it is the same', () => {
    const user = User.create(userId, username, email, passwordHash);
    const oldUpdatedAt = user.getUpdatedAt();
    user.changePasswordHash(passwordHash);
    expect(user.getPasswordHash().equals(passwordHash)).toBeTruthy();
    expect(user.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime()); // UpdatedAt should not change
  });

  it('should throw InvalidPasswordHashError when changing to an invalid password hash', () => {
    const user = User.create(userId, username, email, passwordHash);
    expect(() => user.changePasswordHash(PasswordHash.create('short'))).toThrow(InvalidPasswordHashError);
  });

  it('should lock the user account', () => {
    const user = User.create(userId, username, email, passwordHash);
    const oldUpdatedAt = user.getUpdatedAt();
    user.lockAccount();
    expect(user.getIsLocked()).toBe(true);
    expect(user.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should not change updated timestamp if account is already locked', () => {
    const user = User.create(userId, username, email, passwordHash);
    user.lockAccount(); // Lock it once
    const oldUpdatedAt = user.getUpdatedAt();
    user.lockAccount(); // Try to lock it again
    expect(user.getIsLocked()).toBe(true);
    expect(user.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
  });

  it('should unlock the user account', () => {
    const user = User.create(userId, username, email, passwordHash);
    user.lockAccount(); // Lock first
    const oldUpdatedAt = user.getUpdatedAt();
    user.unlockAccount();
    expect(user.getIsLocked()).toBe(false);
    expect(user.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it('should not change updated timestamp if account is already unlocked', () => {
    const user = User.create(userId, username, email, passwordHash);
    const oldUpdatedAt = user.getUpdatedAt();
    user.unlockAccount(); // Try to unlock it (already unlocked by default)
    expect(user.getIsLocked()).toBe(false);
    expect(user.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
  });

  it('should recreate user from existing data', () => {
    const creationDate = new Date();
    const updateDate = new Date();
    const user = User.recreate(userId, username, email, passwordHash, true, creationDate, updateDate);

    expect(user.getId().equals(userId)).toBeTruthy();
    expect(user.getUsername().equals(username)).toBeTruthy();
    expect(user.getEmail().equals(email)).toBeTruthy();
    expect(user.getPasswordHash().equals(passwordHash)).toBeTruthy();
    expect(user.getIsLocked()).toBe(true);
    expect(user.getCreatedAt().getTime()).toBe(creationDate.getTime());
    expect(user.getUpdatedAt().getTime()).toBe(updateDate.getTime());
  });
});
