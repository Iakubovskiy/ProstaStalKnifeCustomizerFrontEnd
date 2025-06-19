interface Sheath {
  id: string;
  name: string;
  names?: LocalizedContent | null;
  model: File | null;
  type: BladeShapeType;
  price: number;
  isActive: boolean;
}
