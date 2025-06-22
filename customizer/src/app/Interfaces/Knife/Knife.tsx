import { Review } from "@/app/Interfaces/Review";
import { KnifeForCanvas } from "@/app/Interfaces/Knife/KnifeForCanvas";
import { AppFile } from "../File";

export interface Knife {
  id: string;
  isActive: boolean;
  title: string;
  titles?: Record<string, string>;
  metaTitle: string;
  metaTitles?: Record<string, string>;
  metaDescription: string;
  metaDescriptions?: Record<string, string>;
  name: string;
  names?: Record<string, string>;
  description: string;
  descriptions?: Record<string, string>;
  price: number;
  imageUrl: AppFile;
  tags?: ProductTag[];
  totalLength: number;
  bladeLength: number;
  bladeWidth: number;
  bladeWeight: number;
  sharpeningAngle: number;
  rockwellHardnessUnits: number;

  sheathColor: string | null;
  handleColor: string | null;
  bladeCoatingColor: string;
  bladeCoatingType: string;
  engravingNames: string[] | null;

  reviews: Review[] | null;
  averageRating: number | null;

  knifeForCanvas: KnifeForCanvas;
}
