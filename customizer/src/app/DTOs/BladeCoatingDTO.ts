export interface BladeCoatingDTO {
  type?: LocalizedContent | null;
  colors?: LocalizedContent | null;
  types: LocalizedContent | null;
  colorCode?: string | null;
  engravingColorCode?: string | null;
  colorMapId?: string | null;
  price: number;
  textureId?: string | null;
  isActive: boolean;
}
