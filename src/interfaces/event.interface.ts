// import ITicket from "./ticket.interface";

export default interface IEvent {
  active: boolean;
  createdAt: string;
  date: string;
  description: {
    type: string;
    children: {
      text: string;
      type: string;
    }[];
  }[];
  documentId: string;
  id: number;
  location: string;
  name: string;
  publishedAt: string;
  updatedAt: string;
  cover_mobile: ICover[];
  cover_desktop: ICover;
  ticket_link: string;
}

export interface ICover {
  id: number;
  documentId: string;
  formats: {
    large: IFormat;
    small: IFormat;
    medium: IFormat;
    thumbnail: IFormat;
  };
}

export interface IFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}
