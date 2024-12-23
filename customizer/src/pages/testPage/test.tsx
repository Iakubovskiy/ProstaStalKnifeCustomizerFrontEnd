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


const TestPage = ()=>{
    return(
        <>
            <div style={{ height: "90vh" }}>
            <CustomCanvas />
            </div>
            <FileInput />
            <TextureFileInput />
        </>
    )
}

export default TestPage;