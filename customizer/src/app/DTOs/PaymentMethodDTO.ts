export interface PaymentMethodDTO {
  id?: string;
  names?: LocalizedContent | null;
  description?: LocalizedContent | null;
  isActive: boolean;
}
