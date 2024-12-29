interface Admin extends User {}

interface BladeCoating {
  id: number;
  type: string;
  price: number;
  colors: BladeCoatingColor[];
  MaterialUrl: string;
}
interface BladeCoatingColor {
  id: number;
  color: string;
  colorCode: string;
  engravingColorCode: string;
}
interface BladeShape {
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
  sheathModelUrl: string;
}

interface DeliveryType {
  id: number;
  name: string;
  price: number;
  comment: string | null;
}

interface Engraving {
  id: number;
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
interface EngravingPrice {
  id: number;
  price: number;
}
interface Fastening {
  id: number;
  name: string;
  color: string;
  colorCode: string;
  price: number;
  material: string;
  modelUrl: string;
}
interface HandleColor {
  id: number;
  colorName: string;
  colorCode: string;
  material: string;
  materialUrl: string;
}
interface Knife {
  id: number;
  shape: BladeShape;
  bladeCoating: BladeCoating;
  bladeCoatingColor: BladeCoatingColor;
  handleColor: HandleColor;
  sheathColor: SheathColor;
  fastening: Fastening[] | null;
  engraving: Engraving[] | null;
  quantity: number;
}
interface Order {
  id: number;
  number: string;
  total: number;
  knifes: Knife[];
  delivery: DeliveryType;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  email: string;
  comment: string | null;
  status: OrderStatuses;
}
interface OrderStatuses {
  id: number;
  status: string;
}
interface SheathColor {
  id: number;
  colorName: string;
  colorCode: string;
  material: string;
  materialUrl: string;
  price: number;
  EngravingColorCode: string;
}
interface User {
  id: string;
  login: string;
  password: string;
}

interface State {
  handleColor: string;
  sheathColor: SheathColor;
  bladeCoatingColor: BladeCoatingColor;
  bladeCoating: BladeCoating;
  bladeShape: BladeShape;
  engraving: Engraving[] | null;
  fastening: Fastening[] | null;
}
