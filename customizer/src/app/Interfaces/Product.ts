import type { File } from "./File";
import type { Review } from "./Review";
import type { BladeCharacteristics } from "./BladeCharacteristics";

export interface Product {
    id: string;
    name: string;
    names?: Record<string, string>;
    image: File;
    price: number;
    reviews: Review[];
    characteristics: BladeCharacteristics | null;
}