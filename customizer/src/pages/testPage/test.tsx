"use client";
import React from "react";
import "../../styles/globals.css";
import CustomCanvas from "../../app/components/CustomCanvas/CustomCanvas";
import { useCanvasState } from "@/app/state/canvasState"

const FileInput = () => {
    const state = useCanvasState();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(0);
        if (file) {
            const url = URL.createObjectURL(file);
            console.log(url);
            state.bladeShape = { ...state.bladeShape, bladeShapeModelUrl: url };
        }
    };
    console.log("state =  ", state);
    return <input type="file" accept=".glb" onChange={handleFileChange} />;
};

const TextureFileInput = () => {
    const state = useCanvasState();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("coating");
        if (file) {
            const url = URL.createObjectURL(file);
            console.log(url);
            state.bladeCoating = { ...state.bladeCoating, MaterialUrl: url, };
            state.bladeCoatingColor = { ...state.bladeCoatingColor, colorCode: "#ffffff", };
        }
    };
    console.log("state =  ", state);
    return <input type="file" accept=".jpg" onChange={handleFileChange} />;
};

const EngravingFileInput: React.FC = () => {
    const state = useCanvasState();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newEngraving = {
                id: 1,
                name:"",
                pictureUrl: url,
                side:3,
                text:"0",
                font:"",
                locationX: 0,
                locationY: 0,
                locationZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1
            };

            state.engraving = [...(state.engraving || []), newEngraving];
        }
    };

    return <input type="file" accept="image/*" onChange={handleFileChange} />;
};

const SheathFileInput = () => {
    const state = useCanvasState();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("sheath");
        if (file) {
            const url = URL.createObjectURL(file);
            console.log(url);
            state.bladeShape = { ...state.bladeShape, sheathModelUrl: url, };
            state.sheathColor = { ...state.sheathColor, colorCode: "#dfd975", };
        }
    };
    console.log("state =  ", state);
    return <input type="file" accept=".glb" onChange={handleFileChange} />;
};

const TestPage = ()=>{
    return(
        <>
            <div style={{ height: "90vh" }}>
            <CustomCanvas />
            </div>
            <FileInput />
            <TextureFileInput />
            <EngravingFileInput />
            <SheathFileInput />
        </>
    )
}

export default TestPage;