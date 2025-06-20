// import React, { useEffect, useState } from "react";
// // import HandleColorService from "../../../services/HandleColorService";
// import HandleColor from "../../../Models/HandleColor";
// import CardComponent from "./CardComponent";
// import { useCanvasState } from "@/app/state/canvasState";
// import Characteristics from "@/app/components/Characteristics/Characteristics";
// import { useSnapshot } from "valtio";
// import ModalFormButton from "../../ModalButton/ModalButton";

// const HandleCustomizationComponent: React.FC = () => {
//   const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
//   const state = useCanvasState();
//   const snap = useSnapshot(state);

//   useEffect(() => {
//     const fetchHandleColors = async () => {
//       const service = new HandleColorService();
//       const colors = await service.getAllActive();
//       setHandleColors(colors);
//     };

//     fetchHandleColors();
//   }, []);

//   const handleColorClick = (color: HandleColor) => {
//     state.handleColor = color;
//     requestAnimationFrame(() => {
//       state.invalidate();
//     });
//   };

//   return (
//     <>
//       <div className="grid grid-cols-3 gap-4">
//         {handleColors.map((color) => (
//           <CardComponent
//             key={color.id}
//             backgroundPicture={color.colorCode}
//             tooltipText={color.colorName}
//             onClick={() => handleColorClick(color)}
//           />
//         ))}
//       </div>
//       <div style={{ marginTop: "16px" }}>
//         <Characteristics
//           data={snap.handleColor}
//           isReadOnly1={true}
//           currentBladeCoatingColor={""}
//           onChange={() => {}}
//           type="HandleColor"
//         />
//       </div>
//       <div className="p-3">
//         <ModalFormButton component="bladeShape"></ModalFormButton>
//       </div>
//     </>
//   );
// };

// export default HandleCustomizationComponent;
