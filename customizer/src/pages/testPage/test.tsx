"use client";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/globals.css";
import CustomCanvas from "../../app/components/CustomCanvas/CustomCanvas";
import { useCanvasState } from "@/app/state/canvasState";
import { Trash2 } from "lucide-react";
import ProductCard from "@/app/components/Shop/Card/Card";

const TestPage = () => {
  return (
    <div className="flex h-screen">
      <ProductCard></ProductCard>
    </div>
  );
};

export default TestPage;
