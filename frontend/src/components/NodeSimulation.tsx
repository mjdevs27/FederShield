'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Sphere, Line, Html, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Server,
    Cpu,
    ShieldCheck,
    Zap,
    Upload,
    FileWarning,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Table as TableIcon,
    AlertCircle,
    Info,
    ChevronRight,
    ArrowUpRight,
    Database,
    FileJson,
    BarChart3,
    RotateCcw,
    ArrowRight
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Preload the same model used in the main simulation
useGLTF.preload('/server_rack_and_console_v3.glb');

// --- Types ---
type NodeStatus = 'IDLE' | 'DOWNLOADING' | 'UPLOADING' | 'ERROR' | 'SUCCESS';

interface NodeData {
    id: number;
    name: string;
    type: 'HONEST' | 'MALICIOUS';
    position: [number, number, number];
    status: NodeStatus;
}

// --- 3D Components ---

const DataParticle = ({ start, end, duration, color, onComplete }: { start: THREE.Vector3, end: THREE.Vector3, duration: number, color: string, onComplete?: () => void }) => {
    const ref = useRef<THREE.Mesh>(null);
    const startTime = useRef(Date.now());

    useFrame(() => {
        if (!ref.current) return;
        const elapsed = (Date.now() - startTime.current) / 1000;
        const alpha = Math.min(elapsed / duration, 1);

        ref.current.position.lerpVectors(start, end, alpha);
        // Add a slight arc for aesthetics
        ref.current.position.y += Math.sin(alpha * Math.PI) * 1;

        if (alpha >= 1) {
            ref.current.visible = false;
            if (onComplete) onComplete();
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
            <pointLight distance={1} intensity={2} color={color} />
        </mesh>
    );
};

const Node = ({ data, onClick }: { data: NodeData, onClick: () => void }) => {
    const getStatusColor = () => {
        switch (data.status) {
            case 'DOWNLOADING': return '#6366f1';
            case 'UPLOADING': return '#f43f5e';
            case 'ERROR': return '#ef4444';
            case 'SUCCESS': return '#10b981';
            default: return data.type === 'MALICIOUS' ? '#f43f5e33' : '#ffffff22';
        }
    };

    return (
        <group position={data.position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.8}>
                <mesh
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    <octahedronGeometry args={[0.35, 0]} />
                    <meshStandardMaterial
                        color={getStatusColor()}
                        emissive={getStatusColor()}
                        emissiveIntensity={data.status !== 'IDLE' ? 2 : 0.2}
                        wireframe={data.status === 'IDLE'}
                    />
                </mesh>
            </Float>
            <Html distanceFactor={12} position={[0, 0.8, 0]} center>
                <div className="flex flex-col items-center pointer-events-none select-none whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${data.type === 'MALICIOUS' ? 'text-rose-500/60' : 'text-white/40'}`}>
                        {data.name}
                    </span>
                    {data.status !== 'IDLE' && (
                        <div className={`mt-2 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${data.status === 'ERROR' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            data.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>
                            {data.status}
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
};

const GlobalHub = ({ isBusy, onClick }: { isBusy: boolean, onClick: () => void }) => {
    const { scene } = useGLTF('/server_rack_and_console_v3.glb');
    const groupRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
        }
        if (lightRef.current) {
            lightRef.current.intensity = isBusy ? 10 + Math.sin(state.clock.elapsedTime * 30) * 8 : 2;
        }
    });

    return (
        <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <group ref={groupRef} scale={0.45} position={[0, -0.8, 0]}>
                <primitive object={clonedScene} rotation={[0, -Math.PI / 4, 0]} />
            </group>

            <pointLight
                ref={lightRef}
                position={[0, 0.5, 0]}
                color="#6366f1"
                distance={12}
                intensity={2}
            />

            <Html distanceFactor={10} position={[0, 1.8, 0]} center>
                <div className="flex flex-col items-center pointer-events-none select-none">
                    <div className="flex items-center gap-2">
                        <Database size={14} className="text-indigo-500" />
                        <span className="text-sm font-black text-white uppercase tracking-[0.5em]">CENTRAL_HUB</span>
                    </div>
                </div>
            </Html>
        </group>
    );
};

// --- Page Component ---

export default function NodeSimulation() {
    const [nodes, setNodes] = useState<NodeData[]>([
        { id: 1, name: 'Client1 [v1]', type: 'HONEST', position: [5, 1, 0], status: 'IDLE' },
        { id: 2, name: 'Client2 [v1]', type: 'MALICIOUS', position: [-5, 1, 0], status: 'IDLE' },
        { id: 3, name: 'Client3 [v2]', type: 'HONEST', position: [0, 1, -5], status: 'IDLE' },
    ]);

    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isAggregating, setIsAggregating] = useState(false);
    const [logs, setLogs] = useState<{ m: string, t: 'i' | 'e' | 's' }[]>([
        { m: 'Node Terminal initialized. Waiting for handshake...', t: 'i' }
    ]);
    const [particles, setParticles] = useState<{ id: string, start: THREE.Vector3, end: THREE.Vector3, color: string }[]>([]);
    const [accuracy, setAccuracy] = useState(82.4);

    // Metrics for sidebar
    const [stalenessData, setStalenessData] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({ t: i, v: 40 + Math.random() * 20 }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setStalenessData(prev => {
                const next = [...prev.slice(1), { t: prev[prev.length - 1].t + 1, v: 30 + Math.random() * 40 }];
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (m: string, t: 'i' | 'e' | 's' = 'i') => {
        setLogs(prev => [...prev.slice(-6), { m, t }]);
    };

    const handleNodeAction = (node: NodeData) => {
        setSelectedNode(node);
    };

    const triggerCycle = (nodeId: number, isMalicious: boolean) => {
        const node = nodes.find(n => n.id === nodeId)!;
        setSelectedNode(null);

        // Phase 1: Incoming Animation (File Upload)
        setParticles(prev => [...prev, {
            id: Math.random().toString(),
            start: new THREE.Vector3(...node.position),
            end: new THREE.Vector3(0, 0.5, 0),
            color: isMalicious ? '#f43f5e' : '#10b981'
        }]);

        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'UPLOADING' } : n));
        addLog(`Incoming payload from ${node.name}...`, 'i');

        setTimeout(() => {
            setParticles([]);
            setIsAggregating(true);
            addLog(`GCP Hub: Verifying intelligence integrity...`, 'i');

            setTimeout(() => {
                setIsAggregating(false);
                if (isMalicious) {
                    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'ERROR' } : n));
                    addLog(`ADVERSARY DETECTED: Rejected from ${node.name}`, 'e');
                } else {
                    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'SUCCESS' } : n));
                    addLog(`Handshake valid. ${node.name} integrated.`, 's');

                    // Increment accuracy on successful sync
                    setAccuracy(prev => Math.min(prev + 4.2, 99.9));

                    // Phase 2: Outgoing Animation (Model Update)
                    setParticles([{
                        id: Math.random().toString(),
                        start: new THREE.Vector3(0, 0.5, 0),
                        end: new THREE.Vector3(...node.position),
                        color: '#6366f1'
                    }]);
                    addLog(`Propagating global weights to ${node.name}`, 'i');

                    setTimeout(() => setParticles([]), 1500);
                }
            }, 2000);
        }, 1500);
    };

    return (
        <div className="relative w-full h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
            {/* Visual Noise Layer */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-5" />

            <div className="absolute inset-0 z-0">
                <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }}>
                    <OrbitControls enablePan={false} maxDistance={15} minDistance={6} />
                    <Environment preset="city" />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#6366f1" />

                    <Suspense fallback={null}>
                        <GlobalHub isBusy={isAggregating} onClick={() => setShowSidebar(true)} />

                        {nodes.map(node => (
                            <group key={node.id}>
                                <Node data={node} onClick={() => handleNodeAction(node)} />
                                <Line
                                    points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(...node.position)]}
                                    color={node.status === 'ERROR' ? '#f43f5e' : node.status === 'SUCCESS' ? '#10b981' : '#ffffff'}
                                    lineWidth={0.5} transparent opacity={0.15}
                                />
                            </group>
                        ))}

                        {particles.map(p => (
                            <DataParticle
                                key={p.id}
                                start={p.start}
                                end={p.end}
                                duration={1.5}
                                color={p.color}
                            />
                        ))}
                    </Suspense>

                    <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={20} blur={2.4} />
                </Canvas>
            </div>

            {/* UI - Overlays */}
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <ShieldCheck className="text-indigo-500" size={32} />
                            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                                NODE<span className="text-white/20">TEST</span>
                            </h1>
                        </div>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold">Protocol Validation Cluster_V4</p>
                    </div>

                    {/* <button
                        onClick={() => setShowSidebar(true)}
                        className="pointer-events-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex items-center gap-4 group transition-all"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] text-white/30 uppercase tracking-widest font-black">Aggregator Status</span>
                            <span className="text-xs font-black text-indigo-400">SYNC_READY</span>
                        </div>
                        <Server size={20} className="text-white/20 group-hover:text-indigo-500 transition-colors" />
                    </button> */}
                </div>

                <div className="flex justify-between items-end">
                    <div className="max-w-md w-full pointer-events-auto">
                        <div className="bg-black/80 backdrop-blur-3xl border border-white/5 rounded-4xl p-8 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Hub_Telemetry</span>
                                </div>
                                <Activity size={12} className="text-white/10" />
                            </div>
                            <div className="space-y-3 font-mono text-[10px]">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-3 ${log.t === 'e' ? 'text-rose-400' : log.t === 's' ? 'text-emerald-400' : 'text-white/50'
                                        }`}>
                                        <span className="opacity-20 self-start">[{i}]</span>
                                        <span className="leading-relaxed">{log.m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Node Details & Upload */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                        onClick={() => setSelectedNode(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-lg bg-[#080808] border border-white/10 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] pointer-events-none" />

                            <div className="flex items-center gap-6 mb-10">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedNode.type === 'MALICIOUS' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                    } border`}>
                                    {selectedNode.type === 'MALICIOUS' ? <FileWarning size={32} /> : <Cpu size={32} />}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedNode.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${selectedNode.type === 'MALICIOUS' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {selectedNode.type}
                                        </span>
                                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">ID_X0{selectedNode.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="p-6 rounded-3xl bg-white/2 border border-white/5 border-dashed">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">
                                        <Database size={12} /> Local Storage Payload
                                    </h4>

                                    <div className="space-y-4">
                                        <FileRow icon={FileJson} label="Weights (.safetensors)" required />
                                        <FileRow icon={BarChart3} label="Confusion Matrix (JSON)" />
                                        <FileRow icon={TableIcon} label="Classification Report (CSV)" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => triggerCycle(selectedNode.id, selectedNode.type === 'MALICIOUS')}
                                    className="flex-1 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3"
                                >
                                    <Zap size={14} fill="currentColor" /> Synchronize Node
                                </button>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="px-8 py-6 bg-white/5 text-white/40 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showSidebar && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed top-0 right-0 h-full w-[480px] bg-[#080808]/90 backdrop-blur-3xl border-l border-white/10 z-60 p-12 flex flex-col overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-black">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Hub Metrics</h3>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Real-time Staleness Monitor</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSidebar(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="space-y-10">
                            {/* Staleness Graph */}
                            <div className="p-10 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10">
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Temporal Weight Decay</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span className="text-[10px] text-white font-mono opacity-60">AGGREGATOR_V4</span>
                                    </div>
                                </div>

                                <div className="h-64 w-full -ml-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stalenessData}>
                                            <defs>
                                                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis hide dataKey="t" />
                                            <YAxis hide domain={[0, 100]} />
                                            <Area
                                                type="monotone"
                                                dataKey="v"
                                                stroke="#6366f1"
                                                strokeWidth={4}
                                                fill="url(#glow)"
                                                isAnimationActive={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-8 flex justify-between px-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-px h-1.5 bg-white/10" />
                                    ))}
                                </div>
                            </div>

                            {/* Protocol Registry */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={14} className="text-indigo-400" />
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-black">Protocol Registry</span>
                                </div>
                                <div className="space-y-2">
                                    <RegistryRow label="Alpha / Global" version="v1.0" role="HONEST" />
                                    <RegistryRow label="Beta / Shadow" version="v1.0" role="ADVERSARY" isMalicious />
                                    <RegistryRow label="Gamma / Edge" version="v2.0" role="HONEST" isNew />
                                </div>
                                <p className="text-[9px] text-white/20 mt-4 leading-relaxed px-2">
                                    Handshake validation logic: Weights from <span className="text-white/40 font-bold">ADVERSARY</span> nodes are automatically scrubbed during the FedAvg cycle. Version 2.0 nodes utilize enhanced L2-Norm compression.
                                </p>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-5">
                                <MetricBox label="Active Clients" value="03" sub="V4 Cluster" />
                                <MetricBox label="Accuracy" value={`${accuracy.toFixed(1)}%`} sub={`+${(accuracy - 82.4).toFixed(1)}`} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FileRow({ icon: Icon, label, required }: { icon: any, label: string, required?: boolean }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                    <Icon size={16} />
                </div>
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">
                    {label} {required && <span className="text-indigo-500">*</span>}
                </span>
            </div>
            <ArrowUpRight size={14} className="text-white/10 group-hover:text-indigo-500 transition-colors" />
        </div>
    );
}

function MetricBox({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/2 border border-white/5">
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-4">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                <span className="text-[9px] font-bold text-indigo-500 uppercase">{sub}</span>
            </div>
        </div>
    );
}

function RegistryRow({ label, version, role, isMalicious, isNew }: { label: string, version: string, role: string, isMalicious?: boolean, isNew?: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    isMalicious ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" :
                        isNew ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                )} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/80 tracking-tight transition-colors group-hover:text-white">{label}</span>
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{role}</span>
                </div>
            </div>
            <div className={cn(
                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                isNew ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-white/5 text-white/30 border-white/5"
            )}>
                {version}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
