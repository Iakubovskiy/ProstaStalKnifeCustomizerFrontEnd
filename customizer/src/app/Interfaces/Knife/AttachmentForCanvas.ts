import { AppFile } from "@/app/Interfaces/File";

export interface AttachmentForCanvas {
  id: string;
  name: string;
  price: number;
  image: AppFile;
  model: AppFile;
  typeId?: string | null;
}
