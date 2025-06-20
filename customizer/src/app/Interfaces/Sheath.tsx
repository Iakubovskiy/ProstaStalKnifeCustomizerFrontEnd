export interface Sheath {
  id: string;
  name: string;
  names?: LocalizedContent | null;
  model: AppFile | null;
  type: BladeShapeType;
  price: number;
  isActive: boolean;
}
