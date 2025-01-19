import BladeCoatingColor from "./BladeCoatingColor";
import BladeShape from "./BladeShape";
import Engraving from "./Engraving";
import Fastening from "./Fastening";
import HandleColor from "./HandleColor";
import SheathColor from "./SheathColor";
import Product from "./Product";

export default class Knife extends Product {
  public shape: BladeShape;
  public bladeCoatingColor: BladeCoatingColor;
  public handleColor: HandleColor;
  public sheathColor: SheathColor;
  public fastening: Fastening | null;
  public engravings: Engraving[] | null;

  public constructor(
      id: string,
      shape: BladeShape,
      handleColor: HandleColor,
      sheathColor: SheathColor,
      isActive: boolean,
      bladeCoatingColor: BladeCoatingColor,
      fastening: Fastening | null,
      engravings: Engraving[] | null,
  ) {
    super(id,isActive);
    this.shape = shape;
    this.handleColor = handleColor;
    this.sheathColor = sheathColor;
    this.fastening = fastening;
    this.engravings = engravings;
    this.bladeCoatingColor = bladeCoatingColor;
  }
}
