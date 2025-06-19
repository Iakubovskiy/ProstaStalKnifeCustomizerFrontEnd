interface Attachment {
  id: string;
  isActive: boolean;
  image: File;
  name: LocalizedContent;
  title: LocalizedContent;
  description: LocalizedContent;
  metaTitle: LocalizedContent;
  metaDescription: LocalizedContent;
  type: AttachmentType;
  color: LocalizedContent;
  price: number;
  material: LocalizedContent;
  model: File;
}
