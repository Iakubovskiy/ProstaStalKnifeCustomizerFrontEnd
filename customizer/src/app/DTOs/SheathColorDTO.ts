import { SheathColorPriceByTypeDTO } from "./SheathColorPriceByTypeDTO";

export interface SheathColorDTO {
  colors?: LocalizedContent | null;
  materials?: LocalizedContent | null;
  colorCode?: string | null;
  engravingColorCode?: string | null;
  prices?: SheathColorPriceByTypeDTO[] | null;
  isActive: boolean;
  textureId?: string | null;
  colorMapId?: string | null;
}
