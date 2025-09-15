import { UserID } from './UserId';
import { InvalidUserError } from '../errors/InvalidUserError';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

describe('UserID', () => {
  it('should create a new UserID with a valid UUID when createNew is called', () => {
    const userId = UserID.createNew();
    expect(userId).toBeInstanceOf(UserID);
    expect(uuidValidate(userId.getValue())).toBeTruthy();
  });

  it('should create a UserID from a valid string', () => {
    const validUuid = uuidv4();
    const userId = UserID.fromString(validUuid);
    expect(userId).toBeInstanceOf(UserID);
    expect(userId.getValue()).toBe(validUuid);
  });

  it('should throw InvalidUserError for an empty string', () => {
    expect(() => UserID.fromString('')).toThrow(InvalidUserError);
  });

  it('should throw InvalidUserError for an invalid UUID string', () => {
    expect(() => UserID.fromString('invalid-uuid-string')).toThrow(InvalidUserError);
  });

  it('should return true when two UserID objects have the same value', () => {
    const uuid = uuidv4();
    const userId1 = UserID.fromString(uuid);
    const userId2 = UserID.fromString(uuid);
    expect(userId1.equals(userId2)).toBeTruthy();
  });

  it('should return false when two UserID objects have different values', () => {
    const userId1 = UserID.createNew();
    const userId2 = UserID.createNew();
    expect(userId1.equals(userId2)).toBeFalsy();
  });

  it('should return false when comparing with a non-UserID object', () => {
    const userId = UserID.createNew();
    expect(userId.equals({} as UserID)).toBeFalsy();
  });

  it('should return the underlying UUID string when getValue is called', () => {
    const validUuid = uuidv4();
    const userId = UserID.fromString(validUuid);
    expect(userId.getValue()).toBe(validUuid);
  });
});
