import BladeCoatingColor from "./BladeCoatingColor";
export default interface BladeCoating {
  id: number;
  name: string;
  price: number;
  materialUrl: string;
  colors: BladeCoatingColor[];
}
