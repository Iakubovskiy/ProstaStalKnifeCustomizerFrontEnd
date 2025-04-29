import BladeShape from "@/app/Models/BladeShape";
import HandleColor from "@/app/Models/HandleColor";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";

export default interface InitialData {
    bladeShape: BladeShape,
    handleColor: HandleColor,
    sheathColor: SheathColor,
    bladeCoatingColor: BladeCoatingColor
}