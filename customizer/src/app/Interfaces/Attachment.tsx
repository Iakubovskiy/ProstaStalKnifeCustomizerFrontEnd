import { AppFile } from "@/app/Interfaces/File";

export interface Attachment {
  id: string;
  isActive: boolean;
  image: AppFile;
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
  tags: ProductTag[];
  color: string;
  colors?: LocalizedContent;
  price: number;
  material: string;
  materials?: LocalizedContent;
  model: AppFile;
}
