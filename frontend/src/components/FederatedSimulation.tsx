'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Sphere, Line, Html, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/server_rack_and_console_v3.glb');
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Server, Cpu, Database, Play, Pause, RotateCcw, ShieldCheck, Zap } from 'lucide-react';

// --- Types ---
type SimulationPhase = 'IDLE' | 'FETCHING' | 'TRAINING' | 'PUSHING' | 'AGGREGATING';

interface NodeState {
    id: number;
    position: [number, number, number];
    status: 'IDLE' | 'DOWNLOADING' | 'TRAINING' | 'UPLOADING';
    progress: number;
}

interface Metric {
    label: string;
    value: string | number;
    trend?: 'up' | 'down';
}

// --- 3D Components ---

const DataParticle = ({ start, end, duration, color }: { start: THREE.Vector3, end: THREE.Vector3, duration: number, color: string }) => {
    const ref = useRef<THREE.Mesh>(null);
    const startTime = useRef(Date.now());

    useFrame(() => {
        if (!ref.current) return;
        const elapsed = (Date.now() - startTime.current) / 1000;
        const alpha = Math.min(elapsed / duration, 1);

        ref.current.position.lerpVectors(start, end, alpha);
        if (alpha >= 1) {
            ref.current.visible = false;
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
    );
};

const Node = ({ state }: { state: NodeState }) => {
    const getStatusColor = () => {
        switch (state.status) {
            case 'DOWNLOADING': return '#6366f1';
            case 'TRAINING': return '#9333ea';
            case 'UPLOADING': return '#f43f5e';
            default: return '#ffffff';
        }
    };

    return (
        <group position={state.position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <octahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial
                        color={getStatusColor()}
                        emissive={getStatusColor()}
                        emissiveIntensity={state.status !== 'IDLE' ? 1 : 0.2}
                        wireframe={state.status === 'TRAINING'}
                    />
                </mesh>
            </Float>
            <Html distanceFactor={12} position={[0, 0.6, 0]} center>
                <div className="flex flex-col items-center pointer-events-none whitespace-nowrap">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-light">Client_{state.id < 10 ? `0${state.id}` : state.id}</span>
                    {state.status !== 'IDLE' && (
                        <div className="mt-2 text-[9px] text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            {state.status === 'TRAINING' ? `EPOCH ${Math.floor(state.progress / 10)}` : state.status}
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
};

const GlobalServer = ({ phase }: { phase: SimulationPhase }) => {
    const { scene } = useGLTF('/server_rack_and_console_v3.glb');
    const groupRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
        if (lightRef.current) {
            if (phase === 'AGGREGATING') {
                lightRef.current.intensity = 8 + Math.sin(state.clock.elapsedTime * 25) * 6;
            } else {
                lightRef.current.intensity = 2;
            }
        }
    });

    return (
        <group>
            <group ref={groupRef} scale={0.4} position={[0, -0.8, 0]}>
                <primitive object={clonedScene} rotation={[0, -Math.PI / 4, 0]} />
            </group>

            <pointLight
                ref={lightRef}
                position={[0, 0, 0]}
                color="#6366f1"
                distance={10}
                intensity={2}
            />

            <Html distanceFactor={10} position={[0, 1.8, 0]} center>
                <div className="flex flex-col items-center pointer-events-none">
                    <span className="text-sm font-black text-white uppercase tracking-[0.5em]">CENTRAL_HUB</span>
                    <div className={`h-px w-16 mt-2 rounded-full transition-all duration-700 ${phase === 'AGGREGATING' ? 'bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,1)]' : 'bg-white/10'}`} />
                </div>
            </Html>
        </group>
    );
};

export default function FederatedSimulation() {
    const [phase, setPhase] = useState<SimulationPhase>('IDLE');
    const [round, setRound] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [particles, setParticles] = useState<{ id: string, start: THREE.Vector3, end: THREE.Vector3, color: string }[]>([]);

    const nodeConfigs: [number, number, number][] = [
        [5, 2, 0], [5, -2, 0], [-5, 2, 0], [-5, -2, 0], [0, 4, -3], [0, -4, -3], [3, 0, -4], [-3, 0, -4]
    ];

    const [nodes, setNodes] = useState<NodeState[]>(
        nodeConfigs.map((pos, i) => ({ id: i + 1, position: pos, status: 'IDLE', progress: 0 }))
    );

    const [metrics, setMetrics] = useState<Metric[]>([
        { label: 'Global Accuracy', value: '0.00%', trend: 'up' },
        { label: 'Avg. Loss', value: '2.450', trend: 'down' },
        { label: 'Sync Efficiency', value: '98.2%', trend: 'up' },
        { label: 'Model Protocol', value: 'FED-AVG / V4' },
    ]);

    const startSimulation = () => {
        setIsRunning(true);
        runPhase('FETCHING');
    };

    const stopSimulation = () => {
        setIsRunning(false);
    };

    const resetSimulation = () => {
        setIsRunning(false);
        setPhase('IDLE');
        setRound(0);
        setParticles([]);
        setNodes(n => n.map(node => ({ ...node, status: 'IDLE', progress: 0 })));
    };

    const runPhase = (nextPhase: SimulationPhase) => {
        setPhase(nextPhase);

        switch (nextPhase) {
            case 'FETCHING':
                setParticles(nodes.map(node => ({
                    id: Math.random().toString(),
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(...node.position),
                    color: '#6366f1'
                })));
                setNodes(prev => prev.map(n => ({ ...n, status: 'DOWNLOADING', progress: 0 })));

                setTimeout(() => {
                    setParticles([]);
                    runPhase('TRAINING');
                }, 1500);
                break;

            case 'TRAINING':
                setNodes(prev => prev.map(n => ({ ...n, status: 'TRAINING', progress: 0 })));
                let prog = 0;
                const interval = setInterval(() => {
                    prog += 4;
                    setNodes(prev => prev.map(n => ({ ...n, progress: prog })));
                    if (prog >= 100) {
                        clearInterval(interval);
                        runPhase('PUSHING');
                    }
                }, 80);
                break;

            case 'PUSHING':
                setParticles(nodes.map(node => ({
                    id: Math.random().toString(),
                    start: new THREE.Vector3(...node.position),
                    end: new THREE.Vector3(0, 0, 0),
                    color: '#f43f5e'
                })));
                setNodes(prev => prev.map(n => ({ ...n, status: 'UPLOADING', progress: 0 })));

                setTimeout(() => {
                    setParticles([]);
                    runPhase('AGGREGATING');
                }, 1500);
                break;

            case 'AGGREGATING':
                setNodes(prev => prev.map(n => ({ ...n, status: 'IDLE', progress: 0 })));
                setTimeout(() => {
                    setRound(r => r + 1);
                    updateMetrics();
                    runPhase('FETCHING');
                }, 2000);
                break;
        }
    };

    const updateMetrics = () => {
        setMetrics([
            { label: 'Global Accuracy', value: `${(Math.min(0.25 + (round * 0.08), 0.992) * 100).toFixed(2)}%`, trend: 'up' },
            { label: 'Avg. Loss', value: (2.45 * Math.pow(0.75, round)).toFixed(4), trend: 'down' },
            { label: 'Sync Efficiency', value: `${(95 + Math.random() * 4).toFixed(1)}%`, trend: 'up' },
            { label: 'Model Protocol', value: `FED-AVG / V${4 + round}` },
        ]);
    };

    return (
        <div className="relative w-full h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />

            <div className="absolute inset-0 z-0">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 40 }}>
                    <OrbitControls enableZoom={true} enablePan={false} maxDistance={25} minDistance={8} autoRotate={!isRunning} autoRotateSpeed={0.5} />
                    <Environment preset="city" />
                    <ambientLight intensity={0.15} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
                    <Suspense fallback={null}>
                        <GlobalServer phase={phase} />
                        {nodes.map(node => (
                            <React.Fragment key={node.id}>
                                <Node state={node} />
                                <Line
                                    points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.position)]}
                                    color={phase === 'FETCHING' ? '#6366f1' : phase === 'PUSHING' ? '#f43f5e' : '#ffffff'}
                                    lineWidth={0.5} transparent opacity={phase !== 'IDLE' ? 0.2 : 0.05}
                                />
                            </React.Fragment>
                        ))}
                        {particles.map(p => (
                            <DataParticle key={p.id} start={p.start} end={p.end} duration={1.5} color={p.color} />
                        ))}
                        <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={20} blur={2.5} far={10} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="absolute inset-0 pointer-events-none z-10 p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto">
                        <div className="flex items-center gap-4 mb-2">
                            <ShieldCheck className="text-indigo-500" size={32} />
                            <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.8]">
                                FEDER<span className="text-white/20">SHIELD</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-500" />
                            <p className="text-[11px] text-white/40 uppercase tracking-[0.5em] font-medium">
                                Neural Defense Simulation <span className="text-indigo-400">// Round_{round < 10 ? `0${round}` : round}</span>
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex gap-3 pointer-events-auto mt-2">
                        <button
                            onClick={isRunning ? stopSimulation : startSimulation}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-500 hover:text-white transition-all duration-500"
                        >
                            {isRunning ? <><Pause size={14} fill="currentColor" /> Pause Simulation</> : <><Play size={14} fill="currentColor" /> Start Simulation</>}
                        </button>
                        <button
                            onClick={resetSimulation}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-3xl text-white transition-all"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end gap-10">
                    <div className="grid grid-cols-4 gap-4 pointer-events-auto flex-1">
                        {metrics.map((metric, i) => (
                            <motion.div key={metric.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-white/3 border border-white/5 backdrop-blur-3xl group hover:bg-white/6 transition-all hover:translate-y-[-5px]"
                            >
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4 font-light">{metric.label}</p>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-4xl font-black tracking-tighter text-white group-hover:text-indigo-400 transition-colors">{metric.value}</h3>
                                    {metric.trend && (
                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {metric.trend === 'up' ? '▲' : '▼'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="w-80 h-48 pointer-events-auto rounded-[2.5rem] bg-white/3 border border-white/5 backdrop-blur-3xl p-8 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={12} className="text-indigo-400" />
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium italic">Telemetry</p>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] scrollbar-none opacity-60">
                            <AnimatePresence mode="popLayout">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-indigo-400">{'>'} Initializing Federated_Cluster...</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white">{'>'} Handshake: 8 Nodes Online</motion.div>
                                <motion.div key={phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-purple-400 font-bold uppercase">{'>'} Phase_{phase}</motion.div>
                                {round > 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500">{'>'} Round_{round}_Aggregated: Success</motion.div>}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
