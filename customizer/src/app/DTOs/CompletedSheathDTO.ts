import type { AttachmentDTO } from "./AttachmentDTO";
import type { EngravingDTO } from "./EngravingDTO";

export interface CompletedSheathDTO {
    isActive: boolean;
    imageFileId: string;
    names: Record<string, string> | null;
    titles: Record<string, string> | null;
    descriptions: Record<string, string> | null;
    metaTitles: Record<string, string> | null;
    metaDescriptions: Record<string, string> | null;
    tagsIds: string[] | null;
    sheathId: string;
    sheathColorId: string;
    existingEngravingIds: string[] | null;
    newEngravings: EngravingDTO[] | null;
    existingAttachmentIds: string[] | null;
    newAttachments: AttachmentDTO[] | null;
}