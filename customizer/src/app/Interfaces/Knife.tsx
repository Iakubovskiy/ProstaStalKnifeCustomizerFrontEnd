import { Attachment } from "./Attachment";
import { BladeCoatingColor } from "./BladeCoatingColor";
import { BladeShape } from "./BladeShape";
import { Engraving } from "./Engraving";
import { AppFile } from "./File";
import { Handle } from "./Handle";
import { Sheath } from "./Sheath";
import { SheathColor } from "./SheathColor";

interface Knife {
  id: string;
  isActive: boolean;
  image: AppFile;
  name: string;
  names?: LocalizedContent | null;
  title: string;
  titles?: LocalizedContent | null;
  description: string;
  descriptions?: LocalizedContent | null;
  metaTitle: string;
  metaTitles?: LocalizedContent | null;
  metaDescription: string;
  metaDescriptions?: LocalizedContent | null;
  shape: BladeShape;
  bladeCoatingColor: BladeCoatingColor;
  handle: Handle | null;
  sheath: Sheath | null;
  sheathColor: SheathColor | null;
  engravings: Engraving[];
  attachments: Attachment[];
  totalPrice: number;
}
