export interface BladeShapeDTO {
  typeId: string;
  names?: LocalizedContent | null;
  price: number;
  totalLength: number;
  bladeLength: number;
  bladeWidth: number;
  bladeWeight: number;
  sharpeningAngle: number;
  rockwellHardnessUnits: number;
  bladeShapePhotoId: string;
  bladeShapeModelId: string;
  isActive: boolean;
  sheathId?: string | null;
}
