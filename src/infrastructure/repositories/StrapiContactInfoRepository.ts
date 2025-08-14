import { IContactInfoRepository } from '../../core/domain/repositories/IContactInfoRepository';
import { ContactInfo, ContactInfoProps } from '../../core/domain/entities/ContactInfo';
import { Email } from '../../core/domain/value-objects/Email';
import { Url } from '../../core/domain/value-objects/Url';
import {
  StrapiApiClient,
  StrapiCollectionResponse,
  StrapiResponse,
} from '../external/StrapiApiClient';

interface StrapiContactInfoData {
  id: number;
  attributes: {
    text: string;
    email: string;
    whatsapp: string;
    instagram: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export class StrapiContactInfoRepository implements IContactInfoRepository {
  constructor(private readonly apiClient: StrapiApiClient) {}

  async findCurrent(): Promise<ContactInfo | null> {
    try {
      const response = await this.apiClient.get<StrapiCollectionResponse<StrapiContactInfoData>>(
        'contact-sections',
        {
          'fields[0]': 'text',
          'fields[1]': 'email',
          'fields[2]': 'whatsapp',
          'fields[3]': 'instagram',
        }
      );

      if (response.data.length === 0) {
        return null;
      }

      return this.mapToDomainEntity(response.data[0]);
    } catch (error) {
      throw new Error(
        `Failed to fetch current contact info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(id: number): Promise<ContactInfo | null> {
    try {
      const response = await this.apiClient.get<StrapiResponse<StrapiContactInfoData>>(
        `contact-sections/${id}`
      );
      return this.mapToDomainEntity(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(
        `Failed to fetch contact info ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async save(contactInfo: ContactInfo): Promise<ContactInfo> {
    try {
      const data = this.mapToStrapiData(contactInfo);

      if (contactInfo.isNew()) {
        const response = await this.apiClient.post<StrapiResponse<StrapiContactInfoData>>(
          'contact-sections',
          { data }
        );
        return this.mapToDomainEntity(response.data);
      } else {
        const response = await this.apiClient.put<StrapiResponse<StrapiContactInfoData>>(
          `contact-sections/${contactInfo.id}`,
          { data }
        );
        return this.mapToDomainEntity(response.data);
      }
    } catch (error) {
      throw new Error(
        `Failed to save contact info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const contactInfo = await this.findById(id);
      return contactInfo !== null;
    } catch (error) {
      return false;
    }
  }

  private mapToDomainEntity(strapiData: StrapiContactInfoData): ContactInfo {
    const props: ContactInfoProps = {
      id: strapiData.id,
      text: strapiData.attributes.text,
      email: new Email(strapiData.attributes.email),
      whatsapp: strapiData.attributes.whatsapp,
      instagram: new Url(strapiData.attributes.instagram),
      createdAt: new Date(strapiData.attributes.createdAt),
      updatedAt: new Date(strapiData.attributes.updatedAt),
    };

    return new ContactInfo(props);
  }

  private mapToStrapiData(contactInfo: ContactInfo): any {
    return {
      text: contactInfo.text,
      email: contactInfo.email.value,
      whatsapp: contactInfo.whatsapp,
      instagram: contactInfo.instagram.value,
    };
  }
}
