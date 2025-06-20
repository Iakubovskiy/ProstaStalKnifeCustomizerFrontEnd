import { SheathColorPriceByTypeDTO } from "./SheathColorPriceByTypeDTO";

export interface SheathColorDTO {
  color?: LocalizedContent | null;
  material?: LocalizedContent | null;
  colorCode?: string | null;
  engravingColorCode?: string | null;
  prices?: SheathColorPriceByTypeDTO[] | null;
  isActive: boolean;
  textureId?: string | null;
  colorMapId?: string | null;
}
