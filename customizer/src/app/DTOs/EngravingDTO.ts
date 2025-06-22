export interface EngravingDTO {
  id?: string;
  names?: LocalizedContent | null;
  descriptions?: LocalizedContent | null;
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
}
