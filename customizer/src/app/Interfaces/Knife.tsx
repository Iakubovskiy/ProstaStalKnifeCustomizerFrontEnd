interface Knife {
  id: string;
  isActive: boolean;
  image: File;
  name: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  shape: BladeShape;
  bladeCoatingColor: BladeCoatingColor;
  handle: Handle | null;
  sheath: Sheath | null;
  sheathColor: SheathColor | null;
  engravings: Engraving[];
  attachments: Attachment[];
  totalPrice: number;
}
