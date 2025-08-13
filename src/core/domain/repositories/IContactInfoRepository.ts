import { ContactInfo } from '../entities/ContactInfo';

export interface IContactInfoRepository {
  findCurrent(): Promise<ContactInfo | null>;
  findById(id: number): Promise<ContactInfo | null>;
  save(contactInfo: ContactInfo): Promise<ContactInfo>;
  exists(id: number): Promise<boolean>;
}