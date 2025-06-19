interface CompletedSheath {
  id: string;
  isActive: boolean;
  image: File;
  name: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  sheath: Sheath;
  sheathColor: SheathColor | null;
  engravings: Engraving[];
  attachments: Attachment[];
  totalPrice: number;
}
