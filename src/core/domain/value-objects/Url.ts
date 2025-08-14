export class Url {
  private readonly _value: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new Error(`Invalid URL: ${url}`);
    }
    this._value = url;
  }

  get value(): string {
    return this._value;
  }

  public isExternal(): boolean {
    return this._value.startsWith('http://') || this._value.startsWith('https://');
  }

  public getDomain(): string | null {
    if (!this.isExternal()) return null;

    try {
      const urlObj = new URL(this._value);
      return urlObj.hostname;
    } catch {
      return null;
    }
  }

  public equals(other: Url): boolean {
    return this._value === other._value;
  }

  private isValidUrl(url: string): boolean {
    if (url.startsWith('/') || url.startsWith('#')) {
      return true; // Internal URLs
    }

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
