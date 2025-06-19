interface BladeShape {
  id: string;
  type: BladeShapeType;
  name: string;
  price: number;
  characteristics: BladeCharacteristics;
  bladeShapePhoto: File;
  bladeShapeModel: File;
  isActive: boolean;
  sheath: Sheath | null;
}
