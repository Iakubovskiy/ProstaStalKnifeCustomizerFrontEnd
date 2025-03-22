import React from "react";

const Lighting = () => (
    <>
        {/*@ts-ignore*/}
        <ambientLight intensity={1.5}/>
        {/*@ts-ignore*/}
        <directionalLight position={[4, -2, 10]} intensity={1}/>
        {/*@ts-ignore*/}
        <directionalLight position={[4, 2, -10]} intensity={0.8}/>
    </>
);

export default Lighting;