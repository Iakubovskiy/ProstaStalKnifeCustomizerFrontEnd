import type { AttachmentDTO } from "./AttachmentDTO";
import type { EngravingDTO } from "./EngravingDTO";

export interface KnifeDTO {
  id?: string;
  isActive: boolean;
  imageFileId: string;
  names: Record<string, string>;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  metaTitles: Record<string, string>;
  metaDescriptions: Record<string, string>;
  tagsIds: string[];
  shapeId: string;
  bladeCoatingColorId: string;
  handleId?: string | null;
  sheathId?: string | null;
  sheathColorId?: string | null;
  existingEngravingIds: string[];
  newEngravings: EngravingDTO[];
  existingAttachmentIds: string[];
  newAttachments: AttachmentDTO[];
}