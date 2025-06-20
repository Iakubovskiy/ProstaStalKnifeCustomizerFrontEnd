interface CompletedSheath {
  id: string;
  isActive: boolean;
  image: AppFile;
  name: string;
  names?: LocalizedContent;
  title: string;
  description: string;
  titles?: LocalizedContent;
  descriptions?: LocalizedContent;
  metaTitle: string;
  metaTitles?: LocalizedContent;
  metaDescriptions?: LocalizedContent;
  metaDescription: string;
  sheath: Sheath;
  sheathColor: SheathColor | null;
  engravings: Engraving[];
  attachments: Attachment[];
  totalPrice: number;
}
