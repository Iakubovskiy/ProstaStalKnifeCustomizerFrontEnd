import Product from "../Models/Product";

export default class Fastening extends Product {
  name: string;
  color: string;
  colorCode: string;
  price: number;
  material: string;
  modelUrl: string;

  public constructor(
      name: string,
      color: string,
      colorCode: string,
      price: number,
      material: string,
      modelUrl: string,
      id:string,
      isActive: boolean,
  ) {
    super(id,isActive);
    this.name = name;
    this.color = color;
    this.colorCode = color;
    this.price = price;
    this.colorCode = colorCode;
    this.material = material;
    this.modelUrl = modelUrl;
  }
}
