import BladeCoatingColor from "./BladeCoatingColor";
export default interface BladeCoating {
  id: number;
  type: string;
  price: number;
  colors: BladeCoatingColor[];
}
