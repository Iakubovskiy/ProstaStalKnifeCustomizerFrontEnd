export interface SheathDTO {
  id?: string;
  typeId: string;
  name?: LocalizedContent | null;
  price: number;
  sheathModelId?: string | null;
  isActive: boolean;
}
