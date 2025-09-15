import { PermissionName } from './PermissionName';
import { InvalidPermissionNameError } from '../errors/InvalidPermissionNameError';

describe('PermissionName', () => {
  it('should create a PermissionName with a valid string', () => {
    const permissionName = PermissionName.create('ViewPatients');
    expect(permissionName).toBeInstanceOf(PermissionName);
    expect(permissionName.getValue()).toBe('ViewPatients');
  });

  it('should trim whitespace from the permission name', () => {
    const permissionName = PermissionName.create('  ViewPatients  ');
    expect(permissionName.getValue()).toBe('ViewPatients');
  });

  it('should throw InvalidPermissionNameError for an empty string', () => {
    expect(() => PermissionName.create('')).toThrow(InvalidPermissionNameError);
    expect(() => PermissionName.create('   ')).toThrow(InvalidPermissionNameError);
  });

  it('should throw InvalidPermissionNameError for a permission name shorter than 3 characters', () => {
    expect(() => PermissionName.create('Vi')).toThrow(InvalidPermissionNameError);
  });

  it('should throw InvalidPermissionNameError for a permission name longer than 50 characters', () => {
    const longPermissionName = 'a'.repeat(51);
    expect(() => PermissionName.create(longPermissionName)).toThrow(InvalidPermissionNameError);
  });

  it('should throw InvalidPermissionNameError for a permission name with invalid characters', () => {
    expect(() => PermissionName.create('ViewPatients!')).toThrow(InvalidPermissionNameError);
    expect(() => PermissionName.create('View Patients')).toThrow(InvalidPermissionNameError);
    expect(() => PermissionName.create('View@Patients')).toThrow(InvalidPermissionNameError);
  });

  it('should return true when two PermissionName objects have the same value', () => {
    const permissionName1 = PermissionName.create('ViewPatients');
    const permissionName2 = PermissionName.create('ViewPatients');
    expect(permissionName1.equals(permissionName2)).toBeTruthy();
  });

  it('should return false when two PermissionName objects have different values', () => {
    const permissionName1 = PermissionName.create('ViewPatients');
    const permissionName2 = PermissionName.create('EditPatients');
    expect(permissionName1.equals(permissionName2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const permissionName = PermissionName.create('ViewPatients');
    expect(permissionName.equals(null)).toBeFalsy();
    expect(permissionName.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-PermissionName object', () => {
    const permissionName = PermissionName.create('ViewPatients');
    expect(permissionName.equals({} as PermissionName)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const permissionName = PermissionName.create('ViewPatients');
    expect(permissionName.getValue()).toBe('ViewPatients');
  });
});
