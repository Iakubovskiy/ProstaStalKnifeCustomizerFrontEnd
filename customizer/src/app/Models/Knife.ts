import BladeCoatingColor from "./BladeCoatingColor";
import BladeShape from "./BladeShape";
import Engraving from "./Engraving";
import Fastening from "./Fastening";
import HandleColor from "./HandleColor";
import SheathColor from "./SheathColor";
import Product from "./Product";

export default interface Knife extends Product {
  shape: BladeShape;
  bladeCoatingColor: BladeCoatingColor;
  handleColor: HandleColor;
  sheathColor: SheathColor;
  fastening: Fastening | null;
  engravings: Engraving[] | null;
}
