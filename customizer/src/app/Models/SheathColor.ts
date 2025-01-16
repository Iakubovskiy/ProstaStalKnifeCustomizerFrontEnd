export default interface SheathColor {
  id: string;
  color: string;
  colorCode: string;
  material: string;
  price: number;
  engravingColorCode: string;
  isActive: boolean;
  colorMapUrl: string | null;
  normalMapUrl: string | null;
  roughnessMapUrl: string | null;
}
