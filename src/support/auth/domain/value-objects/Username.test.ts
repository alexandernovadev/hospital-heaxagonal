import { Username } from './Username';
import { InvalidUsernameError } from '../errors/InvalidUsernameError';

describe('Username', () => {
  it('should create a Username with a valid string', () => {
    const username = Username.create('testuser');
    expect(username).toBeInstanceOf(Username);
    expect(username.getValue()).toBe('testuser');
  });

  it('should trim whitespace from the username', () => {
    const username = Username.create('  testuser  ');
    expect(username.getValue()).toBe('testuser');
  });

  it('should convert username to lowercase', () => {
    const username = Username.create('TestUser');
    expect(username.getValue()).toBe('testuser');
  });

  it('should throw InvalidUsernameError for an empty string', () => {
    expect(() => Username.create('')).toThrow(InvalidUsernameError);
    expect(() => Username.create('   ')).toThrow(InvalidUsernameError);
  });

  it('should throw InvalidUsernameError for a username shorter than 3 characters', () => {
    expect(() => Username.create('ab')).toThrow(InvalidUsernameError);
  });

  it('should throw InvalidUsernameError for a username longer than 50 characters', () => {
    const longUsername = 'a'.repeat(51);
    expect(() => Username.create(longUsername)).toThrow(InvalidUsernameError);
  });

  it('should throw InvalidUsernameError for a username with invalid characters', () => {
    expect(() => Username.create('user_name!')).toThrow(InvalidUsernameError);
    expect(() => Username.create('user name')).toThrow(InvalidUsernameError);
    expect(() => Username.create('user@name')).toThrow(InvalidUsernameError);
  });

  it('should return true when two Username objects have the same value', () => {
    const username1 = Username.create('testuser');
    const username2 = Username.create('testuser');
    expect(username1.equals(username2)).toBeTruthy();
  });

  it('should return false when two Username objects have different values', () => {
    const username1 = Username.create('testuser1');
    const username2 = Username.create('testuser2');
    expect(username1.equals(username2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const username = Username.create('testuser');
    expect(username.equals(null)).toBeFalsy();
    expect(username.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-Username object', () => {
    const username = Username.create('testuser');
    expect(username.equals({} as Username)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const username = Username.create('testuser');
    expect(username.getValue()).toBe('testuser');
  });
});
