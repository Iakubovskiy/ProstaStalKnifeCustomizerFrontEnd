// import React, { useEffect, useState } from "react";
// import BladeCoating from "../../../Models/BladeCoating";
// import BladeCoatingService from "../../../services/BladeCoatingService";
// import CardComponent from "./CardComponent";
// import { useCanvasState } from '@/app/state/canvasState';
// import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
// import Characteristics from "@/app/components/Characteristics/Characteristics";
// import {useSnapshot} from "valtio";

// const BladeCoatingCustomizationComponent: React.FC = () => {
//     const [bladeCoatingOptions, setBladeCoatingOptions] = useState<
//         { coating: BladeCoating; color: BladeCoatingColor; }[]
//     >([]);
//     const state = useCanvasState();
//     const snap = useSnapshot(state);

//     useEffect(() => {
//         const fetchBladeCoatings = async () => {
//             const service = new BladeCoatingService();
//             try {
//                 const coatings = await service.getAll();
//                 const options: {
//                     coating: BladeCoating;
//                     color: BladeCoatingColor;
//                 }[] = [];

//                 for (const coating of coatings) {
//                     const detailedCoating = await service.getById(coating.id);
//                     detailedCoating.colors.forEach((color) => {
//                         options.push({
//                             coating: detailedCoating,
//                             color: color,
//                         });
//                     });
//                 }

//                 setBladeCoatingOptions(options);
//             } catch (error) {
//                 console.error("Error fetching blade coatings:", error);
//             }
//         };

//         fetchBladeCoatings();
//     }, []);

//     const handleCoatingSelection = (coating: BladeCoating, color: BladeCoatingColor) => {
//        state.bladeCoating = coating;
//        state.bladeCoatingColor = color;
//     };

//     return (
//         <>
//             <div className="grid grid-cols-3 gap-4">
//                 {bladeCoatingOptions.map((option, index) => (
//                     <CardComponent
//                         key={index}
//                         backgroundPicture={option.color.colorCode}
//                         tooltipText={`${option.coating.name}, ${option.color.color}`}
//                         onClick={() =>
//                             handleCoatingSelection(option.coating, option.color)
//                         }
//                     />
//                 ))}
//             </div>
//             <div style={{marginTop: "16px"}}>
//                 <Characteristics data={snap.bladeCoating as BladeCoating}
//                                  isReadOnly1={true}
//                                  currentBladeCoatingColor={snap.bladeCoatingColor.color}
//                                  onChange={() => {
//                                  }}
//                                  type="BladeCoating"
//                 />
//             </div>
//         </>
//     );
// };

// export default BladeCoatingCustomizationComponent;
