export default interface BladeShape {
  id: number;
  name: string;
  price: number;
  totalLength: number;
  bladeLength: number;
  bladeWidth: number;
  bladeWeight: number;
  sharpeningAngle: number;
  rockwellHardnessUnits: number;
  engravingLocationX: number;
  engravingLocationY: number;
  engravingLocationZ: number;
  engravingRotationX: number;
  engravingRotationY: number;
  engravingRotationZ: number;
  bladeShapeModelUrl: string;
  handleShapeModelUrl: string;
  sheathModelUrl: string;
}
