import { BaseEntity } from './BaseEntity';
import { Email } from '../value-objects/Email';
import { Url } from '../value-objects/Url';

export interface ContactInfoProps {
  id: number;
  text: string;
  email: Email;
  whatsapp: string;
  instagram: Url;
  createdAt: Date;
  updatedAt: Date;
}

export class ContactInfo extends BaseEntity {
  private readonly _text: string;
  private readonly _email: Email;
  private readonly _whatsapp: string;
  private readonly _instagram: Url;

  constructor(props: ContactInfoProps) {
    super(props.id, props.createdAt, props.updatedAt);
    
    this._text = props.text;
    this._email = props.email;
    this._whatsapp = this.validateWhatsApp(props.whatsapp);
    this._instagram = props.instagram;
  }

  get text(): string {
    return this._text;
  }

  get email(): Email {
    return this._email;
  }

  get whatsapp(): string {
    return this._whatsapp;
  }

  get instagram(): Url {
    return this._instagram;
  }

  public getWhatsAppLink(): string {
    const cleanNumber = this._whatsapp.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanNumber}`;
  }

  public getFormattedWhatsApp(): string {
    if (this._whatsapp.startsWith('+')) {
      const number = this._whatsapp.slice(1);
      if (number.length >= 10) {
        return `+${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
      }
    }
    return this._whatsapp;
  }

  private validateWhatsApp(whatsapp: string): string {
    if (!whatsapp || whatsapp.trim().length === 0) {
      throw new Error('WhatsApp number cannot be empty');
    }
    
    const cleanNumber = whatsapp.replace(/[^\d+]/g, '');
    if (cleanNumber.length < 10) {
      throw new Error('WhatsApp number must have at least 10 digits');
    }
    
    return whatsapp.trim();
  }
}