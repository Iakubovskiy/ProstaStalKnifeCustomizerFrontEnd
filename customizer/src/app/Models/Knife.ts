import BladeCoating from "./BladeCoating";
import BladeCoatingColor from "./BladeCoatingColor";
import BladeShape from "./BladeShape";
import Engraving from "./Engraving";
import Fastening from "./Fastening";
import HandleColor from "./HandleColor";
import SheathColor from "./SheathColor";

export default interface Knife {
  id: number;
  shape: BladeShape;
  bladeCoating: BladeCoating;
  bladeCoatingColor: BladeCoatingColor;
  handleColor: HandleColor;
  sheathColor: SheathColor;
  fastening: Fastening[] | null;
  engravings: Engraving[] | null;
  quantity: number;
}
