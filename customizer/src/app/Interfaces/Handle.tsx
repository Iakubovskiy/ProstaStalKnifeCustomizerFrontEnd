interface Handle {
  id: string;
  color: string;
  colorCode: string | null;
  isActive: boolean;
  material: string;
  texture: Texture | null;
  colorMap: File | null;
  price: number;
}
