export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error(`Invalid email: ${email}`);
    }
    this._value = email.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  public getDomain(): string {
    return this._value.split('@')[1];
  }

  public getLocalPart(): string {
    return this._value.split('@')[0];
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
