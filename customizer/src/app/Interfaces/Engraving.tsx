export interface Engraving {
  id: string;
  name: string;
  names?: LocalizedContent | null;
  side: number;
  text: string | null;
  font: string | null;
  picture: File | null;
  position: EngravingPosition;
  rotation: EngravingRotation;
  scale: EngravingScale;
  tags: EngravingTag[];
  description: string;
  descriptions?: LocalizedContent | null;
  isActive: boolean;
}
