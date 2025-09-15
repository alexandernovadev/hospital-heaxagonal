import { PermissionDescription } from './PermissionDescription';
import { InvalidPermissionDescriptionError } from '../errors/InvalidPermissionDescriptionError';

describe('PermissionDescription', () => {
  it('should create a PermissionDescription with a valid string', () => {
    const description = PermissionDescription.create('Allows viewing of patient records.');
    expect(description).toBeInstanceOf(PermissionDescription);
    expect(description.getValue()).toBe('Allows viewing of patient records.');
  });

  it('should trim whitespace from the permission description', () => {
    const description = PermissionDescription.create('  A description.  ');
    expect(description.getValue()).toBe('A description.');
  });

  it('should throw InvalidPermissionDescriptionError for an empty string', () => {
    expect(() => PermissionDescription.create('')).toThrow(InvalidPermissionDescriptionError);
    expect(() => PermissionDescription.create('   ')).toThrow(InvalidPermissionDescriptionError);
  });

  it('should throw InvalidPermissionDescriptionError for a description shorter than 3 characters', () => {
    expect(() => PermissionDescription.create('Ab')).toThrow(InvalidPermissionDescriptionError);
  });

  it('should throw InvalidPermissionDescriptionError for a description longer than 500 characters', () => {
    const longDescription = 'a'.repeat(501);
    expect(() => PermissionDescription.create(longDescription)).toThrow(InvalidPermissionDescriptionError);
  });

  it('should throw InvalidPermissionDescriptionError for a description with invalid HTML/XML characters', () => {
    expect(() => PermissionDescription.create('Contains <html> tags')).toThrow(InvalidPermissionDescriptionError);
    expect(() => PermissionDescription.create('Contains <script> tags')).toThrow(InvalidPermissionDescriptionError);
    expect(() => PermissionDescription.create('Contains &lt;html&gt; entities')).not.toThrow(InvalidPermissionDescriptionError);
  });

  it('should return true when two PermissionDescription objects have the same value', () => {
    const desc1 = PermissionDescription.create('Description one');
    const desc2 = PermissionDescription.create('Description one');
    expect(desc1.equals(desc2)).toBeTruthy();
  });

  it('should return false when two PermissionDescription objects have different values', () => {
    const desc1 = PermissionDescription.create('Description one');
    const desc2 = PermissionDescription.create('Description two');
    expect(desc1.equals(desc2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const desc = PermissionDescription.create('Description');
    expect(desc.equals(null)).toBeFalsy();
    expect(desc.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-PermissionDescription object', () => {
    const desc = PermissionDescription.create('Description');
    expect(desc.equals({} as PermissionDescription)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const desc = PermissionDescription.create('Description');
    expect(desc.getValue()).toBe('Description');
  });
});
