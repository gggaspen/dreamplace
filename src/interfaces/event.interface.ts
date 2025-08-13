// import ITicket from "./ticket.interface";
import { BaseEntity } from '../types/common.types';

// Rich text content type from Strapi
export interface RichTextNode {
  type: string;
  children: {
    text: string;
    type: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  }[];
}

export default interface IEvent extends BaseEntity {
  active: boolean;
  date: string;
  description: RichTextNode[];
  location: string;
  name: string;
  cover_mobile: ICover[];
  cover_desktop: ICover;
  ticket_link: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Additional optional fields that might be added in the future
  price?: number;
  capacity?: number;
  tags?: string[];
  featured?: boolean;
}

export interface ICover extends BaseEntity {
  formats: {
    large: IFormat;
    small: IFormat;
    medium: IFormat;
    thumbnail: IFormat;
  };
  url: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  provider: string;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface IFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
}
