export interface EngravingDTO {
  id?: string;
  name?: LocalizedContent | null;
  description?: LocalizedContent | null;
  pictureId?: string | null;
  side: number;
  text?: string | null;
  font?: string | null;
  locationX: number;
  locationY: number;
  locationZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  tagsIds?: string[] | null;
  isActive: boolean;
}
