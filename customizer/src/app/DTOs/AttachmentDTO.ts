export interface AttachmentDTO {
  isActive: boolean;
  imageFileId: string;
  names?: LocalizedContent | null;
  titles?: LocalizedContent | null;
  descriptions?: LocalizedContent | null;
  metaTitles?: LocalizedContent | null;
  metaDescriptions?: LocalizedContent | null;
  tagsIds?: string[] | null;
  typeId: string;
  colors?: LocalizedContent | null;
  price: number;
  materials?: LocalizedContent | null;
  modelFileId: string;
}
