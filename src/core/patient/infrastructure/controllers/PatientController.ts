import { Router, Request, Response } from "express";
import { RegisterPatient } from "../../application/use-cases/registerpatient/RegisterPatient";
import { RegisterPatientCommand } from "../../application/dto/RegisterPatientCommand";
import { PatientRegisteredResponse } from "../../application/dto/PatientRegisteredResponse";
import { DuplicateDNIError } from "../../application/errors/DuplicateDNIError";
import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";
import { DomainError } from "../../../../shared/domain/DomainError"; // ⚠️ Corregir la ruta de importación de DomainError

export class PatientController {
  public readonly router: Router;

  constructor(private registerPatientUseCase: RegisterPatient) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post("/register", this.register.bind(this));
  }

  private async register(req: Request, res: Response): Promise<Response> {
    try {
      // 📝 Mapear los datos del body a un RegisterPatientCommand
      const command = new RegisterPatientCommand(
        req.body.firstName,
        req.body.lastName,
        new Date(req.body.dateOfBirth),
        req.body.dni,
        req.body.email,
        req.body.phoneNumber,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.country,
        req.body.zipCode
      );

      // 📞 Llamar al caso de uso de la capa de aplicación
      const response: PatientRegisteredResponse = await this.registerPatientUseCase.execute(command);

      // ✅ Devolver una respuesta exitosa
      return res.status(201).json(response);
    } catch (error) {
      // 🚨 Manejar errores específicos de la aplicación (como DNI duplicado)
      if (error instanceof DuplicateDNIError) {
        return res.status(409).json({ message: error.message }); // 409 Conflict
      }

      // ❌ Manejar errores de la capa de Aplicación o del Dominio (ej. validación de Value Objects)
      if (error instanceof ApplicationError || error instanceof DomainError) {
        return res.status(400).json({ message: error.message }); // 400 Bad Request
      }

      // 💥 Manejar errores inesperados
      console.error("Error registering patient:", error instanceof Error ? error.message : error); // ℹ️ Ajuste para el tipo 'unknown'
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
