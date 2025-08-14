import { ContactInfo, ContactInfoProps } from '../../domain/entities/ContactInfo';
import { Email } from '../../domain/value-objects/Email';
import { Url } from '../../domain/value-objects/Url';
import { ContactInfoDto } from '../dto/AppDataDto';

export class ContactInfoMapper {
  static toDto(contactInfo: ContactInfo): ContactInfoDto {
    return {
      id: contactInfo.id,
      text: contactInfo.text,
      email: contactInfo.email.value,
      whatsapp: contactInfo.whatsapp,
      instagram: contactInfo.instagram.value,
      whatsappLink: contactInfo.getWhatsAppLink(),
      formattedWhatsApp: contactInfo.getFormattedWhatsApp(),
      createdAt: contactInfo.createdAt.toISOString(),
      updatedAt: contactInfo.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: ContactInfoDto): ContactInfo {
    const props: ContactInfoProps = {
      id: dto.id,
      text: dto.text,
      email: new Email(dto.email),
      whatsapp: dto.whatsapp,
      instagram: new Url(dto.instagram),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };

    return new ContactInfo(props);
  }
}
