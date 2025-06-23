import { AppFile } from "@/app/Interfaces/File";
import { Review } from "./Review";

export interface Attachment {
  reviews: Review[] | null;
  averageRating: number | null;
  id: string;
  isActive: boolean;
  image: AppFile | null;
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
  model: AppFile | null;
}
