import { Email } from './Email';
import { InvalidEmailError } from '../errors/InvalidEmailError';

describe('Email', () => {
  it('should create an Email with a valid format', () => {
    const email = Email.create('test@example.com');
    expect(email).toBeInstanceOf(Email);
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should trim whitespace from the email', () => {
    const email = Email.create('  test@example.com  ');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should convert email to lowercase', () => {
    const email = Email.create('Test@Example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw InvalidEmailError for an empty string', () => {
    expect(() => Email.create('')).toThrow(InvalidEmailError);
    expect(() => Email.create('   ')).toThrow(InvalidEmailError);
  });

  it('should throw InvalidEmailError for an invalid email format', () => {
    expect(() => Email.create('invalid-email')).toThrow(InvalidEmailError);
    expect(() => Email.create('invalid@')).toThrow(InvalidEmailError);
    expect(() => Email.create('@example.com')).toThrow(InvalidEmailError);
    expect(() => Email.create('test@.com')).toThrow(InvalidEmailError);
    expect(() => Email.create('test@example')).toThrow(InvalidEmailError);
  });

  it('should throw InvalidEmailError for an email longer than 254 characters', () => {
    const longLocalPart = 'a'.repeat(64); // Max 64 for local part
    const longDomainPart = 'b'.repeat(255 - 64 - 1 - 4);
    const longEmail = `${longLocalPart}@${longDomainPart}.com`;
    // This will exceed 254 if not carefully constructed for specific email format rules.
    // For a simpler test, we can just make a very long string.
    const veryLongEmail = 'a'.repeat(249) + '@b.com'; // Total 255 chars
    expect(() => Email.create(veryLongEmail)).toThrow(InvalidEmailError);
  });

  it('should return true when two Email objects have the same value', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');
    expect(email1.equals(email2)).toBeTruthy();
  });

  it('should return false when two Email objects have different values', () => {
    const email1 = Email.create('test1@example.com');
    const email2 = Email.create('test2@example.com');
    expect(email1.equals(email2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const email = Email.create('test@example.com');
    expect(email.equals(null)).toBeFalsy();
    expect(email.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-Email object', () => {
    const email = Email.create('test@example.com');
    expect(email.equals({} as Email)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const email = Email.create('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });
});
