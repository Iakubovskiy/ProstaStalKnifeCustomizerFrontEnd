import React from "react";

const Lighting = () => (
    <>
        {/*@ts-ignore*/}
        <ambientLight intensity={1.5}/>
        {/*@ts-ignore*/}
        <directionalLight position={[10, 10, 5]} intensity={0.8}/>
        {/*@ts-ignore*/}
        <directionalLight position={[-10, -10, -5]} intensity={0.4}/>
    </>
);

export default Lighting;