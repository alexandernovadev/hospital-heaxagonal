export class PatientRegisteredResponse {
  constructor(
    public readonly patientId: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly message: string = "Patient registered successfully."
  ) {}
}
