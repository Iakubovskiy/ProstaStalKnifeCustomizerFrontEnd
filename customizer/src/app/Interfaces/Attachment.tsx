interface Attachment {
  id: string;
  isActive: boolean;
  image: File;
  name: string;
  names?: LocalizedContent;
  title: string;
  titles?: LocalizedContent;
  description: string;
  descriptions?: LocalizedContent;
  metaTitle: string;
  metaTitles?: LocalizedContent;
  metaDescription: string;
  metaDescriptions?: LocalizedContent;
  type: AttachmentType;
  color: string;
  colors?: LocalizedContent;
  price: number;
  material: string;
  materials?: LocalizedContent;
  model: File;
}
