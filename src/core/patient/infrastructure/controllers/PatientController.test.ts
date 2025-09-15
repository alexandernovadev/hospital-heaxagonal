import { Request, Response, Router } from 'express';
import { RegisterPatient } from '../../../application/use-cases/registerpatient/RegisterPatient';
import { PatientController } from './PatientController';
import { RegisterPatientCommand } from '../../../application/dto/RegisterPatientCommand';
import { PatientRegisteredResponse } from '../../../application/dto/PatientRegisteredResponse';
import { DuplicateDNIError } from '../../../application/errors/DuplicateDNIError';
import { ApplicationError } from '../../../../shared/application/errors/ApplicationError';

// Mockear express para controlar sus funciones
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
  })),
}));

// Mockear el caso de uso RegisterPatient
const mockRegisterPatientUseCase = {
  execute: jest.fn(),
};

describe('PatientController', () => {
  let patientController: PatientController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar todos los mocks antes de cada prueba

    // Resetear el mock del Router
    mockRouter = {
      post: jest.fn(),
      use: jest.fn(),
      get: jest.fn(),
      // Agrega otros métodos de Router si los necesitas, como .put, .delete, etc.
    } as jest.Mocked<Router>;
    (Router as jest.Mock).mockReturnValue(mockRouter);

    patientController = new PatientController(mockRegisterPatientUseCase as any);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(), // encadenar .status().json()
      json: jest.fn(),
    };
  });

  describe('POST /register', () => {
    it('should register a patient successfully and return 201 Created', async () => {
      // 📝 Datos de entrada para la prueba
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01', // Se convierte a Date en el controlador
        dni: '12345678A',
        email: 'john.doe@example.com',
        phoneNumber: '+34600112233',
        street: 'Main St 123',
        city: 'Anytown',
        state: 'SomeState',
        country: 'Countryland',
        zipCode: '12345',
      };
      mockRequest.body = requestBody;

      // 📞 Configurar el mock del caso de uso para un éxito
      const expectedResponse: PatientRegisteredResponse = {
        patientId: 'mock-patient-id',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Patient registered successfully.',
      };
      mockRegisterPatientUseCase.execute.mockResolvedValue(expectedResponse);

      // ✅ Ejecutar el método del controlador
      await (patientController as any).register(mockRequest, mockResponse);

      // 🧐 Afirmaciones
      expect(mockRegisterPatientUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockRegisterPatientUseCase.execute).toHaveBeenCalledWith(
        expect.any(RegisterPatientCommand) // Verificar que se llama con una instancia del comando
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return 409 Conflict if DNI is duplicated', async () => {
      // 📝 Datos de entrada para la prueba
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        dni: '12345678A',
        email: 'john.doe@example.com',
        phoneNumber: '+34600111111',
        street: 'Main St 123',
        city: 'Anytown',
        state: 'SomeState',
        country: 'Countryland',
        zipCode: '12345',
      };
      mockRequest.body = requestBody;

      // 🚨 Configurar el mock del caso de uso para que lance DuplicateDNIError
      const errorMessage = 'Patient with this DNI already exists.';
      mockRegisterPatientUseCase.execute.mockRejectedValue(new DuplicateDNIError(errorMessage));

      // ✅ Ejecutar el método del controlador
      await (patientController as any).register(mockRequest, mockResponse);

      // 🧐 Afirmaciones
      expect(mockRegisterPatientUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should return 400 Bad Request for other ApplicationErrors', async () => {
      // 📝 Datos de entrada para la prueba
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: 'invalid-date', // Esto podría causar un InvalidDateOfBirthError internamente
        dni: '12345678A',
        email: 'john.doe@example.com',
        phoneNumber: '+34600112233',
        street: 'Main St 123',
        city: 'Anytown',
        state: 'SomeState',
        country: 'Countryland',
        zipCode: '12345',
      };
      mockRequest.body = requestBody;

      // ❌ Configurar el mock del caso de uso para que lance un ApplicationError genérico
      class TestApplicationError extends ApplicationError {
        constructor(message: string) {
          super(message, 'TestApplicationError');
        }
      }
      const errorMessage = 'Invalid input data.';
      mockRegisterPatientUseCase.execute.mockRejectedValue(new TestApplicationError(errorMessage));

      // ✅ Ejecutar el método del controlador
      await (patientController as any).register(mockRequest, mockResponse);

      // 🧐 Afirmaciones
      expect(mockRegisterPatientUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should return 500 Internal Server Error for unexpected errors', async () => {
      // 📝 Datos de entrada para la prueba
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        dni: '12345678A',
        email: 'john.doe@example.com',
        phoneNumber: '+34600112233',
        street: 'Main St 123',
        city: 'Anytown',
        state: 'SomeState',
        country: 'Countryland',
        zipCode: '12345',
      };
      mockRequest.body = requestBody;

      // 💥 Configurar el mock del caso de uso para que lance un error inesperado
      const errorMessage = 'Something went horribly wrong!';
      mockRegisterPatientUseCase.execute.mockRejectedValue(new Error(errorMessage));

      // ✅ Ejecutar el método del controlador
      await (patientController as any).register(mockRequest, mockResponse);

      // 🧐 Afirmaciones
      expect(mockRegisterPatientUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
      // Opcional: Podrías verificar que console.error fue llamado
      // expect(console.error).toHaveBeenCalled();
    });
  });
});
