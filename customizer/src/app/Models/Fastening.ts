import Product from "@/app/Models/Product";

export default interface Fastening extends Product {
  name: string;
  color: string;
  colorCode: string;
  price: number;
  material: string;
  modelUrl: string;
}
