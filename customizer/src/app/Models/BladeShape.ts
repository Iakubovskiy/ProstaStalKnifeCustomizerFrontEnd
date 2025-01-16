export default interface BladeShape {
  id: string;
  name: string;
  price: number;
  totalLength: number;
  bladeLength: number;
  bladeWidth: number;
  bladeWeight: number;
  sharpeningAngle: number;
  rockwellHardnessUnits: number;
  bladeShapeModelUrl: string;
  sheathModelUrl: string;
  isActive: boolean;
}
