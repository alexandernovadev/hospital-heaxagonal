import { PermissionId } from './PermissionId';
import { InvalidPermissionError } from '../errors/InvalidPermissionError';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

describe('PermissionId', () => {
  it('should create a new PermissionId with a valid UUID when createNew is called', () => {
    const permissionId = PermissionId.createNew();
    expect(permissionId).toBeInstanceOf(PermissionId);
    expect(uuidValidate(permissionId.getValue())).toBeTruthy();
  });

  it('should create a PermissionId from a valid string', () => {
    const validUuid = uuidv4();
    const permissionId = PermissionId.fromString(validUuid);
    expect(permissionId).toBeInstanceOf(PermissionId);
    expect(permissionId.getValue()).toBe(validUuid);
  });

  it('should throw InvalidPermissionError for an empty string', () => {
    expect(() => PermissionId.fromString('')).toThrow(InvalidPermissionError);
  });

  it('should throw InvalidPermissionError for an invalid UUID string', () => {
    expect(() => PermissionId.fromString('invalid-uuid-string')).toThrow(InvalidPermissionError);
  });

  it('should return true when two PermissionId objects have the same value', () => {
    const uuid = uuidv4();
    const permissionId1 = PermissionId.fromString(uuid);
    const permissionId2 = PermissionId.fromString(uuid);
    expect(permissionId1.equals(permissionId2)).toBeTruthy();
  });

  it('should return false when two PermissionId objects have different values', () => {
    const permissionId1 = PermissionId.createNew();
    const permissionId2 = PermissionId.createNew();
    expect(permissionId1.equals(permissionId2)).toBeFalsy();
  });

  it('should return false when comparing with null or undefined', () => {
    const permissionId = PermissionId.createNew();
    expect(permissionId.equals(null)).toBeFalsy();
    expect(permissionId.equals(undefined)).toBeFalsy();
  });

  it('should return false when comparing with a non-PermissionId object', () => {
    const permissionId = PermissionId.createNew();
    expect(permissionId.equals({} as PermissionId)).toBeFalsy();
  });

  it('should return the underlying UUID string when getValue is called', () => {
    const validUuid = uuidv4();
    const permissionId = PermissionId.fromString(validUuid);
    expect(permissionId.getValue()).toBe(validUuid);
  });
});
