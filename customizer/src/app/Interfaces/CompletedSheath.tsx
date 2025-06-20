import {Sheath} from "@/app/Interfaces/Sheath";
import SheathColor from "@/app/Models/SheathColor";
import Engraving from "@/app/Models/Engraving";
import {DataType} from "csstype";
import Attachment = DataType.Attachment;

export interface CompletedSheath {
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
