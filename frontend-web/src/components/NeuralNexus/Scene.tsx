'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Skill {
  id: number;
  name: string;
  category: 'hard' | 'soft';
  level: number;
}

interface Props {
  skills: Skill[];
  isSecretMode: boolean;
}

function Word({ children, ...props }: any) {
  const color = new THREE.Color();
  const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false };
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const over = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    if (typeof document !== 'undefined') {
        document.body.style.cursor = 'pointer';
    }
  }
  const out = () => {
    setHovered(false);
    if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
    }
  }

  // Animação suave da cor no hover
  useFrame(({ camera }) => {
    if (ref.current) {
        // Texto sempre olha para a câmera
        ref.current.quaternion.copy(camera.quaternion);
        
        // Interpolação de cor
        ref.current.material.color.lerp(
            color.set(hovered ? props.hoverColor : props.baseColor), 
            0.1
        );
    }
  });

  return (
    <Float floatIntensity={2} rotationIntensity={1}>
        <group {...props}>
            <Text 
                ref={ref as any} 
                onPointerOver={over} 
                onPointerOut={out} 
                {...fontProps} 
                children={children} 
            />
            {/* Esfera Brilhante atrás do texto */}
            <mesh onPointerOver={over} onPointerOut={out}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial 
                    color={hovered ? props.hoverColor : props.baseColor} 
                    emissive={hovered ? props.hoverColor : props.baseColor}
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
        </group>
    </Float>
  )
}

function Cloud({ skills, isSecretMode }: { skills: Skill[], isSecretMode: boolean }) {
  // Cores baseadas no modo
  const baseColor = isSecretMode ? '#ec4899' : '#10b981'; // Pink / Emerald
  const hoverColor = '#ffffff';

  // Distribuição esférica das skills
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    // Garante que skills existam para evitar divisão por zero
    const count = skills.length || 1; 

    for (let i = 0; i < count; i++) {
        // Distribuição Fibonacci Sphere para espalhar uniformemente
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        // Posição
        const vec = new THREE.Vector3().setFromSpherical(spherical.set(10, phi, theta)); // Raio 10
        
        if (skills[i]) {
            temp.push({ 
                pos: vec, 
                word: skills[i].name, 
                level: skills[i].level 
            });
        }
    }
    return temp;
  }, [skills]);

  return (
    <>
      {words.map((item, i) => (
        <Word 
            key={i} 
            position={item.pos} 
            baseColor={baseColor} 
            hoverColor={hoverColor}
        >
            {item.word}
        </Word>
      ))}
      
      {/* Linhas de Conexão (Neural Network) - Apenas visual */}
      <Lines points={words.map(w => w.pos)} color={baseColor} />
    </>
  )
}

function Lines({ points, color }: { points: THREE.Vector3[], color: string }) {
    // Cria conexões aleatórias para simular rede neural
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const linePoints = [];
        // Conecta cada ponto a vizinhos próximos na lista
        for(let i=0; i<points.length; i++) {
            const next = (i + 1) % points.length;
            const skip = (i + 3) % points.length;
            
            linePoints.push(points[i]);
            linePoints.push(points[next]);
            
            // Adiciona conexões extras para densidade se houver pontos suficientes
            if(points.length > 5 && i % 2 === 0) {
                 linePoints.push(points[i]);
                 linePoints.push(points[skip]);
            }
        }
        geo.setFromPoints(linePoints);
        return geo;
    }, [points]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color={color} transparent opacity={0.15} />
        </lineSegments>
    );
}

export default function NeuralScene({ skills, isSecretMode }: Props) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 60 }}>
      <fog attach="fog" args={['#020617', 20, 40]} /> {/* Fade no fundo */}
      <group rotation={[10, 10.5, 10]}>
        <Cloud skills={skills} isSecretMode={isSecretMode} />
      </group>
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2} 
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  )
}
