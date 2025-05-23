export default interface Engraving {
  id: string;
  name: string | null;
  side: number;
  text: string | null;
  font: string | null;
  pictureUrl: string | null;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  locationX: number;
  locationY: number;
  locationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}
