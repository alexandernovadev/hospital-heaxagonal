import { Patient } from "./Patient";
import { PatientId } from "../value-objects/PatientId";
import { FullName } from "../value-objects/FullName";
import { DateOfBirth } from "../value-objects/DateOfBirth";
import { DNI } from "../value-objects/DNI";
import { ContactInfo } from "../value-objects/ContactInfo";
import { PhoneNumber } from "../value-objects/PhoneNumber";
import { Email } from "../../../../support/auth/domain/value-objects/Email"; // Importar desde Auth Context
import { Address } from "../value-objects/Address";

import { v4 as uuidv4 } from 'uuid';

// Mock de la librería uuid para asegurar IDs predecibles en los tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123-abc'),
}));

const MOCKED_DATE = new Date('2023-01-01T10:00:00.000Z');
const MOCKED_DATE_INCREMENT = 1000; // 1 second increment for each new Date()

describe('Patient', () => {

  let patientId: PatientId;
  let fullName: FullName;
  let dateOfBirth: DateOfBirth;
  let dni: DNI;
  let phoneNumber: PhoneNumber;
  let email: Email;
  let contactInfo: ContactInfo;
  let address: Address;

  beforeEach(() => {
    jest.useFakeTimers(); // Activar los fake timers de Jest para cada prueba
    jest.setSystemTime(MOCKED_DATE); // Establecer el tiempo del sistema para todas las pruebas
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba

    // Inicializar Value Objects comunes para usar en las pruebas
    patientId = PatientId.create('test-patient-id');
    fullName = FullName.create('John', 'Doe');
    dateOfBirth = DateOfBirth.create(new Date('1990-01-01'));
    dni = DNI.create('12345678A');
    phoneNumber = PhoneNumber.create('+34600112233');
    email = Email.create('john.doe@example.com');
    contactInfo = ContactInfo.create(email, phoneNumber);
    address = Address.create('Main St 123', 'Anytown', 'SomeState', '12345', 'Countryland');
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaurar los timers reales después de cada prueba
  });

  describe('fromPrimitives method', () => {
    it('should create a Patient instance from primitives', () => {
      const patient = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);

      expect(patient).toBeDefined();
      expect(patient.getId()).toEqual(patientId);
      expect(patient.getFullName()).toEqual(fullName);
      expect(patient.getDateOfBirth()).toEqual(dateOfBirth);
      expect(patient.getDNI()).toEqual(dni);
      expect(patient.getContactInfo()).toEqual(contactInfo);
      expect(patient.getAddress()).toEqual(address);
      expect(patient.getCreatedAt().getTime()).toBe(MOCKED_DATE.getTime());
      expect(patient.getUpdatedAt().getTime()).toBe(MOCKED_DATE.getTime());
    });
  });

  describe('register method', () => {
    it('should register a new Patient and generate a new PatientId', () => {
      const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);

      expect(patient).toBeDefined();
      expect(patient.getId().getValue()).toBe('mock-uuid-123-abc'); // ID mockeado
      expect(patient.getFullName()).toEqual(fullName);
      expect(patient.getDateOfBirth()).toEqual(dateOfBirth);
      expect(patient.getDNI()).toEqual(dni);
      expect(patient.getContactInfo()).toEqual(contactInfo);
      expect(patient.getAddress()).toEqual(address);
      expect(patient.getCreatedAt()).toBeInstanceOf(Date);
      expect(patient.getUpdatedAt()).toBeInstanceOf(Date);
      expect(patient.getCreatedAt().getTime()).toBe(MOCKED_DATE.getTime());
      expect(patient.getUpdatedAt().getTime()).toBe(MOCKED_DATE.getTime());
    });
  });

  describe('changeFullName method', () => {
    it('should change the full name and update updatedAt if different', () => {
      const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
      const newFullName = FullName.create('Jane', 'Doe');
      const oldUpdatedAt = patient.getUpdatedAt();

      // Avanzar el tiempo para asegurar que updatedAt sea mayor
      jest.advanceTimersByTime(MOCKED_DATE_INCREMENT);

      patient.changeFullName(newFullName);
      expect(patient.getFullName().equals(newFullName)).toBeTruthy();
      expect(patient.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should not change the full name or updatedAt if the new name is the same', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const oldUpdatedAt = patient.getUpdatedAt();

       // No avanzar el tiempo aquí, ya que no esperamos un cambio
       patient.changeFullName(fullName);
       expect(patient.getFullName().equals(fullName)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
    });
  });

  describe('changeDateOfBirth method', () => {
    it('should change the date of birth and update updatedAt if different', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const newDateOfBirth = DateOfBirth.create(new Date('1985-05-05'));
       const oldUpdatedAt = patient.getUpdatedAt();

       jest.advanceTimersByTime(MOCKED_DATE_INCREMENT);

       patient.changeDateOfBirth(newDateOfBirth);
       expect(patient.getDateOfBirth().equals(newDateOfBirth)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should not change the date of birth or updatedAt if the new date is the same', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const oldUpdatedAt = patient.getUpdatedAt();

       patient.changeDateOfBirth(dateOfBirth);
       expect(patient.getDateOfBirth().equals(dateOfBirth)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
    });
  });

  describe('changeDNI method', () => {
    it('should change the DNI and update updatedAt if different', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const newDNI = DNI.create('87654321B');
       const oldUpdatedAt = patient.getUpdatedAt();

       jest.advanceTimersByTime(MOCKED_DATE_INCREMENT);

       patient.changeDNI(newDNI);
       expect(patient.getDNI().equals(newDNI)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should not change the DNI or updatedAt if the new DNI is the same', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const oldUpdatedAt = patient.getUpdatedAt();

       patient.changeDNI(dni);
       expect(patient.getDNI().equals(dni)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
    });
  });

  describe('changeContactInfo method', () => {
    it('should change the contact info and update updatedAt if different', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const newEmail = Email.create('jane.doe@example.com');
       const newPhoneNumber = PhoneNumber.create('+34987654321');
       const newContactInfo = ContactInfo.create(newEmail, newPhoneNumber);
       const oldUpdatedAt = patient.getUpdatedAt();

       jest.advanceTimersByTime(MOCKED_DATE_INCREMENT);

       patient.changeContactInfo(newContactInfo);
       expect(patient.getContactInfo().equals(newContactInfo)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should not change the contact info or updatedAt if the new info is the same', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const oldUpdatedAt = patient.getUpdatedAt();

       patient.changeContactInfo(contactInfo);
       expect(patient.getContactInfo().equals(contactInfo)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
    });
  });

  describe('changeAddress method', () => {
    it('should change the address and update updatedAt if different', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const newAddress = Address.create('New St 456', 'Newtown', 'NewState', '54321', 'NewCountry');
       const oldUpdatedAt = patient.getUpdatedAt();

       jest.advanceTimersByTime(MOCKED_DATE_INCREMENT);

       patient.changeAddress(newAddress);
       expect(patient.getAddress().equals(newAddress)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should not change the address or updatedAt if the new address is the same', () => {
       const patient = Patient.register(fullName, dateOfBirth, dni, contactInfo, address);
       const oldUpdatedAt = patient.getUpdatedAt();

       patient.changeAddress(address);
       expect(patient.getAddress().equals(address)).toBeTruthy();
       expect(patient.getUpdatedAt().getTime()).toBe(oldUpdatedAt.getTime());
    });
  });

  describe('getters', () => {
    let patient: Patient;

    beforeEach(() => {
      patient = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
    });

    it('should return the correct PatientId', () => {
      expect(patient.getId()).toEqual(patientId);
    });

    it('should return the correct FullName', () => {
      expect(patient.getFullName()).toEqual(fullName);
    });

    it('should return the correct DateOfBirth', () => {
      expect(patient.getDateOfBirth()).toEqual(dateOfBirth);
    });

    it('should return the correct DNI', () => {
      expect(patient.getDNI()).toEqual(dni);
    });

    it('should return the correct ContactInfo', () => {
      expect(patient.getContactInfo()).toEqual(contactInfo);
    });

    it('should return the correct Address', () => {
      expect(patient.getAddress()).toEqual(address);
    });

    it('should return the correct createdAt date', () => {
      expect(patient.getCreatedAt().getTime()).toBe(MOCKED_DATE.getTime());
    });

    it('should return the correct updatedAt date', () => {
      expect(patient.getUpdatedAt().getTime()).toBe(MOCKED_DATE.getTime());
    });
  });

  describe('equals method', () => {
    it('should return true if two Patients have the same ID', () => {
      const patient1 = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
      const patient2 = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
      expect(patient1.equals(patient2)).toBeTruthy();
    });

    it('should return false if two Patients have different IDs', () => {
      const patient1 = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
      const otherPatientId = PatientId.create('other-id');
      const patient2 = Patient.fromPrimitives(otherPatientId, fullName, dateOfBirth, dni, contactInfo, address);
      expect(patient1.equals(patient2)).toBeFalsy();
    });

    it('should return false if comparing with null or undefined', () => {
      const patient1 = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
      expect(patient1.equals(null as any)).toBeFalsy();
      expect(patient1.equals(undefined as any)).toBeFalsy();
    });

    it('should return false if comparing with a non-Patient object', () => {
      const patient1 = Patient.fromPrimitives(patientId, fullName, dateOfBirth, dni, contactInfo, address);
      const nonPatient = { id: patientId.getValue() };
      expect(patient1.equals(nonPatient as any)).toBeFalsy();
    });
  });
});
