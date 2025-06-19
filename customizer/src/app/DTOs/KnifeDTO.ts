import { AttachmentDTO } from "./AttachmentDTO";
import { EngravingDTO } from "./EngravingDTO";

export interface KnifeDTO {
  id?: string;
  isActive: boolean;
  imageFileId: string;
  name?: LocalizedContent | null;
  title?: LocalizedContent | null;
  description?: LocalizedContent | null;
  metaTitle?: LocalizedContent | null;
  metaDescription?: LocalizedContent | null;
  tagsIds?: string[] | null;
  shapeId: string;
  bladeCoatingColorId: string;
  handleId?: string | null;
  sheathId?: string | null;
  sheathColorId?: string | null;
  existingEngravingIds?: string[] | null;
  newEngravings?: EngravingDTO[] | null;
  existingAttachmentIds?: string[] | null;
  newAttachments?: AttachmentDTO[] | null;
}
