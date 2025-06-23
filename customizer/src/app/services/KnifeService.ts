import APIService from "./ApiService";
import type { Knife } from "@/app/Interfaces/Knife/Knife";
import type { KnifeDTO } from "@/app/DTOs/KnifeDTO";

class KnifeService {
  private apiService: APIService;
  private resource: string = "knives";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<Knife[]> {
    const res = await this.apiService.getAll<Knife>(this.resource);
    return res;
  }

  async getAllActive(): Promise<Knife[]> {
    const res = await this.apiService.getAll<Knife>(`${this.resource}/active`);
    return res;
  }

  async getById(id: string): Promise<Knife> {
    const res = await this.apiService.getById<Knife>(this.resource, id);
    return res;
  }

  async create(data: KnifeDTO): Promise<Knife> {
    if (!data.titles || Object.keys(data.titles).length === 0) {
      data.titles = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("titles");
    }
    console.log("titles", data.titles);
    if (!data.descriptions || Object.keys(data.descriptions).length === 0) {
      data.descriptions = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("descriptions");
    }
    if (
      !data.metaDescriptions ||
      Object.keys(data.metaDescriptions).length === 0
    ) {
      data.metaDescriptions = {
        ua: "-",
        en: "-",
      } as unknown as LocalizedContent;
      console.log("metaDescriptions");
    }
    if (!data.metaTitles || Object.keys(data.metaTitles).length === 0) {
      data.metaTitles = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("metaTitles");
    }
    if (!data.names || Object.keys(data.names).length === 0) {
      data.names = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("names");
    }
    if (!data.tagsIds) {
      data.tagsIds = [];
    }
    if (!data.existingEngravingIds) {
      data.existingEngravingIds = [];
    }

    if (!data.existingAttachmentIds) {
      data.existingAttachmentIds = [];
    }
    data.existingAttachmentIds = data.existingAttachmentIds.filter(
      (id) => id != null
    );

    console.log("data:", data.existingAttachmentIds);
    if (!data.newEngravings) {
      data.newEngravings = [];
    }
    if (!data.isActive) {
      data.isActive = false;
    }
    if (data.sheathColorId && !data.sheathId) {
      data.sheathColorId = undefined;
    }
    if (!data.imageFileId) {
      data.imageFileId = "06331a76-e8ea-4a0d-8eb3-ede166d1d0d2";
    }
    data.isActive = false;
    for (const engraving of data.newEngravings) {
      if (!engraving.names) {
        engraving.names = {
          ua: "-",
          en: "-",
        } as unknown as LocalizedContent;
      }
      if (!engraving.descriptions) {
        engraving.descriptions = {
          ua: "-",
          en: "-",
        } as unknown as LocalizedContent;
      }
      if (!engraving.tagsIds) {
        engraving.tagsIds = [];
      }
    }
    console.log("11Creating knife with data:", data);

    const createdDto = await this.apiService.create<Knife>(this.resource, data);
    return createdDto;
  }

  async update(id: string, data: KnifeDTO): Promise<Knife> {
    if (!data.titles || Object.keys(data.titles).length === 0) {
      data.titles = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("titles");
    }
    console.log("titles", data.titles);
    if (!data.descriptions || Object.keys(data.descriptions).length === 0) {
      data.descriptions = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("descriptions");
    }
    if (
      !data.metaDescriptions ||
      Object.keys(data.metaDescriptions).length === 0
    ) {
      data.metaDescriptions = {
        ua: "-",
        en: "-",
      } as unknown as LocalizedContent;
      console.log("metaDescriptions");
    }
    if (!data.metaTitles || Object.keys(data.metaTitles).length === 0) {
      data.metaTitles = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("metaTitles");
    }
    if (!data.names || Object.keys(data.names).length === 0) {
      data.names = { ua: "-", en: "-" } as unknown as LocalizedContent;
      console.log("names");
    }
    if (!data.tagsIds) {
      data.tagsIds = [];
    }
    if (!data.existingEngravingIds) {
      data.existingEngravingIds = [];
    }
    if (!data.existingAttachmentIds) {
      data.existingAttachmentIds = [];
    }
    if (!data.newEngravings) {
      data.newEngravings = [];
    }
    if (!data.isActive) {
      data.isActive = false;
    }
    if (data.sheathColorId && !data.sheathId) {
      data.sheathColorId = undefined;
    }
    if (!data.imageFileId) {
      data.imageFileId = "06331a76-e8ea-4a0d-8eb3-ede166d1d0d2";
    }
    for (const engraving of data.newEngravings) {
      if (!engraving.names) {
        engraving.names = {
          ua: "-",
          en: "-",
        } as unknown as LocalizedContent;
      }
      if (!engraving.descriptions) {
        engraving.descriptions = {
          ua: "-",
          en: "-",
        } as unknown as LocalizedContent;
      }
      if (!engraving.tagsIds) {
        engraving.tagsIds = [];
      }
    }

    const updatedDto = await this.apiService.update<Knife>(
      this.resource,
      id,
      data
    );
    return updatedDto;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<void> {
    await this.apiService.partialUpdate<void>(
      `${this.resource}/activate`,
      id,
      {}
    );
  }

  async deactivate(id: string): Promise<void> {
    await this.apiService.partialUpdate<void>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
  }
}

export default KnifeService;
