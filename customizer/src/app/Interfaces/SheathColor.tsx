interface SheathColor {
  id: string;
  color: string;
  colorCode: string | null;
  isActive: boolean;
  material: string;
  engravingColorCode: string;
  texture: Texture | null;
  colorMap: File | null;
  prices: SheathColorPriceByType[];
}
