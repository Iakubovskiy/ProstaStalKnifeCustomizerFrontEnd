export interface PaymentMethod {
  id: string;
  name: string;
  names?: LocalizedContent | null;
  description: string;
  descriptions?: LocalizedContent | null;
  isActive: boolean;
}
