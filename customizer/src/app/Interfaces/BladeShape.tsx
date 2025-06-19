interface BladeShape {
  id: string;
  type: BladeShapeType;
  name: string;
  names?: LocalizedContent;
  price: number;
  characteristics: BladeCharacteristics;
  bladeShapePhoto: File;
  bladeShapeModel: File;
  isActive: boolean;
  sheath: Sheath | null;
}
