'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/server_rack_and_console_v3.glb');

interface ThreeModelProps {
    width?: string | number;
    height?: string | number;
    modelScale?: number;
    modelPosition?: [number, number, number];
    className?: string;
}

function Model({ scale = 1.5, position = [0, -1, 0] }: { scale?: number, position?: [number, number, number] }) {
    const { scene } = useGLTF('/server_rack_and_console_v3.glb');
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state: any) => {
        if (modelRef.current) {
            // Gentle rotation
            modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={scale}
            position={position}
            rotation={[0, -Math.PI / 4, 0]}
        />
    );
}

export default function ThreeModel({
    width = '100%',
    height = '100%',
    modelScale = 1.5,
    modelPosition = [0, -3.2, 0],
    className = ''
}: ThreeModelProps) {
    return (
        <div
            style={{ width, height }}
            className={`relative group ${className}`}
        >
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
                onCreated={({ gl }: { gl: any }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                {/* Fixed Camera: FOV and Position are now constant, making modelScale linear */}
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />

                <Suspense fallback={null}>
                    {/* Replaced Stage with explicit lighting for predictable scaling */}
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Model scale={modelScale} position={modelPosition} />
                    </Float>

                    <ContactShadows
                        position={[0, -3.2, 0]}
                        opacity={0.4}
                        scale={20}
                        blur={2}
                        far={4.5}
                    />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                />
            </Canvas>
        </div>
    );
}
