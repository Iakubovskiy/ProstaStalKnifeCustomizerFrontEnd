export default interface DeliveryType {
  id: string;
  name: string;
  price: number;
  comment: string | null;
  isActive: boolean;
}
