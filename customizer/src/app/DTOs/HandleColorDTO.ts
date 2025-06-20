export interface HandleColorDTO {
  id?: string;
  colors?: LocalizedContent | null;
  colorCode?: string | null;
  isActive: boolean;
  materials?: LocalizedContent | null;
  textureId?: string | null;
  colorMapId?: string | null;
  handleModelId?: string | null;
  price: number;
  bladeShapeTypeId: string;
}
