import { RoleDescription } from './RoleDescription';
import { InvalidRoleDescriptionError } from '../errors/InvalidRoleDescriptionError';

describe('RoleDescription', () => {
  it('should create a RoleDescription with a valid string', () => {
    const description = RoleDescription.create('A detailed description of the administrator role.');
    expect(description).toBeInstanceOf(RoleDescription);
    expect(description.getValue()).toBe('A detailed description of the administrator role.');
  });

  it('should trim whitespace from the role description', () => {
    const description = RoleDescription.create('  A description.  ');
    expect(description.getValue()).toBe('A description.');
  });

  it('should throw InvalidRoleDescriptionError for an empty string', () => {
    expect(() => RoleDescription.create('')).toThrow(InvalidRoleDescriptionError);
    expect(() => RoleDescription.create('   ')).toThrow(InvalidRoleDescriptionError);
  });

  it('should throw InvalidRoleDescriptionError for a description shorter than 3 characters', () => {
    expect(() => RoleDescription.create('Ab')).toThrow(InvalidRoleDescriptionError);
  });

  it('should throw InvalidRoleDescriptionError for a description longer than 500 characters', () => {
    const longDescription = 'a'.repeat(501);
    expect(() => RoleDescription.create(longDescription)).toThrow(InvalidRoleDescriptionError);
  });

  it('should throw InvalidRoleDescriptionError for a description with invalid HTML/XML characters', () => {
    expect(() => RoleDescription.create('Contains <html> tags')).toThrow(InvalidRoleDescriptionError);
    expect(() => RoleDescription.create('Contains <script> tags')).toThrow(InvalidRoleDescriptionError);
    expect(() => RoleDescription.create('Contains &lt;html&gt; entities')).not.toThrow(InvalidRoleDescriptionError);
  });

  it('should return true when two RoleDescription objects have the same value', () => {
    const desc1 = RoleDescription.create('Description one');
    const desc2 = RoleDescription.create('Description one');
    expect(desc1.equals(desc2)).toBeTruthy();
  });

  it('should return false when two RoleDescription objects have different values', () => {
    const desc1 = RoleDescription.create('Description one');
    const desc2 = RoleDescription.create('Description two');
    expect(desc1.equals(desc2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const desc = RoleDescription.create('Description');
    expect(desc.equals(null)).toBeFalsy();
    expect(desc.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-RoleDescription object', () => {
    const desc = RoleDescription.create('Description');
    expect(desc.equals({} as RoleDescription)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const desc = RoleDescription.create('Description');
    expect(desc.getValue()).toBe('Description');
  });
});
