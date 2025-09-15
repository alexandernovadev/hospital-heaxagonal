import { InvalidAddressError } from "../errors/InvalidAddressError";

export class Address {
  private readonly street: string;
  private readonly city: string;
  private readonly state: string;
  private readonly country: string;
  private readonly zipCode: string;

  private constructor(
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  ) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.country = country;
    this.zipCode = zipCode;
  }

  public static create(
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  ): Address {
    if (!street || street.trim() === "") {
      throw new InvalidAddressError("Address cannot be empty.");
    }

    if (!city || city.trim() === "") {
      throw new InvalidAddressError("City cannot be empty.");
    }

    if (!state || state.trim() === "") {
      throw new InvalidAddressError("State cannot be empty.");
    }

    if (!country || country.trim() === "") {
      throw new InvalidAddressError("Country cannot be empty.");
    }

    if (!zipCode || zipCode.trim() === "") {
      throw new InvalidAddressError("Zip code cannot be empty.");
    }

    return new Address(street, city, state, country, zipCode);
  }

  public getValue(): string {
    return `${this.street}, ${this.city}, ${this.state}, ${this.country}, ${this.zipCode}`;
  }

  public getCity(): string {
    return this.city;
  }

  public getState(): string {
    return this.state;
  }

  public getCountry(): string {
    return this.country;
  }

  public getZipCode(): string {
    return this.zipCode;
  }

  public equals(other: Address): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Address)) {
      return false;
    }
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.country === other.country &&
      this.zipCode === other.zipCode
    );
  }
}
