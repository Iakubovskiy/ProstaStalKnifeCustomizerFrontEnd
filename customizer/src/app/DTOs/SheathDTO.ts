export interface SheathDTO {
  typeId: string;
  name?: LocalizedContent | null;
  price: number;
  sheathModelId?: string | null;
  isActive: boolean;
}
