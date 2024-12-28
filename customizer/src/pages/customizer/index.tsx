import React from "react";
import "../../styles/globals.css";
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel"

const customizerPage = () =>{
    return (
        <div className="customizer flex flex-col lg:flex-row max-h-screen h-screen w-screen">
            <div className="custom-canvas-div h-full md:w-3/5 lg:w-7/10">
                <CustomCanvas/>
            </div>
            <div className="custom-panel h-full md:w-2/5 lg:w-3/10 bg-gray-800 text-white p-4 overflow-y-auto">
                <CustomizationPanel/>
            </div>
        </div>
    );
};

export default customizerPage;