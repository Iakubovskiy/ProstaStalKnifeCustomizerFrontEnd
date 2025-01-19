export default interface HandleColor {
  id: string;
  colorName: string;
  colorCode: string;
  material: string;
  isActive: boolean;
  colorMapUrl: string | null;
  normalMapUrl: string | null;
  roughnessMapUrl: string | null;
}
