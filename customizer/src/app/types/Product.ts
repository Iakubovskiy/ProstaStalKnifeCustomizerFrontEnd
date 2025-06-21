export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  bladeLength?: number;
  bladeWidth?: number;
  bladeWeight?: number;
  totalLength?: number;
  sharpnessAngle?: number;
  hardnessRockwell?: number;
  sheathColor?: string | null;
  bladeCoatingColor?: string;
  handleColor?: string;
  engravingNames?: string[];
  bladeCoatingType?: string;
  category?: string;
  stock?: number;
  reviews?: {
    comment: string;
    rating: number;
    client: string;
  }[] | null;

  averageRating? : number | null;
}

export interface AccessoryProduct extends Product {
  material?: string;
}
