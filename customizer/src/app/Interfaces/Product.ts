import type { AppFile } from "./File";
import type { Review } from "./Review";
import type { BladeCharacteristics } from "./BladeCharacteristics";

export interface Product {
    id: string;
    name: string;
    names?: Record<string, string>;
    image: AppFile;
    price: number;
    reviews: Review[];
    characteristics: BladeCharacteristics | null;
}