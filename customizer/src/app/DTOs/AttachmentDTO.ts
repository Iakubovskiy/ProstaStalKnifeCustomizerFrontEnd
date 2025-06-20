export interface AttachmentDTO {
  isActive: boolean;
  imageFileId: string;
  name?: LocalizedContent | null;
  title?: LocalizedContent | null;
  description?: LocalizedContent | null;
  metaTitle?: LocalizedContent | null;
  metaDescription?: LocalizedContent | null;
  tagsIds?: string[] | null;
  typeId: string;
  color?: LocalizedContent | null;
  price: number;
  material?: LocalizedContent | null;
  modelFileId: string;
}
