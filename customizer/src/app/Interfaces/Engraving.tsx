interface Engraving {
  id: string;
  name: string;
  side: number;
  text: string | null;
  font: string | null;
  picture: File | null;
  position: EngravingPosition;
  rotation: EngravingRotation;
  scale: EngravingScale;
  tags: EngravingTag[];
  description: string;
  isActive: boolean;
}
