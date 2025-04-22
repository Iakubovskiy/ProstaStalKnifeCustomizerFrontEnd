'use client';

import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PreviewGeneratorProps {
    modelUrl: string;
    onPreviewGenerated: (preview: string) => void;
}

const PreviewGenerator: React.FC<PreviewGeneratorProps> = ({ modelUrl, onPreviewGenerated }) => {
    const [isGenerating, setIsGenerating] = useState(true);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const width = 150;
        const height = 150;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 2;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        if (!rendererRef.current) {
            rendererRef.current = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            rendererRef.current.setSize(width, height);
            rendererRef.current.setPixelRatio(window.devicePixelRatio);
            mountRef.current?.appendChild(rendererRef.current.domElement);
        }

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            camera.position.z = maxDim * 2;
            camera.lookAt(0, 0, 0);

            scene.add(model);

            if (rendererRef.current) {
                rendererRef.current.render(scene, camera);
                const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
                onPreviewGenerated(dataUrl);
                setIsGenerating(false);
            }
        });

        return () => {
            if (rendererRef.current) {
                if (mountRef.current?.contains(rendererRef.current.domElement)) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    }
                }
            });
        };
    }, [modelUrl, onPreviewGenerated]);

    return (
        <div
            ref={mountRef}
            style={{
                width: '150px',
                height: '150px',
                position: 'absolute',
                opacity: isGenerating ? 0 : 1,
                pointerEvents: 'none'
            }}
            className="sm:w-[75px] sm:h-[75px] md:w-[75px] md:h-[75px] xs:w-[75px] xs:h-[75px]"
        />
    );
};

export default PreviewGenerator;