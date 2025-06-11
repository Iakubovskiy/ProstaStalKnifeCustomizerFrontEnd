// /app/types/product.ts

// Define an enum for engraving names if it's a fixed set, otherwise use string[]
// export enum EngravingType {
//   LOGO = "Logo",
//   INITIALS = "Initials",
//   CUSTOM_TEXT = "Custom Text",
// }

export interface Product {
  id: string | number; // Or whatever your product ID type is
  name: string;
  description: string;
  price: number;
  image_url: string; // Assuming this is a direct URL
  // Optional fields based on your image
  bladeLength?: number; // Corrected spelling from 'bladeLenght'
  bladeWidth?: number;
  bladeWeight?: number;
  totalLength?: number;
  sharpnessAngle?: number;
  hardnessRockwell?: number;
  sheathColor?: string | null; // Nullable if it can be absent
  bladeCoatingColor?: string;
  handleColor?: string;
  engravingNames?: string[]; // Or EngravingType[] if using an enum
  bladeCoatingType?: string;
  // Add any other common fields
  category?: string; // e.g., "Knife", "Accessory" for better structured data
  stock?: number;
}

// Example for a simpler product like an accessory
export interface AccessoryProduct extends Product {
  // Accessory-specific fields, if any
  material?: string;
}

// You might have a union type if products can be vastly different
// export type AnyProduct = KnifeProduct | AccessoryProduct;
