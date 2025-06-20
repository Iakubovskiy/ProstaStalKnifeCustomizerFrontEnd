export interface DeliveryType {
  id: string;
  names?: LocalizedContent | null;
  name: string;
  price: number;
  comment: string;
  comments?: LocalizedContent | null;
  isActive: boolean;
}
