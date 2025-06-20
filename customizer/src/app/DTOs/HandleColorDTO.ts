export interface HandleColorDTO {
  id?: string;
  color?: LocalizedContent | null;

  colorCode?: string | null;
  isActive: boolean;
  material?: LocalizedContent | null;
  textureId?: string | null;
  colorMapId?: string | null;
  handleModelId?: string | null;
  price: number;
  bladeShapeTypeId: string;
}
