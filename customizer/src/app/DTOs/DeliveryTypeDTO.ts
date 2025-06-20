export interface DeliveryTypeDTO {
  names?: LocalizedContent | null;
  comment?: LocalizedContent | null;
  price: number;
  isActive: boolean;
}
