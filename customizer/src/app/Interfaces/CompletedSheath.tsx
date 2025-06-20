import {Sheath} from "@/app/Interfaces/Sheath";
import SheathColor from "@/app/Models/SheathColor";
import Engraving from "@/app/Models/Engraving";
import {DataType} from "csstype";
import Attachment = DataType.Attachment;
import {AppFile} from "@/app/Interfaces/File";
import {Review} from "@/app/Interfaces/Review";

export interface CompletedSheath {
  id: string;
  isActive: boolean;
  image: AppFile;
  name: string;
  names: Record<string, string> | null;
  title: string;
  titles: Record<string, string> | null;
  description: string;
  descriptions: Record<string, string> | null;
  metaTitle: string;
  metaTitles: Record<string, string> | null;
  metaDescription: string;
  metaDescriptions: Record<string, string> | null;
  sheath: Sheath;
  sheathColor: SheathColor;
  engravings: Engraving[] | null;
  attachments: Attachment[] | null;
  totalPrice: number;
  reviews: Review[] | null;
  averageRating: number;
}
