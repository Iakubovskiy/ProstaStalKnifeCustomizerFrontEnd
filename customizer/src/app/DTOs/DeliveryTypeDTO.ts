export interface DeliveryTypeDTO {
  id?: string;
  names?: LocalizedContent | null;
  comment?: LocalizedContent | null;
  price: number;
  isActive: boolean;
}
