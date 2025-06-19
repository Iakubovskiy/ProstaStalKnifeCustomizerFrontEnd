interface Handle {
  id: string;
  color: string;
  colors?: LocalizedContent | null;
  colorCode: string | null;
  isActive: boolean;
  material: string;
  materials?: LocalizedContent | null;
  texture: Texture | null;
  colorMap: File | null;
  price: number;
}
