export interface BladeCoatingDTO {
  id?: string;
  type?: LocalizedContent | null;
  color?: LocalizedContent | null;
  colorCode?: string | null;
  engravingColorCode?: string | null;
  colorMapId?: string | null;
  price: number;
  textureId?: string | null;
}
