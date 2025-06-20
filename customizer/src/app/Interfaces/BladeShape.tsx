interface BladeShape {
  id: string;
  type: BladeShapeType;
  name: string;
  names?: LocalizedContent;
  price: number;
  characteristics: BladeCharacteristics;
  bladeShapePhoto: AppFile;
  bladeShapeModel: AppFile;
  isActive: boolean;
  sheath: Sheath | null;
}
