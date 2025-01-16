export default interface BladeCoatingColor {
  id: string;
  type: string;
  color: string;
  colorCode: string;
  engravingColorCode: string;
  price: number;
  isActive: boolean;
  colorMapUrl: string | null;
  normalMapUrl: string | null;
  roughnessMapUrl: string | null;
}
