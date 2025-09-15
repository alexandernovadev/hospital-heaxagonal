export class RegisterPatientCommand {
    constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: Date,
    public readonly dni: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly zipCode: string
  ) {}
}