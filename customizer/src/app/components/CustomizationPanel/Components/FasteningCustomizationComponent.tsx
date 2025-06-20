// "use client";

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import FasteningService from "@/app/services/FasteningService";
// import CardComponent from "./CardComponent";
// import Fastening from "@/app/Models/Fastening";
// import { useCanvasState } from "@/app/state/canvasState";
// import Characteristics from "@/app/components/Characteristics/Characteristics";
// import { useSnapshot } from "valtio";
// import ModalFormButton from "../../ModalButton/ModalButton";

// const PreviewGenerator = dynamic(() => import("./PreviewGenerator"), {
//   ssr: false,
//   loading: () => (
//     <div style={{ width: 150, height: 150, background: "#f0f0f0" }} />
//   ),
// });

// const FasteningCustomizationComponent: React.FC = () => {
//   const [fastenings, setFastenings] = useState<Fastening[]>([]);
//   const [previews, setPreviews] = useState<{ [key: string]: string }>({});
//   const fasteningService = new FasteningService();
//   const state = useCanvasState();
//   const snap = useSnapshot(state);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const fetchFastenings = async () => {
//       try {
//         const fastenings = await fasteningService.getAllActive();
//         setFastenings(fastenings);
//       } catch (error) {
//         console.error("Error fetching fastenings:", error);
//       }
//     };

//     fetchFastenings();
//   }, []);

//   const handlePreviewGenerated = (id: string, preview: string) => {
//     setPreviews((prev) => ({
//       ...prev,
//       [id]: preview,
//     }));
//   };

//   const fasteningOptionClick = (fastening: Fastening) => {
//     state.fastening = fastening;
//     state.invalidate();
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "16px",
//           position: "relative",
//         }}
//       >
//         {fastenings.map((fastening) => (
//           <React.Fragment key={fastening.id}>
//             <CardComponent
//               backgroundPicture={previews[fastening.id] || "#ffffff"}
//               tooltipText={fastening.name}
//               onClick={() => fasteningOptionClick(fastening)}
//             />
//             {!previews[fastening.id] && (
//               <PreviewGenerator
//                 modelUrl={fastening.modelUrl}
//                 onPreviewGenerated={(preview) =>
//                   handlePreviewGenerated(fastening.id, preview)
//                 }
//               />
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//       <div style={{ marginTop: "16px" }}>
//         {snap.fastening && (
//           <Characteristics
//             data={snap.fastening}
//             isReadOnly1={true}
//             currentBladeCoatingColor={""}
//             onChange={() => {}}
//             type="Fastening"
//           />
//         )}
//       </div>
//       <div className="p-3">
//         <ModalFormButton component="bladeShape"></ModalFormButton>
//       </div>
//     </>
//   );
// };

// export default FasteningCustomizationComponent;
