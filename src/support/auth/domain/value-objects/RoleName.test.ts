import { RoleName } from './RoleName';
import { InvalidRoleNameError } from '../errors/InvalidRoleNameError';

describe('RoleName', () => {
  it('should create a RoleName with a valid string', () => {
    const roleName = RoleName.create('Admin');
    expect(roleName).toBeInstanceOf(RoleName);
    expect(roleName.getValue()).toBe('Admin');
  });

  it('should trim whitespace from the role name', () => {
    const roleName = RoleName.create('  Admin  ');
    expect(roleName.getValue()).toBe('Admin');
  });

  it('should throw InvalidRoleNameError for an empty string', () => {
    expect(() => RoleName.create('')).toThrow(InvalidRoleNameError);
    expect(() => RoleName.create('   ')).toThrow(InvalidRoleNameError);
  });

  it('should throw InvalidRoleNameError for a role name shorter than 3 characters', () => {
    expect(() => RoleName.create('Ad')).toThrow(InvalidRoleNameError);
  });

  it('should throw InvalidRoleNameError for a role name longer than 50 characters', () => {
    const longRoleName = 'a'.repeat(51);
    expect(() => RoleName.create(longRoleName)).toThrow(InvalidRoleNameError);
  });

  it('should throw InvalidRoleNameError for a role name with invalid characters', () => {
    expect(() => RoleName.create('Admin!')).toThrow(InvalidRoleNameError);
    expect(() => RoleName.create('Ad min')).toThrow(InvalidRoleNameError);
    expect(() => RoleName.create('Admin@')).toThrow(InvalidRoleNameError);
  });

  it('should return true when two RoleName objects have the same value', () => {
    const roleName1 = RoleName.create('Admin');
    const roleName2 = RoleName.create('Admin');
    expect(roleName1.equals(roleName2)).toBeTruthy();
  });

  it('should return false when two RoleName objects have different values', () => {
    const roleName1 = RoleName.create('Admin');
    const roleName2 = RoleName.create('User');
    expect(roleName1.equals(roleName2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const roleName = RoleName.create('Admin');
    expect(roleName.equals(null)).toBeFalsy();
    expect(roleName.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-RoleName object', () => {
    const roleName = RoleName.create('Admin');
    expect(roleName.equals({} as RoleName)).toBeFalsy();
  });

  it('should return the underlying string value when getValue is called', () => {
    const roleName = RoleName.create('Admin');
    expect(roleName.getValue()).toBe('Admin');
  });
});
